export interface BlogSection {
  type: "h2" | "h3" | "p";
  text: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category?: "seo" | "development" | "business-productivity" | "ai-tools" | "salesforce";
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  sections: BlogSection[];
  faq: BlogFaq[];
  relatedServices: string[];
  relatedTools: string[];
}
