import { zh } from './zh';
import { en } from './en';
import { fr } from './fr';

export type Language = 'zh' | 'en' | 'fr';
export type TranslationKey = keyof typeof zh;

export const translations = {
  zh,
  en,
  fr
};

export const defaultLanguage: Language = 'zh';

// Detect browser language
export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  
  if (browserLang.startsWith('zh')) {
    return 'zh';
  }
  if (browserLang.startsWith('fr')) {
    return 'fr';
  }
  return 'en';
}
