import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), '/src/content/blog/');

// Define the structure for frontmatter
interface Frontmatter {
  title: string;
  date: string;
  category: string;
  readTime: string;
  image?: string; // Optional image
}

// Define the structure for post data including slug and potential neighbours
export interface PostData extends Frontmatter {
  slug: string;
  contentHtml?: string; // Content only needed for single post page
  previousPost?: { slug: string; title: string } | null;
  nextPost?: { slug: string; title: string } | null;
}

export function getSortedPostsData(): PostData[] {
  // Get file names under /content/blog
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // Ensure we only read markdown files
    .map(fileName => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...(matterResult.data as Frontmatter),
      };
    });

  // Sort posts by date (newest first)
  const sortedPosts = allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Add previous/next post info
  return sortedPosts.map((post, index) => {
    const previousPost = index > 0 ? { slug: sortedPosts[index - 1].slug, title: sortedPosts[index - 1].title } : null;
    const nextPost = index < sortedPosts.length - 1 ? { slug: sortedPosts[index + 1].slug, title: sortedPosts[index + 1].title } : null;
    return {
      ...post,
      previousPost,
      nextPost,
    };
  });
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found for slug: ${slug}`);
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Find previous/next post data by re-fetching sorted list
  // This is slightly inefficient but simpler than passing the whole list around
  const sortedPosts = getSortedPostsData(); // Re-call to get sorted list with neighbors
  const currentPostIndex = sortedPosts.findIndex(p => p.slug === slug);
  
  const postData = sortedPosts[currentPostIndex];

  // Combine the data with the slug and contentHtml
  return {
    slug,
    contentHtml,
    ...(matterResult.data as Frontmatter),
    previousPost: postData.previousPost,
    nextPost: postData.nextPost,
  };
} 