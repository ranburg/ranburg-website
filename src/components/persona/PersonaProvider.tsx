"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";
import {
  PERSONA_STORAGE_KEY,
  PERSONAS,
  getPersonaById,
  getPersonaBySlug,
  type Persona,
} from "@/lib/personas";

interface PersonaContextValue {
  personaId: string | null;
  persona: Persona | null;
  personas: Persona[];
  mounted: boolean;
  /** Persist persona, apply theme, optionally navigate to landing page */
  selectPersona: (id: string, options?: { navigate?: boolean }) => void;
  /** Clear persona preference and theme; optionally go home */
  clearPersona: (options?: { navigate?: boolean }) => void;
  /** Sync preference when landing on /for/[slug] via deep link */
  syncFromSlug: (slug: string) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

function applyPersonaAttr(id: string | null) {
  if (typeof document === "undefined") return;
  if (id && getPersonaById(id)) {
    document.documentElement.setAttribute("data-persona", id);
  } else {
    document.documentElement.removeAttribute("data-persona");
  }
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (stored && getPersonaById(stored)) {
        setPersonaId(stored);
        applyPersonaAttr(stored);
      }
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const selectPersona = useCallback(
    (id: string, options?: { navigate?: boolean }) => {
      const persona = getPersonaById(id);
      if (!persona) return;
      setPersonaId(id);
      try {
        localStorage.setItem(PERSONA_STORAGE_KEY, id);
      } catch {
        /* ignore */
      }
      applyPersonaAttr(id);
      if (options?.navigate !== false) {
        router.push(`/for/${persona.slug}`);
      }
    },
    [router]
  );

  const clearPersona = useCallback(
    (options?: { navigate?: boolean }) => {
      setPersonaId(null);
      try {
        localStorage.removeItem(PERSONA_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      applyPersonaAttr(null);
      if (options?.navigate !== false) {
        router.push("/");
      }
    },
    [router]
  );

  const syncFromSlug = useCallback((slug: string) => {
    const persona = getPersonaBySlug(slug);
    if (!persona) return;
    setPersonaId(persona.id);
    try {
      localStorage.setItem(PERSONA_STORAGE_KEY, persona.id);
    } catch {
      /* ignore */
    }
    applyPersonaAttr(persona.id);
  }, []);

  const value = useMemo<PersonaContextValue>(
    () => ({
      personaId,
      persona: getPersonaById(personaId) ?? null,
      personas: PERSONAS,
      mounted,
      selectPersona,
      clearPersona,
      syncFromSlug,
    }),
    [personaId, mounted, selectPersona, clearPersona, syncFromSlug]
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used within PersonaProvider");
  return ctx;
}

export function usePersonaOptional() {
  return useContext(PersonaContext);
}
