import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptBrTranslations from './locales/pt-BR.json';
import zhTranslations from './locales/zh.json';

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: enTranslations },
			'pt-BR': { translation: ptBrTranslations },
			zh: { translation: zhTranslations },
		},
		fallbackLng: 'en',
		supportedLngs: ['en', 'zh', 'pt-BR'],
		nonExplicitSupportedLngs: true,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
	});

// Keep native browser controls and screen readers in sync with the selected locale.
const setDocumentLanguage = (language: string) => {
	document.documentElement.lang = language;
};
setDocumentLanguage(i18n.language);
i18n.on('languageChanged', setDocumentLanguage);

export default i18n;
