"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  "Custom Software Development",
  "Cloud Architecture & DevOps",
  "Enterprise Solutions & CRM",
  "Web & Mobile Apps",
  "IT Consulting & Strategy",
  "Other",
];

interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = "Name is required";
    if (!data.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = "Please enter a valid email";
    }
    if (!data.service) errs.service = "Please select a service";
    if (!data.message.trim()) errs.message = "Message is required";
    else if (data.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters";
    }
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, service: true, message: true });

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card flex flex-col items-center p-12 text-center"
      >
        <CheckCircle className="mb-4 h-16 w-16 text-accent-emerald" />
        <h3 className="text-2xl font-bold text-theme-heading">Message Sent!</h3>
        <p className="mt-2 text-theme-muted">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8" noValidate>
      <h2 className="text-2xl font-bold text-theme-heading">Send Us a Message</h2>

      {(["name", "email"] as const).map((field) => (
        <div key={field} className="relative">
          <input
            id={field}
            type={field === "email" ? "email" : "text"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            onBlur={() => handleBlur(field)}
            placeholder=" "
            className={cn(
              "input-field peer",
              touched[field] && errors[field] && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20"
            )}
          />
          <label
            htmlFor={field}
            className="pointer-events-none absolute left-4 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent"
          >
            {field === "name" ? "Your Name" : "Email Address"}
          </label>
          {touched[field] && errors[field] && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      <div>
        <select
          id="service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          onBlur={() => handleBlur("service")}
          className={cn(
            "input-field",
            !form.service && "text-slate-500",
            touched.service && errors.service && "border-red-500/50"
          )}
        >
          <option value="" disabled>
            Service Needed
          </option>
          {services.map((s) => (
            <option key={s} value={s} className="bg-slate-900">
              {s}
            </option>
          ))}
        </select>
        {touched.service && errors.service && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.service}
          </p>
        )}
      </div>

      <div className="relative">
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onBlur={() => handleBlur("message")}
          placeholder=" "
          className={cn(
            "input-field peer resize-none",
            touched.message && errors.message && "border-red-500/50"
          )}
        />
        <label
          htmlFor="message"
          className="pointer-events-none absolute left-4 top-3 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-accent"
        >
          Your Message
        </label>
        {touched.message && errors.message && (
          <p className="mt-1 flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-blue-600 py-4 font-semibold text-theme-heading shadow-glow transition-all hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] active:scale-[0.99]"
      >
        <Send className="h-4 w-4" />
        Send Message
      </button>
    </form>
  );
}
