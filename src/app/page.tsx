import { InProgressQuizNotifier } from "@/components/notifications/InProgressQuizNotifier";
import { currentUser } from "@clerk/nextjs/server";
import { BlogCard } from "@/components/blog-card";
import { getSortedPostsData, PostData } from "../lib/posts";
import Link from "next/link";
import { Flame, Users } from 'lucide-react';

export default async function Home() {
  const user = await currentUser();
  const latestPosts = getSortedPostsData().slice(0, 6);

  return (
    <section className="w-full space-y-6">
    <InProgressQuizNotifier />

      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-foreground">Welcome, {user?.firstName|| 'Guest'}!</h1>
          <p className="text-lg text-muted-foreground">Ready to expore?</p>
        </div>
      </div>

      <div className="border rounded-lg"></div>

      <div className="flex flex-row gap-6">

        <article className="flex flex-col w-full lg:w-3/4 space-y-6">
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl text-foreground">Latest Blogs</h2>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary hover:cursor-pointer">View All</Link>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {latestPosts.map((post: PostData) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No blog posts found yet.</p>
          )}
        </article>

        <div className="border rounded-lg"></div>

        <aside className="flex flex-col w-full lg:w-1/4">
          <h2 className="text-xl mb-6 text-foreground">Personal</h2>
          
          <div className="flex flex-col gap-6">
            <Link href="/profile" className="flex justify-between items-center p-4 border border-border rounded-lg shadow-md hover:shadow-green-brand transition-shadow duration-300">
              <div className="flex flex-col">
                <h3 className="font-semibold text-foreground">Complete your profile</h3>
                <p className="text-sm text-muted-foreground">Add your details for custom recommendations.</p>
              </div>
              <div className="relative h-10 w-10">
                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-muted" strokeWidth="3"></circle>
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="100" strokeDashoffset="50" transform="rotate(-90 18 18)"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">2/4</span>
              </div>
            </Link>

            <Link href="/quiz" className="flex justify-between items-center p-4 border border-border rounded-lg shadow-md hover:shadow-green-brand transition-shadow duration-300">
              <div className="flex flex-col">
                <h3 className="font-semibold text-foreground">Take an Exam</h3>
                <p className="text-sm text-muted-foreground">Join leaderboard and compete with others.</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </Link>

            <Link href="/" className="flex justify-between items-center p-4 border border-border rounded-lg shadow-md hover:shadow-green-brand transition-shadow duration-300">
              <div className="flex flex-col">
                <h3 className="font-semibold text-foreground">Invite your friends</h3>
                <p className="text-sm text-muted-foreground">Learning together is double the fun!</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </Link>

          </div>
        </aside>

      </div>

      <div className="border rounded-lg"></div>

      {/* <div className="flex flex-row gap-8">
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl text-foreground">Quick Start</h1>

          </div>
        </div>
      </div> */}

    </section>
  );
}