import * as locales from 'date-fns/locale';
import i18next from 'i18next';

const getDateFnsLocaleObject = () => {
  const { languages } = i18next;
  const selectedLanguage = languages[0];
  const fallbackLanguage = languages[languages.length-1];

  return locales[selectedLanguage.replace('-', '')] || locales[fallbackLanguage.replace('-', '')];
}

export default getDateFnsLocaleObject;
