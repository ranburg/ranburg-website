import type { CSSProperties } from "react";
import { Linkedin, Mail } from "lucide-react";

const partners = [
  {
    name: "Radhakishan Khandelwal",
    role: "Partner",
    bio: "Visionary technologist with deep expertise in enterprise architecture and digital transformation strategies.",
    initials: "RK",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Sushmita Saxena",
    role: "Partner",
    bio: "Strategic leader driving innovation in software delivery, client success, and scalable IT solutions.",
    initials: "SS",
    gradient: "from-emerald-500 to-teal-500",
  },
];

const iconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-theme-subtle bg-theme-surface text-theme-muted transition-all duration-300 hover:border-accent hover:bg-accent hover:text-on-accent";

export default function TeamCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {partners.map((partner, i) => (
        <div
          key={partner.name}
          data-reveal="up"
          style={{ "--reveal-delay": `${i * 120}ms` } as CSSProperties}
          className="card spotlight group relative overflow-hidden p-6 sm:p-8"
        >
          <div
            className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br ${partner.gradient} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-25`}
            aria-hidden
          />

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div
              className={`mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${partner.gradient} text-2xl font-medium text-white transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105 sm:mb-0 sm:mr-6`}
            >
              {partner.initials}
            </div>
            <div>
              <h3 className="text-xl font-medium tracking-tight text-theme-heading sm:text-2xl">{partner.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-accent">{partner.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-theme-muted sm:text-base">{partner.bio}</p>
              <div className="mt-5 flex justify-center gap-2 sm:justify-start">
                <button type="button" className={iconButton} aria-label={`Email ${partner.name}`}>
                  <Mail className="h-4 w-4" />
                </button>
                <button type="button" className={iconButton} aria-label={`LinkedIn ${partner.name}`}>
                  <Linkedin className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
