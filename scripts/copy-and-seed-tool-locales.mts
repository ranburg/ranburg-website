import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const locales = ["es", "pt", "hi", "ar", "ja", "ko"] as const;
type Locale = (typeof locales)[number];

const uiTranslations: Record<Locale, Record<string, string>> = {
  es: { calculate: "Calcular", reset: "Restablecer", copy: "Copiar", download: "Descargar", results: "Resultados", inputs: "Datos de entrada", formula: "Fórmula", example: "Ejemplo", disclaimer: "Aviso legal" },
  pt: { calculate: "Calcular", reset: "Redefinir", copy: "Copiar", download: "Baixar", results: "Resultados", inputs: "Dados de entrada", formula: "Fórmula", example: "Exemplo", disclaimer: "Aviso legal" },
  hi: { calculate: "गणना करें", reset: "रीसेट करें", copy: "कॉपी करें", download: "डाउनलोड करें", results: "परिणाम", inputs: "इनपुट", formula: "सूत्र", example: "उदाहरण", disclaimer: "अस्वीकरण" },
  ar: { calculate: "احسب", reset: "إعادة تعيين", copy: "نسخ", download: "تنزيل", results: "النتائج", inputs: "المدخلات", formula: "المعادلة", example: "مثال", disclaimer: "إخلاء المسؤولية" },
  ja: { calculate: "計算する", reset: "リセット", copy: "コピー", download: "ダウンロード", results: "結果", inputs: "入力", formula: "計算式", example: "例", disclaimer: "免責事項" },
  ko: { calculate: "계산하기", reset: "초기화", copy: "복사", download: "다운로드", results: "결과", inputs: "입력값", formula: "공식", example: "예시", disclaimer: "면책 조항" },
};

const popularToolTranslations: Record<Locale, Record<string, { title: string; shortDescription: string }>> = {
  es: {
    sip: { title: "Calculadora SIP", shortDescription: "Calcula la rentabilidad de inversiones mensuales en fondos mutuos a lo largo del tiempo." },
    emi: { title: "Calculadora de EMI de préstamos", shortDescription: "Calcula la EMI mensual, el interés total y el desglose de pagos." },
    "gst-calculator": { title: "Calculadora de GST (India)", shortDescription: "Calcula importes con y sin GST según las tasas fiscales de India." },
    swp: { title: "Calculadora SWP", shortDescription: "Modela retiros sistemáticos con inflación, aportes al vencimiento de LIC y saldo de PF para planificar ingresos de jubilación." },
    "youtube-revenue-calculator": { title: "Calculadora de ingresos de YouTube", shortDescription: "Estima ingresos por anuncios, patrocinios y ganancias mensuales de YouTube según visualizaciones y RPM." },
    "invoice-generator": { title: "Generador de facturas", shortDescription: "Crea facturas profesionales para varios países con logo, colores personalizados, campos de GST/IVA/impuesto sobre ventas y descarga en PDF." },
    "lic-maturity-calculator": { title: "Calculadora de vencimiento de LIC", shortDescription: "Elige un plan LIC y obtén una estimación de vencimiento basada en plazo, PPT y bonificaciones ilustrativas." },
    "pf-calculator": { title: "Calculadora PF", shortDescription: "Proyecta tu fondo EPF/PF con saldo actual, aportes mensuales, aumento salarial anual y tasa de interés." },
    "ctc-in-hand-calculator": { title: "Calculadora de salario CTC a neto", shortDescription: "Estima el salario mensual neto a partir del CTC, con PF, gratificación, exención HRA y comparación de regímenes fiscales." },
    "json-formatter": { title: "Formateador y validador JSON", shortDescription: "Formatea, valida y embellece JSON con opciones avanzadas." },
  },
  pt: {},
  hi: {},
  ar: {},
  ja: {},
  ko: {},
};

// Populate the remaining popular-tool entries with the API translation below. Spanish entries
// are explicit to preserve high-quality wording for the most frequently used finance tools.

const readJson = async (path: string) => JSON.parse(await readFile(path, "utf8"));
const writeJson = async (path: string, value: unknown) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
};

async function translateBatch(locale: Locale, source: string[]): Promise<string[]> {
  if (!source.length) return [];
  return Promise.all(source.map(async (text) => {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "en");
    url.searchParams.set("tl", locale);
    url.searchParams.set("dt", "t");
    url.searchParams.set("q", text);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(url);
      if (response.ok) {
        const payload = await response.json() as [Array<[string]>];
        return payload[0].map((part) => part[0]).join("");
      }
      if (attempt === 2) {
        throw new Error(`Translation request failed for ${locale}: ${response.status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
    throw new Error(`Translation retries exhausted for ${locale}.`);
  }));
}

async function translateMeta(locale: Locale, source: Record<string, Record<string, unknown>>) {
  const output = structuredClone(source);
  const untranslated: Array<{ tool: string; field: "title" | "shortDescription"; value: string }> = [];

  for (const [tool, metadata] of Object.entries(output)) {
    const curated = popularToolTranslations[locale][tool];
    for (const field of ["title", "shortDescription"] as const) {
      if (typeof metadata[field] !== "string" || curated?.[field]) continue;
      untranslated.push({ tool, field, value: metadata[field] as string });
    }
    if (curated) Object.assign(metadata, curated);
  }

  // Small batches avoid URL-size limits while translating every non-curated title and description.
  for (let index = 0; index < untranslated.length; index += 20) {
    const batch = untranslated.slice(index, index + 20);
    const translated = await translateBatch(locale, batch.map((item) => item.value));
    batch.forEach((item, itemIndex) => {
      output[item.tool][item.field] = translated[itemIndex];
    });
  }
  return output;
}

function translateUi(locale: Locale, source: Record<string, Record<string, unknown>>) {
  const output = structuredClone(source);
  for (const tool of Object.values(output)) {
    for (const [key, translation] of Object.entries(uiTranslations[locale])) {
      if (key in tool) tool[key] = translation;
    }
  }
  return output;
}

async function translateMessageFile(locale: Locale, source: Record<string, unknown>) {
  const output = structuredClone(source);
  const strings: Array<{ parent: Record<string, unknown>; key: string; value: string }> = [];
  const collect = (node: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(node)) {
      if (typeof value === "string") strings.push({ parent: node, key, value });
      else if (value && typeof value === "object" && !Array.isArray(value)) collect(value as Record<string, unknown>);
    }
  };
  collect(output);

  for (let index = 0; index < strings.length; index += 20) {
    const batch = strings.slice(index, index + 20);
    const protectedValues = batch.map((item, itemIndex) => item.value
      .replaceAll("Ranburg LLP", "[[RANBURG_BRAND_LLP]]")
      .replaceAll("Ranburg", "[[RANBURG_BRAND]]")
      .replace(
        /\{([^}]+)\}/g,
        (_placeholder, name) => `[[RANBURG_PLACEHOLDER_${itemIndex}_${name.toUpperCase()}]]`,
      ));
    const translated = await translateBatch(locale, protectedValues);
    batch.forEach((item, itemIndex) => {
      let text = translated[itemIndex];
      const preservedLlpToken = text.includes("[[RANBURG_BRAND_LLP]]");
      const preservedBrandToken = text.includes("[[RANBURG_BRAND]]");
      text = text
        .replaceAll("[[RANBURG_BRAND_LLP]]", "Ranburg LLP")
        .replaceAll("[[RANBURG_BRAND]]", "Ranburg");
      // Some languages transliterate the readable token itself. Restore it by position
      // whenever a source message contains one of the protected brand names.
      const untranslatedLlpCount = preservedLlpToken ? 0 : (item.value.match(/Ranburg LLP/g) ?? []).length;
      const untranslatedBrandCount = preservedBrandToken ? 0 : (item.value.match(/Ranburg(?! LLP)/g) ?? []).length;
      for (let count = 0; count < untranslatedLlpCount; count += 1) {
        text = text.replace(/\[\[[^\]]+\]\]/, "Ranburg LLP");
      }
      for (let count = 0; count < untranslatedBrandCount; count += 1) {
        text = text.replace(/\[\[[^\]]+\]\]/, "Ranburg");
      }
      const placeholders = item.value.match(/\{[^}]+\}/g) ?? [];
      let placeholderIndex = 0;
      text = text.replace(
        /\[\[[^\]]*PLACEHOLDER_[0-9]+_[^\]]+\]\]/gi,
        () => placeholders[placeholderIndex++] ?? "",
      );
      item.parent[item.key] = text;
    });
  }
  return output;
}

async function main() {
  const meta = await readJson(join(root, "messages", "en", "tools.meta.json"));
  const ui = await readJson(join(root, "messages", "en", "tools.ui.json"));
  const messageFileNames = ["common.json", "nav.json", "footer.json", "home.json", "pages.json", "tools.shell.json"];

  for (const locale of locales) {
    for (const fileName of messageFileNames) {
      const source = await readJson(join(root, "messages", "en", fileName));
      await writeJson(
        join(root, "messages", locale, fileName),
        await translateMessageFile(locale, source),
      );
    }
    await writeJson(join(root, "messages", locale, "tools.ui.json"), translateUi(locale, ui));
    await writeJson(join(root, "messages", locale, "tools.meta.json"), await translateMeta(locale, meta));
    console.log(`Seeded ${locale}: 8 message files`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
