import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { toClientMessages } from "@/lib/i18n/clientMessages";

/** Nested provider that adds tools.ui for interactive tool components only. */
export default async function ToolUiMessages({ children }: { children: React.ReactNode }) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <NextIntlClientProvider locale={locale} messages={toClientMessages(messages, { includeToolUi: true })}>
      {children}
    </NextIntlClientProvider>
  );
}
