
import React, { createContext, useContext, useState, useCallback } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  isTranslating: boolean;
  translatePage: (targetLanguage: string) => void;
  resetTranslation: () => void;
  availableLanguages: { code: string; name: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];

  const translatePage = useCallback((targetLanguage: string) => {
    if (targetLanguage === 'en') {
      resetTranslation();
      return;
    }

    setIsTranslating(true);
    setCurrentLanguage(targetLanguage);

    // Add Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);

      // Initialize Google Translate
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: availableLanguages.map(lang => lang.code).join(','),
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');

        // Trigger translation programmatically
        setTimeout(() => {
          const selectElement = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
          if (selectElement) {
            selectElement.value = targetLanguage;
            selectElement.dispatchEvent(new Event('change'));
          }
          setIsTranslating(false);
        }, 1000);
      };
    } else {
      // If script already exists, just trigger translation
      setTimeout(() => {
        const selectElement = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = targetLanguage;
          selectElement.dispatchEvent(new Event('change'));
        }
        setIsTranslating(false);
      }, 500);
    }
  }, [availableLanguages]);

  const resetTranslation = useCallback(() => {
    setCurrentLanguage('en');
    setIsTranslating(false);
    
    // Reset Google Translate
    const selectElement = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = 'en';
      selectElement.dispatchEvent(new Event('change'));
    }
  }, []);

  return (
    <TranslationContext.Provider value={{
      currentLanguage,
      isTranslating,
      translatePage,
      resetTranslation,
      availableLanguages
    }}>
      {children}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </TranslationContext.Provider>
  );
};
