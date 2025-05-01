import { getSortedPostsData, PostData } from '../../lib/posts';
import { BlogCard } from '@/components/blog-card';

export default function BlogIndexPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="flex flex-col max-w-5xl mx-auto">
      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post: PostData) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No blog posts found.</p>
      )}
    </div>
  );
} 