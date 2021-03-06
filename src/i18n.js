import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import { translate } from 'react-i18next';

// /** @type {string} */
// let currentLanguage =
//     (navigator.languages && navigator.languages[0]) ||
//     navigator.language ||
//     navigator.userLanguage;
// currentLanguage = currentLanguage.toLocaleLowerCase();
// if (currentLanguage.startsWith('zh')) {
//     currentLanguage = 'zh-tw';
// } else {
//     currentLanguage = 'en-us';
// }
let currentLanguage = 'zh-tw';

i18next.use(XHR).init({
    lowerCaseLng: true, // 語系統一自動轉為小寫，來處理檔案名稱
    load: 'currentOnly', // 只載入與語系相同的檔案
    fallbackLng: 'en-us',
    lng: currentLanguage,
    ns: 'translation',
    debug: false,
    keySeparator: false, // 允許 i18nKey 中有逗號
    nsSeparator: false,
    interpolation: {
        escapeValue: false
    },
    react: {
        wait: true,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },
    backend: {
        loadPath: '/locales/{{lng}}.json',
        crossDomain: true,
        withCredentials: true
    }
});

export default i18next;
export { currentLanguage };
export const withTranslate = translate();
