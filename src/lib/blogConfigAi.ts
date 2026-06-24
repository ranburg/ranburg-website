import type { BlogPost } from "./blogTypes";

export const AI_BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-install-claude-on-your-device",
    title: "How to Install Claude on Your Device (Windows, Mac, iOS & Android)",
    excerpt:
      "Step-by-step guide to installing Claude by Anthropic on desktop and mobile — web app, desktop app, and API access for developers.",
    date: "2026-03-10",
    readTime: "14 min",
    seo: {
      title: "How to Install Claude on Your Device | Ranburg Guide",
      description:
        "Install Claude on Windows, Mac, iPhone, and Android. Web, desktop app, and API setup for personal and professional use.",
      keywords: [
        "install Claude",
        "Claude desktop app",
        "Claude mobile",
        "Anthropic Claude setup",
        "Claude AI download",
      ],
    },
    sections: [
      { type: "h2", text: "What Is Claude and Why Install It Locally?" },
      {
        type: "p",
        text: "Claude is Anthropic's family of AI assistants designed for reasoning, writing, coding, and analysis. Unlike browser-only chatbots from years past, Claude today is available as a web application, native desktop clients for Windows and macOS, and mobile apps for iOS and Android. Installing Claude on your device gives you faster access from the dock or home screen, system-level notifications where supported, and a dedicated workspace separate from dozens of open browser tabs. For Salesforce developers and consultants at firms like Ranburg LLP, Claude is increasingly used to draft Apex test classes, explain governor limits, review integration designs, and accelerate documentation — but only after you have a reliable way to access it on the machines where you actually work.",
      },
      {
        type: "p",
        text: "This guide walks through every major installation path: claude.ai in the browser (no install required), the official Claude desktop application, mobile apps, and optional API access for automation. We cover account creation, subscription tiers (Free, Pro, Max, Team, Enterprise), and practical tips for developers who want Claude beside Cursor or VS Code.",
      },
      { type: "h2", text: "Create Your Anthropic Account First" },
      {
        type: "p",
        text: "Before installing any client, create an account at claude.ai using email, Google, or SSO if your organization provides it. Verify your email if prompted. Free tier users can chat with Claude immediately; Pro and higher tiers unlock higher usage limits, priority access during peak demand, and early features. Enterprise customers typically provision accounts through IT with SSO and data retention policies. If you work on Salesforce projects with customer data, confirm your company's AI acceptable-use policy before pasting proprietary metadata, Apex, or customer records into Claude.",
      },
      { type: "h3", text: "Choosing the Right Claude Plan" },
      {
        type: "p",
        text: "Individual developers often start on Free or Pro. Pro is worthwhile if you use Claude daily for code review, spec writing, or learning OmniStudio patterns. Team and Enterprise add centralized billing, admin controls, and compliance features required in regulated industries. Ranburg consultants recommend Pro or Team for professional Salesforce work where session continuity and higher token limits reduce friction during long architecture sessions.",
      },
      { type: "h2", text: "Install Claude on Windows" },
      {
        type: "p",
        text: "The Claude desktop app for Windows provides a native window, taskbar integration, and keyboard shortcuts. Visit claude.ai/download or the Microsoft Store listing for Claude (availability may vary by region). Download the installer (.exe), run it, and sign in with your Anthropic account. Windows may show SmartScreen warnings for new publishers — verify the publisher is Anthropic PBC before proceeding. After installation, pin Claude to the taskbar for quick access during development sprints.",
      },
      { type: "h3", text: "Windows System Requirements and Tips" },
      {
        type: "p",
        text: "Claude desktop runs on Windows 10 and Windows 11 with a stable internet connection. It does not require a discrete GPU because inference runs in Anthropic's cloud. If you use corporate proxies, configure system proxy settings or consult IT — some enterprises block consumer AI endpoints. For Salesforce developers using Cursor on the same machine, run Claude in a separate window rather than embedding credentials in shared screenshots.",
      },
      { type: "h2", text: "Install Claude on Mac (macOS)" },
      {
        type: "p",
        text: "Download the macOS build from claude.ai/download. Open the .dmg file, drag Claude to Applications, and launch from Launchpad or Spotlight. macOS Gatekeeper may ask you to confirm opening an app from the internet — Anthropic is an identified developer. macOS users can add Claude to the menu bar for quick queries between Salesforce deployments. Universal binaries support both Apple Silicon (M1/M2/M3/M4) and Intel Macs.",
      },
      { type: "h2", text: "Install Claude on iPhone and iPad (iOS)" },
      {
        type: "p",
        text: "Search for Claude by Anthropic in the App Store. Install, open, and sign in. The mobile app syncs conversation history with your account when logged in. Mobile Claude is useful for reviewing meeting notes, dictating requirements after client calls, or reading long explanations of Salesforce concepts while commuting. Avoid uploading sensitive customer data on personal devices without MDM policies from your employer.",
      },
      { type: "h2", text: "Install Claude on Android" },
      {
        type: "p",
        text: "Install Claude from Google Play. Sign in with the same Anthropic account used on desktop for consistent history. Android supports share-sheet integration — you can share text from email or Slack into Claude for summarization. Developers testing Salesforce mobile experiences can use Claude alongside the Salesforce mobile app on the same device for separate workflows.",
      },
      { type: "h2", text: "Using Claude in the Browser (No Install)" },
      {
        type: "p",
        text: "If you cannot install desktop software on a locked corporate laptop, claude.ai in Chrome, Edge, or Firefox is fully functional. Bookmark the site, enable two-factor authentication on your Anthropic account, and consider a dedicated browser profile for client work. Browser access is identical for core chat features; you only miss native OS integrations.",
      },
      { type: "h2", text: "Claude API for Developers (Optional)" },
      {
        type: "p",
        text: "Beyond the consumer apps, developers can use the Anthropic API at console.anthropic.com. Create an API key, store it in environment variables (never commit keys to Git), and call Claude from scripts, CI pipelines, or custom tools. API access is billed per token and is separate from Claude Pro subscription. Ranburg uses API access for internal tooling experiments — not for pasting production customer PII without governance.",
      },
      { type: "h3", text: "Security Best Practices" },
      {
        type: "p",
        text: "Never share API keys in Slack or email. Rotate keys if exposed. Use separate keys for development and production automation. For Salesforce teams, treat Claude like any external SaaS: classify data before upload, redact account names and credentials, and prefer synthetic examples when asking for Apex or SOQL help.",
      },
      { type: "h2", text: "Troubleshooting Common Installation Issues" },
      {
        type: "p",
        text: "If Claude fails to sign in, clear cookies for claude.ai or reinstall the desktop app. Corporate VPNs sometimes block AI services — try a personal hotspot to isolate the issue. If the desktop app is outdated, enable automatic updates or download the latest build manually. For sync issues between mobile and desktop, confirm you are logged into the same account and that sync is enabled in settings.",
      },
      {
        type: "p",
        text: "Once Claude is installed, pair it with Cursor for an integrated AI development workflow — see our guides on installing Cursor and using both tools for Salesforce development on the Ranburg blog.",
      },
    ],
    faq: [
      {
        question: "Is Claude free to install?",
        answer: "Yes. The apps are free to download; usage limits depend on your Free, Pro, or Enterprise plan.",
      },
      {
        question: "Can I use Claude offline?",
        answer: "No. Claude requires an internet connection because models run on Anthropic servers.",
      },
      {
        question: "Is Claude available in India?",
        answer: "Yes. Claude web and mobile apps are available to users in India subject to Anthropic's regional policies.",
      },
      {
        question: "Claude vs ChatGPT for Salesforce?",
        answer: "Both can assist with Apex and architecture; Ranburg teams often use Claude for long-context analysis and Cursor's built-in models for in-editor coding.",
      },
    ],
    relatedServices: ["lwc-development", "salesforce-consulting"],
    relatedTools: ["apex-test-generator", "soql-builder"],
  },
  {
    slug: "how-to-install-cursor-on-your-device",
    title: "How to Install Cursor on Your Device (Windows, Mac & Linux)",
    excerpt:
      "Complete setup guide for Cursor — the AI-powered code editor built on VS Code — including extensions, sign-in, and Salesforce project configuration.",
    date: "2026-03-12",
    readTime: "15 min",
    seo: {
      title: "How to Install Cursor IDE on Windows & Mac | Ranburg",
      description:
        "Download and install Cursor on Windows, Mac, and Linux. Configure AI models, extensions, and Salesforce DX for professional development.",
      keywords: [
        "install Cursor",
        "Cursor IDE download",
        "Cursor setup",
        "AI code editor",
        "Cursor Windows Mac",
      ],
    },
    sections: [
      { type: "h2", text: "What Is Cursor?" },
      {
        type: "p",
        text: "Cursor is an AI-native code editor forked from Visual Studio Code. It preserves the VS Code extension ecosystem, keybindings, and workspace model while adding inline AI completion, chat with codebase context, multi-file edits, and agentic workflows that can run terminal commands. For Salesforce developers, Cursor has become a practical replacement for VS Code when building Lightning Web Components, Apex classes, OmniStudio DataRaptors, and integration middleware — especially when paired with the Salesforce Extension Pack and Claude or GPT models.",
      },
      {
        type: "p",
        text: "Ranburg LLP consultants in Jaipur use Cursor daily on client engagements. This guide covers download, installation on Windows and macOS, Linux options, first-run configuration, importing VS Code settings, and preparing a Salesforce DX project.",
      },
      { type: "h2", text: "Download Cursor" },
      {
        type: "p",
        text: "Visit cursor.com and click Download. The site auto-detects your operating system. Cursor offers stable releases for Windows (x64 and ARM64 where available), macOS (Universal), and Linux (.AppImage or package formats depending on release channel). Always download from the official site or verified package repositories — third-party mirrors may bundle malware.",
      },
      { type: "h2", text: "Install Cursor on Windows" },
      {
        type: "p",
        text: "Run the downloaded CursorUserSetup.exe (name may vary by version). Choose install location — default Program Files is fine. Optionally add Cursor to the PATH and create a desktop shortcut. Launch Cursor, sign in with email, Google, or GitHub to sync settings and activate AI features. Windows Defender may scan the installer; this is normal for Electron-based applications.",
      },
      { type: "h3", text: "Import Settings from VS Code" },
      {
        type: "p",
        text: "On first launch, Cursor offers to import extensions, themes, and keybindings from VS Code. Accept if you already develop Salesforce with VS Code — your Salesforce Extension Pack, Prettier config, and ESLint rules transfer in one step. If import fails, manually install Salesforce Extension Pack from the Extensions marketplace inside Cursor.",
      },
      { type: "h2", text: "Install Cursor on Mac" },
      {
        type: "p",
        text: "Open the .dmg, drag Cursor to Applications, and launch. macOS may prompt for accessibility permissions if you use AI features that interact with the terminal or window management — grant only what you trust. Add Cursor to the Dock. Mac developers often use Cursor alongside Salesforce CLI in iTerm or the integrated terminal.",
      },
      { type: "h2", text: "Install Cursor on Linux" },
      {
        type: "p",
        text: "Download the AppImage or .deb package from cursor.com. For AppImage: chmod +x Cursor.AppImage and run. For Debian/Ubuntu: sudo dpkg -i cursor.deb. Install libfuse dependencies if the AppImage fails to start. Linux support is popular among backend engineers running Salesforce CLI in headless CI-like local environments.",
      },
      { type: "h2", text: "Sign In and Choose an AI Plan" },
      {
        type: "p",
        text: "Cursor requires an account for AI features. Free tier includes limited completions and chat; Pro unlocks higher limits, premium models, and background agents. Business plans add team admin and privacy controls. In Settings → Models, select default models for chat and autocomplete — many Salesforce developers prefer Claude Sonnet or GPT-4 class models for Apex generation.",
      },
      { type: "h2", text: "Configure Cursor for Salesforce Development" },
      {
        type: "p",
        text: "Install these extensions: Salesforce Extension Pack (or individual Salesforce DX, Apex, LWC extensions), Prettier, ESLint, and XML tools for metadata. Install Salesforce CLI globally: npm install -g @salesforce/cli or use the official installer. Authorize a Dev Hub or sandbox: sf org login web --alias mySandbox. Open your SFDX project folder in Cursor — the AI can then index Apex, LWC, and XML metadata for context-aware suggestions.",
      },
      { type: "h3", text: "Create a .cursorrules File for Salesforce" },
      {
        type: "p",
        text: "Add a .cursorrules or project rules file at the repo root instructing the AI to follow Salesforce best practices: bulkified Apex, no SOQL in loops, use @AuraEnabled(cacheable=true) appropriately, and respect naming conventions. Ranburg repositories include rules for Industries vs Revenue Cloud boundaries so generated code aligns with architecture standards.",
      },
      { type: "h2", text: "Keyboard Shortcuts and Daily Workflow" },
      {
        type: "p",
        text: "Learn Cursor-specific shortcuts: inline edit (Cmd/Ctrl+K), chat panel (Cmd/Ctrl+L), and composer for multi-file changes. Use @-mentions in chat to reference files, folders, or documentation. For Salesforce, @-mention a trigger class when asking for test coverage improvements. Commit frequently — AI edits can introduce subtle governor limit violations.",
      },
      { type: "h2", text: "Privacy and Enterprise Considerations" },
      {
        type: "p",
        text: "Review Cursor's privacy mode and business terms before opening customer repos. Some enterprises require Privacy Mode to prevent code from training models. Air-gapped or highly regulated clients may prohibit cloud AI entirely — know your contract. Ranburg uses client-approved tooling lists and never pastes production credentials into prompts.",
      },
      {
        type: "p",
        text: "After installation, read our guides on using Cursor and Claude together for Salesforce development to maximize productivity on OmniStudio, LWC, and integration projects.",
      },
    ],
    faq: [
      {
        question: "Is Cursor the same as VS Code?",
        answer: "Cursor is based on VS Code but adds AI features. Most VS Code extensions work in Cursor.",
      },
      {
        question: "Does Cursor support Salesforce extensions?",
        answer: "Yes. Install Salesforce Extension Pack from the marketplace inside Cursor.",
      },
      {
        question: "Is Cursor free?",
        answer: "Cursor has a free tier with limits; Pro is recommended for professional daily use.",
      },
      {
        question: "Can I use Cursor on a company laptop?",
        answer: "Check IT policy. Some organizations block AI editors or require Business plans with privacy guarantees.",
      },
    ],
    relatedServices: ["lwc-development"],
    relatedTools: ["apex-test-generator", "validation-rule-generator"],
  },
  {
    slug: "using-claude-for-salesforce-development",
    title: "Using Claude for Salesforce Development: A Practical Guide",
    excerpt:
      "How Salesforce developers use Claude for Apex, LWC, flows, OmniStudio, debugging, and documentation — with prompts, guardrails, and real workflows.",
    date: "2026-03-15",
    readTime: "16 min",
    seo: {
      title: "Using Claude for Salesforce Development | Ranburg",
      description:
        "Learn how to use Claude AI for Apex, LWC, flows, and OmniStudio. Prompts, best practices, and governance for Salesforce teams.",
      keywords: [
        "Claude Salesforce development",
        "AI Apex code",
        "Claude for LWC",
        "Salesforce AI assistant",
        "Anthropic Salesforce",
      ],
    },
    sections: [
      { type: "h2", text: "Why Salesforce Developers Use Claude" },
      {
        type: "p",
        text: "Salesforce development spans declarative configuration and code — Apex, Lightning Web Components, flows, OmniStudio DataRaptors, Integration Procedures, and complex metadata XML. Claude excels at explaining platform behavior, drafting boilerplate with governor-limit awareness, converting requirements into user stories, and reviewing diffs when provided sufficient context. Unlike generic search, Claude maintains thread context across a debugging session, which mirrors how senior architects pair with junior developers on long implementations.",
      },
      {
        type: "p",
        text: "Ranburg LLP consultants use Claude for accelerator tasks: generating test data factories, documenting integration contracts, summarizing release notes, and drafting runbooks. Claude does not replace certified expertise — it compresses time on well-bounded problems so architects focus on data model design, security, and cross-cloud orchestration.",
      },
      { type: "h2", text: "Claude for Apex and Unit Tests" },
      {
        type: "p",
        text: "Provide Claude with your trigger handler interface, object API names, and bulkification requirements. Ask for a test class with meaningful assertions, not just coverage padding. Example prompt structure: 'Write an Apex test for AccountTriggerHandler.handleAfterInsert covering 200-record bulk insert, mock callouts using HttpCalloutMock, and assert custom field updates.' Always review generated SOQL for selective filters and verify test isolation — Claude may invent field API names that do not exist in your org.",
      },
      { type: "h3", text: "Governor Limits and Code Review" },
      {
        type: "p",
        text: "Paste stack traces from debug logs (redacted) and ask Claude to identify SOQL-in-loop or DML-in-loop antipatterns. Request refactoring to batch patterns or queueable chains. Cross-check suggestions against Salesforce documentation — Claude occasionally recommends deprecated APIs.",
      },
      { type: "h2", text: "Claude for Lightning Web Components" },
      {
        type: "p",
        text: "LWC requires JavaScript modules, HTML templates, and CSS with shadow DOM constraints. Claude can scaffold @api properties, wire adapters to Apex @AuraEnabled(cacheable=true) methods, and handle error states. Specify ESLint rules and Jest testing requirements in your prompt. For Experience Cloud sites, mention CSP and guest user security — Claude should avoid suggesting patterns that expose sensitive data to unauthenticated users.",
      },
      { type: "h2", text: "Claude for Flows and Declarative Automation" },
      {
        type: "p",
        text: "Flows are visual but design decisions are textual. Describe your record-triggered flow requirements — entry criteria, decision nodes, fault paths — and ask Claude for a step-by-step flow outline before you build in Flow Builder. For complex loops and collection operations, Claude helps plan bulk-safe approaches and when to escalate to Apex instead.",
      },
      { type: "h2", text: "Claude for OmniStudio and Industries Cloud" },
      {
        type: "p",
        text: "OmniStudio assets — DataRaptors, Integration Procedures, FlexCards — have steep learning curves. Claude can explain Extract-Transform-Load patterns in DataRaptors, suggest JSON structure for Integration Procedure steps, and help debug formula expressions in OmniScripts. Provide sample JSON payloads (synthetic) for telecom product catalogs or insurance policy objects. Ranburg teams validate all OmniStudio output in scratch orgs because expression syntax errors are common in AI drafts.",
      },
      { type: "h2", text: "Claude for Integrations and APIs" },
      {
        type: "p",
        text: "Integration architects use Claude to draft OpenAPI specs, map Salesforce REST composite requests, design platform event schemas, and document middleware error handling. Ask for idempotency keys, retry policies, and dead-letter queue patterns when integrating ERP, billing, or payment gateways with Revenue Cloud.",
      },
      { type: "h2", text: "Effective Prompting Patterns" },
      {
        type: "p",
        text: "Structure prompts with role ('You are a Salesforce architect'), context (cloud edition, objects involved), constraints (no managed package namespaces, bulkified), and output format (Apex only, no explanation). Attach relevant metadata snippets rather than entire repos. Use follow-ups to iterate. For long programs, maintain a project brief document you paste at the start of new threads.",
      },
      { type: "h3", text: "What Not to Paste Into Claude" },
      {
        type: "p",
        text: "Production passwords, OAuth refresh tokens, customer PII, unreleased financial data, and attorney-client privileged material must never enter consumer AI tools without legal approval. Use anonymized record IDs and synthetic names. Ranburg classifies client data tiers before any AI assistance.",
      },
      { type: "h2", text: "Claude vs In-Editor AI (Cursor)" },
      {
        type: "p",
        text: "Claude shines in browser or desktop chat for architecture, documentation, and long analysis. Cursor embeds AI in the editor with file context. Many developers use both: Claude for design sessions, Cursor for implementation. See our Claude + Cursor setup guide for Salesforce projects.",
      },
      {
        type: "p",
        text: "Explore Ranburg's free Salesforce tools — SOQL builder, Apex test generator, and formula helpers — to complement AI-assisted development with deterministic utilities.",
      },
    ],
    faq: [
      {
        question: "Can Claude write production-ready Apex?",
        answer: "It drafts strong starting points; always review, test in a sandbox, and run static analysis before deployment.",
      },
      {
        question: "Does Claude know latest Salesforce releases?",
        answer: "Knowledge has a cutoff; verify new features against official release notes.",
      },
      {
        question: "Is Claude HIPAA-compliant for Health Cloud?",
        answer: "Only Enterprise offerings with appropriate BAAs may qualify; consult Anthropic and your compliance team.",
      },
      {
        question: "Best Claude model for coding?",
        answer: "Use the latest Claude Sonnet or Opus tier available on your plan for complex Apex and integration work.",
      },
    ],
    relatedServices: ["omnistudio-development", "salesforce-integrations", "lwc-development"],
    relatedTools: ["apex-test-generator", "formula-generator", "governor-limits-calculator"],
  },
  {
    slug: "using-cursor-for-salesforce-development",
    title: "Using Cursor for Salesforce Development: Workflows That Work",
    excerpt:
      "Master Cursor for Salesforce DX projects — LWC, Apex, metadata deploys, AI agents, and team conventions used by Ranburg consultants.",
    date: "2026-03-18",
    readTime: "16 min",
    seo: {
      title: "Using Cursor for Salesforce Development | Ranburg Guide",
      description:
        "Cursor IDE workflows for Salesforce: SFDX, LWC, Apex, deployments, AI agents, and .cursorrules for enterprise teams.",
      keywords: [
        "Cursor Salesforce",
        "AI Salesforce development",
        "Cursor LWC",
        "Salesforce DX Cursor",
        "Cursor Apex",
      ],
    },
    sections: [
      { type: "h2", text: "Cursor as Your Salesforce IDE" },
      {
        type: "p",
        text: "Cursor brings AI into the same workspace where Salesforce developers already edit Apex, LWC, and metadata XML. With Salesforce Extension Pack installed, you retain org authorization, deploy-on-save options, Apex replay debugger, and LWC local preview — while gaining inline completion and agentic multi-file edits. Ranburg teams report 20–40% faster iteration on well-scoped stories when Cursor rules enforce platform conventions.",
      },
      { type: "h2", text: "Project Setup: SFDX in Cursor" },
      {
        type: "p",
        text: "Clone or create an SFDX project: sf project generate --name myProject. Open the folder in Cursor. Authorize orgs via terminal: sf org login web --alias dev --set-default. Ensure sfdx-project.json and .forceignore are correct. Add .cursorignore to exclude node_modules, .sfdx, and large static resources from AI indexing — this improves response quality and protects irrelevant files from context windows.",
      },
      { type: "h2", text: "AI Completions for Apex" },
      {
        type: "p",
        text: "When typing a new service class, let Tab-complete suggest method signatures, then use Cmd/Ctrl+K to instruct 'implement bulkified update for related Opportunities.' Cursor sees surrounding classes and tests. Always run: sf apex run test --code-coverage --result-format human. AI-generated tests may miss edge cases for trigger recursion or mixed DML scenarios.",
      },
      { type: "h2", text: "Building LWC with Cursor Composer" },
      {
        type: "p",
        text: "Composer mode can create HTML, JS, and CSS files together — describe a datatable with inline edit wired to Apex. Mention lightning-datatable columns, @wire getRecord, and toast events. Preview with sf lightning dev component (where supported) or deploy to scratch org. Cursor respects module boundaries better when you @-mention existing components as style references.",
      },
      { type: "h2", text: "Metadata and XML Edits" },
      {
        type: "p",
        text: "Profiles, permission sets, and custom objects involve verbose XML. Cursor helps regenerate package.xml manifests, fix merge conflicts in metadata, and draft Custom Metadata Type records. Validate with sf project deploy start --dry-run before production promotions.",
      },
      { type: "h2", text: "Agent Mode for Refactors" },
      {
        type: "p",
        text: "Cursor agents can execute terminal commands — use cautiously on Salesforce projects. Good agent tasks: rename a utility class across files, add error logging to all @AuraEnabled methods, update API versions in meta.xml files. Bad agent tasks: deploy to production without review, delete metadata, or run destructive changes without backups. Require human approval on every git commit.",
      },
      { type: "h2", text: "Team .cursorrules for Salesforce" },
      {
        type: "p",
        text: "Ranburg standard rules include: enforce with sharing on Apex classes unless documented exception; prefer Queueable over @future; use Selector pattern for SOQL; LWC must use SLDS tokens; no hardcoded IDs; all Integration Procedures must log correlation IDs. Store rules in the repo so every consultant's Cursor behaves consistently across engagements.",
      },
      { type: "h2", text: "Debugging with AI Assistance" },
      {
        type: "p",
        text: "Paste anonymized debug log excerpts into chat with @logFile reference. Ask why CPU time exceeded limits. Cursor can suggest moving enrichment to asynchronous processing. Combine with Salesforce's Apex Profiler and Event Monitoring for production-grade diagnosis — AI suggestions are hypotheses, not gospel.",
      },
      { type: "h2", text: "CI/CD Integration" },
      {
        type: "p",
        text: "Cursor edits still flow through Git, pull requests, and Copado/Gearset/standard sf deploy pipelines. Do not bypass code review because AI wrote the diff. Ranburg PR templates ask authors to confirm governor limit testing, security review for new @AuraEnabled endpoints, and updated documentation.",
      },
      {
        type: "p",
        text: "Pair Cursor with Ranburg's Apex Test Class Generator and Governor Limits Calculator tools for faster validation cycles.",
      },
    ],
    faq: [
      {
        question: "Cursor vs VS Code for Salesforce?",
        answer: "Functionally similar for extensions; Cursor adds AI. Many developers switch entirely; some use both.",
      },
      {
        question: "Does Cursor support sf CLI v2?",
        answer: "Yes. Use the integrated terminal with Salesforce CLI commands as in VS Code.",
      },
      {
        question: "Can Cursor deploy to Salesforce?",
        answer: "Via Salesforce extensions and CLI — Cursor itself does not replace deployment tooling.",
      },
      {
        question: "How to prevent AI hallucinated API names?",
        answer: "Use @-file references to real objects and enable strict .cursorrules requiring validation against schema.",
      },
    ],
    relatedServices: ["lwc-development"],
    relatedTools: ["apex-test-generator", "soql-builder", "flow-formula-builder"],
  },
  {
    slug: "claude-cursor-setup-for-salesforce-projects",
    title: "Claude + Cursor Setup for Salesforce Projects (Complete Guide)",
    excerpt:
      "Combine Claude and Cursor into a productive Salesforce toolchain — accounts, models, project rules, scratch orgs, and governance for consulting teams.",
    date: "2026-03-20",
    readTime: "17 min",
    seo: {
      title: "Claude + Cursor Setup for Salesforce | Ranburg",
      description:
        "Complete setup guide: install Claude and Cursor, configure Salesforce DX, AI rules, scratch orgs, and team governance for enterprise delivery.",
      keywords: [
        "Claude Cursor Salesforce setup",
        "AI Salesforce toolchain",
        "Salesforce developer AI setup",
        "Cursor rules Salesforce",
        "Ranburg Salesforce",
      ],
    },
    sections: [
      { type: "h2", text: "The Modern Salesforce AI Toolchain" },
      {
        type: "p",
        text: "Enterprise Salesforce delivery in 2026 typically involves three layers: the platform (Sales Cloud, Industries, Revenue Cloud), the IDE (Cursor with Salesforce extensions), and reasoning assistants (Claude for architecture, documentation, and complex analysis). Neither tool alone replaces certified architects — together they reduce friction from idea to deployed metadata. Ranburg LLP standardizes this toolchain across Jaipur delivery teams and remote client staff aug engagements.",
      },
      { type: "h2", text: "Step 1: Accounts and Subscriptions" },
      {
        type: "p",
        text: "Create an Anthropic account for Claude (Pro recommended for consultants) and a Cursor account (Pro for daily AI limits). Use corporate email domains for client work if IT requires it. Enable two-factor authentication on both. Document subscription owners for billing continuity when developers roll off projects.",
      },
      { type: "h2", text: "Step 2: Install Software" },
      {
        type: "p",
        text: "Install Claude desktop and Cursor on your primary development machine following our dedicated install guides. Install Salesforce CLI, Node.js LTS, and Git. On Windows, enable long path support for deep node_modules trees. On Mac, install Xcode command line tools for native module compilation when needed.",
      },
      { type: "h2", text: "Step 3: Salesforce Org Strategy" },
      {
        type: "p",
        text: "Provision a Dev Hub, create scratch org pools or persistent sandboxes per developer. Never point AI-assisted bulk edits at production. Ranburg uses naming conventions: scratch org alias includes ticket number and developer initials. Set default org in Cursor terminal: sf config set target-org myScratch.",
      },
      { type: "h2", text: "Step 4: Repository Scaffold" },
      {
        type: "p",
        text: "Initialize Git repo with README, .gitignore for .sfdx and local IDE files, package.xml or sf project structure, and CONTRIBUTING.md describing AI usage policy. Add .cursorrules with Salesforce standards. Add .cursorignore for artifacts AI should not read. Optional: commit a docs/ai-prompts.md with approved prompt templates for Apex tests, release notes, and data migration mapping.",
      },
      { type: "h2", text: "Step 5: Connect Cursor Models" },
      {
        type: "p",
        text: "In Cursor Settings → Models, enable Claude and fallback models. Map tasks: fast model for autocomplete, stronger model for Composer refactors. If your enterprise provides API keys for Anthropic, configure them per Cursor business policy. Test with a small LWC change before trusting large agent runs.",
      },
      { type: "h2", text: "Step 6: Claude for Design, Cursor for Build" },
      {
        type: "p",
        text: "Ranburg's recommended split: use Claude in discovery workshops to draft solution outlines, integration sequence diagrams in text, and risk registers. Export decisions to Jira or Confluence. Switch to Cursor for implementation sprints — @-mention user stories and acceptance criteria in Composer. Return to Claude for release retrospectives and customer-facing documentation polish.",
      },
      { type: "h3", text: "Sample Daily Rhythm" },
      {
        type: "p",
        text: "Morning: review sprint board in Cursor terminal browser or Jira. Midday: implement stories with inline AI, deploy to scratch org, run Apex tests. Afternoon: Claude session for tomorrow's spike on Revenue Cloud pricing procedure design. End of day: commit with conventional messages, push PR, no uncommitted AI experiments.",
      },
      { type: "h2", text: "Step 7: Data Governance" },
      {
        type: "p",
        text: "Classify data: public (generic Apex patterns), internal (architecture without customer names), confidential (client metadata), restricted (PII, credentials). Only public and sanitized internal tiers go to AI without approval. Use Ranburg's redaction checklist before pasting debug logs. Enable Cursor Privacy Mode when client contracts require it.",
      },
      { type: "h2", text: "Step 8: Quality Gates" },
      {
        type: "p",
        text: "AI output must pass the same gates as human code: peer review, Apex PMD or similar static analysis, minimum 85% test coverage where required, UAT sign-off, and change advisory board for production. Track defects originating from AI suggestions to refine .cursorrules over time.",
      },
      { type: "h2", text: "OmniStudio and Revenue Cloud Specifics" },
      {
        type: "p",
        text: "For Industries programs, store sample OmniScript JSON and DataRaptor naming conventions in the repo docs folder — Cursor indexes these for consistent generation. For Revenue Cloud, document calculation procedure inputs and custom setting keys so AI does not invent configuration API names. Claude helps validate quote-to-cash RACI before Cursor implements Integration Procedures.",
      },
      { type: "h2", text: "Onboarding New Team Members" },
      {
        type: "p",
        text: "Ranburg's onboarding checklist: install Claude + Cursor, clone repo, authorize scratch org, read .cursorrules, complete a toy story (add field + LWC + test), attend AI governance briefing. Within one week, new hires should deploy a reviewed PR using the toolchain under mentor supervision.",
      },
      {
        type: "p",
        text: "Need hands-on help? Ranburg LLP provides Salesforce development, staff augmentation, and enablement from Jaipur, India — including AI-augmented delivery models for OmniStudio, Revenue Cloud, and LWC programs.",
      },
    ],
    faq: [
      {
        question: "Do I need both Claude and Cursor?",
        answer: "Not required, but the combination covers architecture chat and in-editor coding better than either alone.",
      },
      {
        question: "Can clients forbid AI tools?",
        answer: "Yes. Always follow client MSAs; Ranburg maintains no-AI engagement modes when required.",
      },
      {
        question: "What about Einstein GPT vs Claude/Cursor?",
        answer: "Einstein is native to Salesforce; Claude/Cursor are developer productivity tools — they complement rather than replace Einstein features.",
      },
      {
        question: "Does Ranburg train teams on this setup?",
        answer: "Yes. Contact Ranburg LLP for consulting, staff aug, and developer enablement on AI-assisted Salesforce delivery.",
      },
    ],
    relatedServices: ["salesforce-consulting", "staff-augmentation", "lwc-development"],
    relatedTools: ["formula-generator", "omnistudio-expression-builder", "apex-test-generator"],
  },
];
