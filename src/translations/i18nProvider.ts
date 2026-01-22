import type { I18nProvider } from "@refinedev/core";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { authFr } from "./fr/authFr";
import { appFr } from "./fr/appFr";

let currentLocale = "fr";

const resources = {
  fr: {
    translation: {
      ...authFr,
      ...appFr,
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: currentLocale,
    fallbackLng: currentLocale,
    interpolation: {
      escapeValue: false,
    },
  });

export const i18nProvider: I18nProvider = {
  translate: (key: string, options?: any, defaultMessage?: string) =>
    i18n.t(key, { ...options, defaultValue: defaultMessage }),
  changeLocale: async (lang: string) => {
    await i18n.changeLanguage(lang);
  },
  getLocale: () => i18n.language,
};