"use client";

import { motion } from "framer-motion";
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

export default function TeamCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {partners.map((partner, i) => (
        <motion.div
          key={partner.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="glass-card group relative overflow-hidden p-8"
        >
          <div
            className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${partner.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`}
          />

          <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
            <div
              className={`mb-4 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${partner.gradient} text-2xl font-bold text-theme-heading shadow-glow sm:mb-0 sm:mr-6`}
            >
              {partner.initials}
            </div>
            <div>
              <h3 className="text-xl font-bold text-theme-heading">{partner.name}</h3>
              <p className="mt-1 text-sm font-medium text-accent">{partner.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-theme-muted">
                {partner.bio}
              </p>
              <div className="mt-4 flex justify-center gap-3 sm:justify-start">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme text-theme-muted transition-all hover:border-accent/30 hover:text-accent"
                  aria-label={`Email ${partner.name}`}
                >
                  <Mail className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-theme text-theme-muted transition-all hover:border-accent/30 hover:text-accent"
                  aria-label={`LinkedIn ${partner.name}`}
                >
                  <Linkedin className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
