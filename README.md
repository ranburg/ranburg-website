# Ranburg.com — IT Services Website

A modern, conversion-optimized website for **Ranburg LLP**, built with Next.js 15, Tailwind CSS, Framer Motion, and Recharts.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with glassmorphism design system
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Typography:** Plus Jakarta Sans

## Getting Started

```bash
cd ranburg-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, trust ticker, services preview, CTA |
| `/about` | Company info, leadership, values |
| `/services` | Bento-box service grid |
| `/tools` | Financial tools hub |
| `/tools/sip` | SIP Calculator |
| `/tools/swp` | SWP Calculator |
| `/tools/emi` | Loan EMI Calculator |
| `/contact` | Contact form with validation |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Button, CalculatorSlider
│   ├── home/               # Hero, TrustTicker, ServicesPreview
│   ├── about/              # TeamCards, ValuesGrid
│   ├── services/           # ServiceBento
│   ├── tools/              # Calculators, ToolsHub
│   └── contact/            # ContactForm
└── lib/                    # Utilities
```

## Build for Production

```bash
npm run build
npm start
```

## Growth & SEO

See **[docs/SEO_GROWTH_PLAYBOOK.md](docs/SEO_GROWTH_PLAYBOOK.md)** for the rankings → traffic → AdSense playbook, top-20 tools, env vars, GSC checklist, and helper APIs.
