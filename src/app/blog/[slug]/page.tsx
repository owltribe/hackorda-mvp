import { getAllPostSlugs, getPostData, PostData } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;  
  };
}

export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  return paths;
}

// Generate metadata for the page (title, description, etc.)
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const paramsData = await params;
    const post = await getPostData(paramsData.slug);
    return {
      title: post.title,
    };
  } catch (error) {
    console.log("Error generating metadata: ", error);
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post: PostData;
  try {
    const paramsData = await params; // Removed await
    post = await getPostData(paramsData.slug); // Use params directly
  } catch (error) {
    console.log("Error getting post data: ", error);
    // If getPostData throws (e.g., file not found), trigger 404
    notFound();
  }

  const displayDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <article className="mx-auto max-w-5xl space-y-8">
      {/* Back Button */}
      {/* <Button asChild variant="outline" className="mb-6 pl-0 text-muted-foreground hover:text-foreground">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all articles
        </Link>
      </Button> */}

      {/* Post Header */}
      <div className="space-y-4">
        <span className="text-green-brand text-sm">
          {post.category}
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center text-sm text-green-brand space-x-2">
          <time dateTime={post.date}>{displayDate}</time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      
      <div className="border rounded-lg"></div>

      {/* Optional Featured Image */}
      {post.image && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
          <Image 
            src={post.image} 
            alt={`Featured image for ${post.title}`}
            fill
            className="object-cover"
            priority // Prioritize loading the main image for the post
          />
        </div>
      )}

      {/* Post Content */}
      <div 
        className="max-w-none prose dark:text-white dark:prose-a:text-white dark:prose-headings:text-white dark:prose-strong:text-white dark:prose-code:text-white font-mono text-xl text-justify leading-normal prose-img:rounded-md prose-img:w-full"
        dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }} 
      />

      <div className="border rounded-lg"></div>

      {/* Previous/Next Navigation */}
      <div className="flex justify-between items-center gap-4">
        {post.previousPost ? (
          <Button asChild variant="ghost" className="justify-start text-left h-auto py-3">
            <Link href={`/blog/${post.previousPost.slug}`} className="flex items-center">
              <ArrowLeft className="mr-3 h-4 w-4 flex-shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Previous Post</div>
                {/* <div className="mt-1 font-medium line-clamp-2">{post.previousPost.title}</div> */}
              </div>
            </Link>
          </Button>
        ) : (
          <div></div>
        )}

        {post.nextPost ? (
          <Button asChild variant="ghost" className="justify-end text-right h-auto py-3">
            <Link href={`/blog/${post.nextPost.slug}`} className="flex items-center">
              <div>
                <div className="text-xs text-muted-foreground">Next Post</div>
                {/* <div className="mt-1 font-medium line-clamp-2">{post.nextPost.title}</div> */}
              </div>
              <ArrowRight className="ml-3 h-4 w-4 flex-shrink-0" />
            </Link>
          </Button>
        ) : (
          <div></div>
        )}
      </div>
    </article>
  );
} 