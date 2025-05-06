'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PostData } from '../lib/posts'; // Adjust relative path further

// Use a subset of PostData needed for the card
type BlogCardPost = Pick<PostData, 'slug' | 'title' | 'date' | 'category' | 'readTime' | 'image'>;

interface BlogCardProps {
  post: BlogCardPost;
}

/**
 * Renders a single blog post card.
 */
export const BlogCard = ({ post }: BlogCardProps) => {
  // Format date for display (optional, could also be done in getSortedPostsData)
  const displayDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <article 
      className="hover:shadow-green-brand transition-shadow duration-300 bg-card text-card-foreground rounded-lg shadow-md overflow-hidden border border-border group flex flex-col h-full"
      aria-labelledby={`blog-title-${post.slug}`}
    >
      <Link 
        href={`/blog/${post.slug}`} // Update href to use slug
        aria-label={`Read more about ${post.title}`}
        className="flex flex-col h-full"
      >
        {post.image && (
          <div className="relative w-full h-50 flex-shrink-0">
            <Image 
              src={post.image} 
              alt={`Featured image for ${post.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              // priority={post.id <= 3} // Cannot easily prioritize based on slug, maybe remove or adjust logic
            />
          </div>
        )}
        <div className="p-4 space-y-3 flex flex-col flex-grow">
          <span className="inline-block text-green-brand text-xs font-semibold px-2.5 py-0.5 rounded-full border border-border w-fit">
            {post.category}
          </span>
          <h3 
            id={`blog-title-${post.slug}`}
            className="text-base font-semibold leading-tight group-hover:text-primary transition-colors duration-200 flex-grow"
          >
            {post.title}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground space-x-2 mt-auto pt-2">
            <time dateTime={post.date}>{displayDate}</time> 
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}; 