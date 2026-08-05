import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

async function loadMessages(locale: string) {
  const [
    common,
    nav,
    footer,
    home,
    pages,
    toolsShell,
    toolsMeta,
    toolsUi,
  ] = await Promise.all([
    import(`../../messages/${locale}/common.json`).then((m) => m.default),
    import(`../../messages/${locale}/nav.json`).then((m) => m.default),
    import(`../../messages/${locale}/footer.json`).then((m) => m.default),
    import(`../../messages/${locale}/home.json`).then((m) => m.default),
    import(`../../messages/${locale}/pages.json`).then((m) => m.default),
    import(`../../messages/${locale}/tools.shell.json`).then((m) => m.default),
    import(`../../messages/${locale}/tools.meta.json`).then((m) => m.default),
    import(`../../messages/${locale}/tools.ui.json`).then((m) => m.default),
  ]);

  return {
    common,
    nav,
    footer,
    home,
    pages,
    tools: {
      shell: toolsShell,
      meta: toolsMeta,
      ui: toolsUi,
    },
  };
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
