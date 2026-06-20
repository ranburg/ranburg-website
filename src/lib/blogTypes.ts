export interface BlogSection {
  type: "h2" | "h3" | "p";
  text: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export type BlogCategoryId =
  | "seo"
  | "development"
  | "business-productivity"
  | "ai-tools"
  | "salesforce"
  | "creators"
  | "monetization"
  | "calculators"
  | "generators"
  | "digital-marketing"
  | "small-business";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: BlogCategoryId;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  sections: BlogSection[];
  faq: BlogFaq[];
  relatedServices: string[];
  relatedTools: string[];
  /** Primary tool this article promotes — shown as featured CTA */
  featuredToolSlug?: string;
}
