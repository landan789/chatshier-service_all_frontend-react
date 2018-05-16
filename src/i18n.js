import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';

const language =
    (navigator.languages && navigator.languages[0]) ||
    navigator.language ||
    navigator.userLanguage;

i18next.use(XHR).init({
    fallbackLng: 'en',
    lowerCaseLng: true,
    lng: language,
    load: 'currentOnly',
    debug: true,
    interpolation: {
        escapeValue: false
    },
    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
        crossDomain: true,
        withCredentials: true
    }
});

export default i18next;
