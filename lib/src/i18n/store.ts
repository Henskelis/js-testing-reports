const locales = ["en", "fr"] as const;

type Locale = (typeof locales)[number];

type TranslationKeys = { [key: string]: TranslationKeys | string };

type TranslationObject = Record<Locale, TranslationKeys>;

type LocaleOptions = {
  fallback?: Locale;
};

type I18nStore = {
  locale: Locale;
  dictionary: TranslationObject;
};

type TranslateOptions = {
  vars?: Record<string, string>;
  maxLength?: number;
  locale?: Locale;
};

export const setLocale = (options?: LocaleOptions): Locale => {
  const fallback = options?.fallback ?? "en";
  const browserLanguage = navigator.language.split("-").at(0) as Locale;

  if (locales.includes(browserLanguage)) {
    return browserLanguage;
  }

  return fallback;
};

const store: I18nStore = {
  locale: setLocale(),
  dictionary: locales.reduce((acc, v) => Object.assign(acc, { [v]: {} }), {} as TranslationObject),
};

export const loadTranslations = (translations: TranslationObject) => {
  for (const locale of locales) {
    store.dictionary[locale] = translations[locale];
  }
};

export const translate = (key: string, options?: TranslateOptions) => {
  const identifiers = key.split(".");
  const vars = options?.vars;
  const maxLength = options?.maxLength;
  const locale = options?.locale ?? store.locale;
  const localeDictionary = store.dictionary[locale];

  let value: TranslationKeys | string | undefined;

  for (const [idx, identifier] of identifiers.entries()) {
    if (idx === 0) {
      value = localeDictionary[identifier];
    } else {
      if (value !== undefined && typeof value !== "string") {
        value = value[identifier];
      }
    }

    if (value === undefined) {
      break;
    }

    if (typeof value === "string") {
      if (identifier !== identifiers.at(-1)) {
        break;
      }

      let result = value as string;

      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          result = result.replaceAll(`%${k}%`, v);
        }
      }

      if (maxLength && result.length > maxLength) {
        return `${result.slice(0, maxLength)}...`;
      }

      return result;
    }
  }

  return `Translation missing for ${key}`;
};

export default store;
