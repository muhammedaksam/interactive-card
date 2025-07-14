import { Translations } from '../types';
import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';
import trTranslations from '../locales/tr.json';

export const translations: Record<string, Translations> = {
  en: enTranslations,
  pt: ptTranslations,
  tr: trTranslations,
};

export type Locales = 'en' | 'pt' | 'tr';

/**
 * Simple translation function that uses dot notation to access nested translation keys
 * @param key - Translation key in dot notation (e.g., "card.cardHolder")
 * @param params - Parameters to replace in the translated string
 * @param locale - Locale to use for translation
 * @returns Translated string or key as fallback
 */
export function translate(
  key: string,
  params: Record<string, unknown> = {},
  locale: Locales = 'en'
): string {
  const messages = translations[locale];

  // Navigate through the nested object using dot notation
  const keys = key.split('.');
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Key not found, return the key itself as fallback
      return key;
    }
  }

  if (typeof value !== 'string') {
    return key; // Not a string value, return key as fallback
  }

  // Replace parameters in the translated string
  let result = value;
  for (const [paramKey, paramValue] of Object.entries(params)) {
    const placeholder = `{${paramKey}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(paramValue));
  }

  return result;
}

/**
 * Shorthand translation function
 * @param key - Translation key in dot notation
 * @param locale - Locale to use for translation
 * @returns Translated string
 */
export const t = (key: string, locale: Locales = 'en'): string => {
  return translate(key, {}, locale);
};
