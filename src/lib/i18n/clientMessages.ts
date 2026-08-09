import type { AbstractIntlMessages } from "next-intl";

type ToolsMessages = {
  shell?: AbstractIntlMessages;
  meta?: AbstractIntlMessages;
  ui?: AbstractIntlMessages;
};

/**
 * Messages safe to ship to the browser via NextIntlClientProvider.
 * Omits tools.meta (~153KB) always; tools.ui (~62KB) only when includeToolUi.
 */
export function toClientMessages(
  messages: AbstractIntlMessages,
  options: { includeToolUi?: boolean } = {}
): AbstractIntlMessages {
  const m = messages as Record<string, unknown>;
  const tools = m.tools as ToolsMessages | undefined;

  return {
    common: m.common,
    nav: m.nav,
    footer: m.footer,
    home: m.home,
    pages: m.pages,
    tools: {
      shell: tools?.shell,
      ...(options.includeToolUi && tools?.ui ? { ui: tools.ui } : {}),
    },
  } as AbstractIntlMessages;
}
