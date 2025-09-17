import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number } | { returnObjects: true }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({ en: {}, vi: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enRes, viRes] = await Promise.all([
          fetch('./translations/en.json'),
          fetch('./translations/vi.json')
        ]);
        if (!enRes.ok || !viRes.ok) {
            throw new Error('Failed to fetch translation files');
        }
        const enData = await enRes.json();
        const viData = await viRes.json();
        setTranslations({ en: enData, vi: viData });
      } catch (error) {
        console.error("Failed to load translation files", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTranslations();
  }, []);

  const t = useCallback((key: string, options: { [key: string]: string | number } | { returnObjects: true } = {}) => {
    if (loading) return '';

    const currentTranslations = translations[language] || {};
    const fallbackTranslations = translations.en || {};

    const resolveKey = (translationObject: any, keyString: string) => {
        const keys = keyString.split('.');
        let result: any = translationObject;
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                return null; // Not found
            }
        }
        return result;
    };

    let result = resolveKey(currentTranslations, key);
    if (result === null) {
        result = resolveKey(fallbackTranslations, key);
    }
    if (result === null) {
        return key; // Return the key itself if not found anywhere
    }

    if (options && (options as { returnObjects?: boolean }).returnObjects) {
        return result;
    }

    if (typeof result === 'string') {
      return Object.entries(options).reduce((acc, [optKey, optValue]) => {
        return acc.replace(`{{${optKey}}}`, String(optValue));
      }, result);
    }
    
    return result || key;
  }, [language, translations, loading]);

  const value = { language, setLanguage, t };
  
  if (loading) {
      // Render a simple loading state or null to prevent the app from rendering with no text
      return <div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};