import { de, enUS } from 'date-fns/locale';
import i18next from 'i18next';

const locales = { de, en: enUS };

export default function getDateFnsLocaleObject() {
  const { languages } = i18next;
  const selectedLanguage = languages[0];
  const fallbackLanguage = languages[languages.length - 1];

  return locales[selectedLanguage.split('-')[0]] || locales[fallbackLanguage.split('-')[0]];
}
