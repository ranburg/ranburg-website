import type { BlogPost } from "./blogTypes";
import { SEO_BLOG_TOPICS } from "./seoBlogTopics";
import { generateSeoBlogPost } from "./generateSeoBlogPost";

export const SEO_CLUSTER_BLOG_POSTS: BlogPost[] = SEO_BLOG_TOPICS.map((topic, i) =>
  generateSeoBlogPost(topic, i)
);
