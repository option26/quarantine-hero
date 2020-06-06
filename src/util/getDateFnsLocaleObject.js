import { de, enUS } from 'date-fns/locale';
import i18next from 'i18next';

const locales = { 'de': de, 'en': enUS };

const cutOffFromChar = (string, char) => string.indexOf(char) === -1 ? string : string.substring(0, string.indexOf(char));

const getDateFnsLocaleObject = () => {
  const { languages } = i18next;
  const selectedLanguage = languages[0];
  const fallbackLanguage = languages[languages.length-1];

  return locales[cutOffFromChar(selectedLanguage, '-')] || locales[cutOffFromChar(fallbackLanguage, '-')];
}

export default getDateFnsLocaleObject;
