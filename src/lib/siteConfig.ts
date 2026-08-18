export const SITE = {
  name: "Ranburg LLP",
  brand: "Ranburg",
  url: "https://www.ranburg.com",
  email: "admin@ranburg.com",
  phone: "+1 412 547 9444",
  phoneTel: "+14125479444",
  locale: "en_IN",
  defaultOgImage: "/opengraph-image",
  mapsUrl: "https://maps.app.goo.gl/Cm1m7Qv2vF5cS7vr7",
  address: {
    street: "Jaipur",
    city: "Jaipur",
    region: "Rajasthan",
    postalCode: "302001",
    country: "IN",
    formatted: "Jaipur, Rajasthan 302001, India",
  },
  geo: { latitude: 26.9124, longitude: 75.7873 },
  openingHours: "Mo-Fr 09:00-18:00",
  social: {
    linkedin: "https://www.linkedin.com/company/ranburg",
    twitter: "https://twitter.com/ranburg",
    facebook: "https://www.facebook.com/ranburgllp",
    instagram: "https://www.instagram.com/ranburgllp",
    youtube: "https://www.youtube.com/@Ranburg-x3m",
  },
  description:
    "Free online tools for developers, businesses, and SEO professionals — EMI, SIP and GST calculators, PDF merge, converters, formatters, and Salesforce utilities by Ranburg LLP.",
  gaMeasurementId: "G-EBRQ9D5R3Q",
} as const;

export const SITE_SOCIAL_URLS = Object.values(SITE.social);
