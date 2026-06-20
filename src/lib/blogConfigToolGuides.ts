import type { BlogPost } from "./blogTypes";
import { TOOLS_CONFIG } from "./toolsConfig";
import { SEO_CLUSTER_BLOG_POSTS } from "./blogConfigSeoClusters";
import { generateToolGuideBlog } from "./generateToolGuideBlog";

function getFeaturedToolSlug(post: BlogPost): string | undefined {
  return post.featuredToolSlug ?? post.relatedTools[0];
}

function getCoveredToolSlugs(posts: BlogPost[]): Set<string> {
  const covered = new Set<string>();
  for (const post of posts) {
    const featured = getFeaturedToolSlug(post);
    if (featured) covered.add(featured);
  }
  return covered;
}

const coveredBySeo = getCoveredToolSlugs(SEO_CLUSTER_BLOG_POSTS);
const missingTools = TOOLS_CONFIG.filter((t) => !coveredBySeo.has(t.slug));

/** Dedicated guides for tools not yet featured as primary in any SEO cluster blog */
export const TOOL_GUIDE_BLOG_POSTS: BlogPost[] = missingTools.map((tool, i) =>
  generateToolGuideBlog(tool, i)
);

export function buildToolToBlogMap(allPosts: BlogPost[]): Map<string, string> {
  const map = new Map<string, string>();

  for (const tool of TOOLS_CONFIG) {
    const exactGuide = allPosts.find((p) => p.slug === `${tool.slug}-guide`);
    if (exactGuide) {
      map.set(tool.slug, exactGuide.slug);
      continue;
    }

    const featured = allPosts.find((p) => p.featuredToolSlug === tool.slug);
    if (featured) {
      map.set(tool.slug, featured.slug);
      continue;
    }

    const primary = allPosts.find((p) => p.relatedTools[0] === tool.slug);
    if (primary) {
      map.set(tool.slug, primary.slug);
      continue;
    }

    const any = allPosts.find((p) => p.relatedTools.includes(tool.slug));
    if (any) map.set(tool.slug, any.slug);
  }

  return map;
}
