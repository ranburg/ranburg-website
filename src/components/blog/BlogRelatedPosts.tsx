import type { BlogPost } from "@/lib/blogTypes";
import BlogCard from "@/components/blog/BlogCard";

interface BlogRelatedPostsProps {
  posts: BlogPost[];
}

export default function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-theme-subtle pt-12">
      <h2 className="text-2xl font-bold text-theme-heading">Related articles</h2>
      <p className="mt-2 text-theme-muted">More guides from the same topic area.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
