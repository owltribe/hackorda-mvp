import { getSortedPostsData, PostData } from '../../lib/posts';
import { BlogCard } from '@/components/blog-card';

export default function BlogIndexPage() {
  const allPosts = getSortedPostsData();

  return (
    <section className="w-full space-y-6">

      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-muted-foreground">Enjoy reading our latest blogs!</p>
        </div>
      </div>

      <div className="border rounded-lg"></div>

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

    </section>
  );
} 