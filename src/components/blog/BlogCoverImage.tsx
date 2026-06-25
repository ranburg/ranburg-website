import Image from "next/image";
import type { BlogPost } from "@/lib/blogTypes";
import { inferBlogCategory } from "@/lib/blogCategories";
import { getBlogCoverImage, getBlogCategoryGradient } from "@/lib/blogImages";
import { cn } from "@/lib/utils";

interface BlogCoverImageProps {
  post: BlogPost;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  overlay?: "light" | "strong" | "none";
}

export default function BlogCoverImage({
  post,
  priority = false,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  overlay = "light",
}: BlogCoverImageProps) {
  const category = inferBlogCategory(post);
  const src = getBlogCoverImage(post);
  const gradient = getBlogCategoryGradient(category);

  return (
    <div className={cn("relative overflow-hidden bg-theme-surface", className)}>
      <Image
        src={src}
        alt={post.title}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover transition-transform duration-500 group-hover:scale-105", imageClassName)}
      />
      {overlay !== "none" && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t",
            gradient,
            overlay === "strong" ? "opacity-90" : "opacity-70"
          )}
        />
      )}
    </div>
  );
}
