"use client";

import Image from "next/image";
import type { BlogPost } from "@/lib/blogTypes";
import { slugifyHeading, getBlogSectionImage } from "@/lib/blogImages";

interface BlogContentProps {
  post: BlogPost;
}

export default function BlogContent({ post }: BlogContentProps) {
  let h2Index = 0;
  let isLeadParagraph = true;

  return (
    <div className="blog-prose">
      {post.sections.map((section, i) => {
        if (section.type === "h2") {
          h2Index += 1;
          const id = slugifyHeading(section.text);
          const showImage = h2Index > 1;

          return (
            <div key={i}>
              <h2 id={id} className="scroll-mt-28">
                {section.text}
              </h2>
              {showImage && (
                <figure className="blog-figure">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-theme-subtle">
                    <Image
                      src={getBlogSectionImage(post, h2Index)}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 720px"
                      className="object-cover"
                    />
                  </div>
                </figure>
              )}
            </div>
          );
        }

        if (section.type === "h3") {
          return (
            <h3 key={i} id={slugifyHeading(section.text)} className="scroll-mt-28">
              {section.text}
            </h3>
          );
        }

        const isLead = isLeadParagraph;
        isLeadParagraph = false;

        return (
          <p key={i} className={isLead ? "lead" : undefined}>
            {section.text}
          </p>
        );
      })}
    </div>
  );
}
