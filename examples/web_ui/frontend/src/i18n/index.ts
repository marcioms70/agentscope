import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptBrTranslations from './locales/pt-BR.json';
import zhTranslations from './locales/zh.json';

export const LANGUAGE_STORAGE_KEY = 'agentscope-ui-language';
export const AVAILABLE_LANGUAGES = ['pt-BR', 'en', 'zh'] as const;
export type AvailableLanguage = (typeof AVAILABLE_LANGUAGES)[number];

function getSavedLanguage(): AvailableLanguage | undefined {
	try {
		const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
		return AVAILABLE_LANGUAGES.find((language) => language === saved);
	} catch {
		// Browser storage may be unavailable; use regular language detection.
		return undefined;
	}
}

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		// Explicitly restore a user-selected locale before the first render.
		lng: getSavedLanguage(),
		load: 'currentOnly',
		resources: {
			en: { translation: enTranslations },
			'pt-BR': { translation: ptBrTranslations },
			zh: { translation: zhTranslations },
		},
		fallbackLng: 'en',
		supportedLngs: ['en', 'zh', 'pt-BR'],
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

export async function selectLanguage(language: AvailableLanguage): Promise<void> {
	// Explicitly persist the selection. Browser detection alone can pick up
	// an older cached locale after navigation or a deployment.
	let saved = false;
	try {
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
		saved = true;
	} catch {
		// Switching still works for this session when storage is unavailable.
	}

	await i18n.changeLanguage(language);
	setDocumentLanguage(language);

	// A single reload guarantees all panels and cached UI state adopt the
	// selected locale; when storage is blocked, stay on the translated page.
	if (saved) window.location.reload();
}

export default i18n;
