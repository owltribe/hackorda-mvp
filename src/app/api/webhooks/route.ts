import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set in environment variables.');
    return new Response('Internal Server Error: Webhook secret not configured', { status: 500 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured during webhook verification', {
      status: 400
    });
  }

  const { id } = evt.data; // This is the Clerk User ID
  const eventType = evt.type;

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`);

  // Handle the user.created event
  if (eventType === 'user.created') {
    // Extract relevant data from the event payload
    const { id: clerkId, email_addresses, first_name, last_name, created_at, updated_at } = evt.data;

    if (!clerkId || !email_addresses || email_addresses.length === 0) {
        console.error('Error processing user.created: Missing clerkId or email');
        return new Response('Error occured -- missing essential user data', { status: 400 });
    }

    // Find the primary email address
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id) || email_addresses[0];

    if (!primaryEmail) {
      console.error('Error processing user.created: Could not determine primary email');
      return new Response('Error occured -- could not find primary email', { status: 400 });
    }

    try {
      // Check if user already exists
      const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.clerkId, clerkId)).limit(1);

      if (existingUser.length > 0) {
        console.log(`User with Clerk ID ${clerkId} already exists. Skipping creation.`);
        return new Response('User already exists', { status: 200 });
      }

      // Insert the new user into the database using the updated schema
      await db.insert(users).values({
        clerkId: clerkId,
        email: primaryEmail.email_address,
        firstName: first_name,
        lastName: last_name,
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
      });

      console.log(`Successfully created user with Clerk ID ${clerkId}`);
      return new Response('User created successfully', { status: 201 });

    } catch (error) {
      console.error('Error inserting user into database:', error);
      return new Response('Internal Server Error: Failed to process user creation', { status: 500 });
    }
  }

  // TODO: Handle other event types like user.updated, user.deleted if needed
  if (eventType === 'user.updated') {
    // Similar logic to user.created, but use an update query
    // db.update(users).set({ ... }).where(eq(users.clerkId, clerkId));
    console.log(`Handling user.updated for Clerk ID: ${id}`);
    // Add your update logic here
  }

  if (eventType === 'user.deleted') {
    // Handle user deletion
    // db.delete(users).where(eq(users.clerkId, id)); // Use 'id' directly from evt.data for deletion
    console.log(`Handling user.deleted for Clerk ID: ${id}`);
    // Add your delete logic here (use evt.data.id which is the clerkId)
    // Make sure to handle potential cascading deletes or related data cleanup
  }

  console.log(`Webhook event type ${eventType} received but not explicitly handled.`);
  return new Response('Webhook received', { status: 200 });
}