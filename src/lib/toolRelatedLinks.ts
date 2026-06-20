/** Explicit related-tool links for internal SEO linking */
export const TOOL_RELATED_LINKS: Record<string, string[]> = {
  "jpg-to-png": ["png-to-jpg", "webp-to-png", "image-compressor", "png-to-webp"],
  "png-to-jpg": ["jpg-to-png", "image-compressor", "webp-to-png", "image-resizer"],
  "webp-to-png": ["png-to-webp", "jpg-to-png", "image-compressor", "image-converter"],
  "png-to-webp": ["webp-to-png", "image-compressor", "image-converter", "jpg-to-png"],
  "image-compressor": ["image-resizer", "jpg-to-png", "png-to-webp", "webp-to-png"],
  "image-resizer": ["image-compressor", "crop-image", "jpg-to-png", "png-to-jpg"],
  "crop-image": ["image-resizer", "image-compressor", "jpg-to-png", "png-to-jpg"],
  "image-to-base64": ["base64-to-image", "base64-encoder", "image-compressor", "jpg-to-png"],
  "base64-to-image": ["image-to-base64", "base64-encoder", "jpg-to-png", "png-to-jpg"],
  "remove-exif": ["image-compressor", "jpg-to-png", "png-to-jpg", "image-resizer"],
  "heic-to-jpg": ["jpg-to-png", "png-to-jpg", "image-compressor", "image-resizer"],
  "svg-to-png": ["png-to-jpg", "jpg-to-png", "image-resizer", "image-compressor"],
  "image-converter": ["webp-to-png", "png-to-webp", "image-compressor", "image-to-base64"],

  "pdf-merge": ["pdf-split", "pdf-compressor", "pdf-page-extractor", "pdf-tools"],
  "pdf-split": ["pdf-merge", "pdf-page-extractor", "pdf-page-remover", "pdf-tools"],
  "pdf-compressor": ["pdf-merge", "pdf-split", "jpg-to-pdf", "pdf-to-jpg"],
  "pdf-to-jpg": ["jpg-to-pdf", "pdf-compressor", "pdf-split", "image-compressor"],
  "jpg-to-pdf": ["pdf-to-jpg", "pdf-merge", "word-to-pdf", "pdf-compressor"],
  "word-to-pdf": ["jpg-to-pdf", "pdf-merge", "pdf-compressor", "pdf-split"],
  "pdf-page-extractor": ["pdf-page-remover", "pdf-split", "pdf-merge", "pdf-tools"],
  "pdf-page-remover": ["pdf-page-extractor", "pdf-split", "pdf-merge", "pdf-compressor"],
  "pdf-tools": ["pdf-merge", "pdf-split", "pdf-page-extractor", "pdf-compressor"],

  "keyword-density-checker": ["word-counter", "meta-tag-generator", "slug-generator", "case-converter"],
  "meta-tag-generator": ["open-graph-generator", "schema-markup-generator", "robots-txt-generator", "slug-generator"],
  "robots-txt-generator": ["xml-sitemap-generator", "meta-tag-generator", "open-graph-generator", "slug-generator"],
  "xml-sitemap-generator": ["robots-txt-generator", "meta-tag-generator", "slug-generator", "schema-markup-generator"],
  "open-graph-generator": ["meta-tag-generator", "schema-markup-generator", "social-media-character-counter", "slug-generator"],
  "schema-markup-generator": ["open-graph-generator", "meta-tag-generator", "json-formatter", "xml-sitemap-generator"],
  "url-encoder-decoder": ["base64-encoder", "slug-generator", "case-converter", "json-formatter"],
  "word-counter": ["keyword-density-checker", "case-converter", "lorem-ipsum", "linkedin-formatter"],
  "slug-generator": ["case-converter", "meta-tag-generator", "url-encoder-decoder", "word-counter"],
  "case-converter": ["slug-generator", "word-counter", "url-encoder-decoder", "linkedin-formatter"],

  "youtube-tags-generator": ["youtube-description-generator", "youtube-hashtag-generator", "youtube-revenue-calculator", "youtube-channel-insights"],
  "youtube-description-generator": ["youtube-tags-generator", "youtube-hashtag-generator", "social-media-character-counter", "youtube-revenue-calculator"],
  "youtube-hashtag-generator": ["youtube-tags-generator", "instagram-hashtag-generator", "youtube-description-generator", "youtube-revenue-calculator"],
  "instagram-hashtag-generator": ["youtube-hashtag-generator", "instagram-engagement-calculator", "instagram-profile-insights", "instagram-revenue-calculator"],
  "instagram-engagement-calculator": ["instagram-profile-insights", "instagram-revenue-calculator", "instagram-hashtag-generator", "tiktok-engagement-calculator"],
  "tiktok-engagement-calculator": ["tiktok-earnings-calculator", "instagram-engagement-calculator", "youtube-channel-insights", "social-media-character-counter"],
  "tiktok-earnings-calculator": ["tiktok-engagement-calculator", "youtube-revenue-calculator", "instagram-revenue-calculator", "adsense-revenue-calculator"],
  "social-media-character-counter": ["linkedin-formatter", "youtube-description-generator", "instagram-hashtag-generator", "open-graph-generator"],

  "profit-margin-calculator": ["roi-calculator", "break-even-calculator", "gst-calculator", "invoice-generator"],
  "roi-calculator": ["profit-margin-calculator", "break-even-calculator", "ltv-cac", "adsense-revenue-calculator"],
  "break-even-calculator": ["profit-margin-calculator", "roi-calculator", "gst-calculator", "invoice-generator"],
  "gst-calculator": ["invoice-generator", "profit-margin-calculator", "emi", "currency-converter"],
  "emi": ["loan-foreclosure-calculator", "sip", "gst-calculator", "currency-converter"],
  "sip": ["swp", "emi", "roi-calculator", "currency-converter"],
  "invoice-generator": ["gst-calculator", "profit-margin-calculator", "currency-converter", "pdf-merge"],

  "qr-generator": ["qr-code-generator", "uuid-generator", "password-generator", "open-graph-generator"],
  "qr-code-generator": ["qr-generator", "uuid-generator", "password-generator", "meta-tag-generator"],
};

export function getExplicitRelatedSlugs(slug: string): string[] {
  return TOOL_RELATED_LINKS[slug] ?? [];
}
