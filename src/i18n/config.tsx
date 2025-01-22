'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

import en from '~/i18n/locals/en';
import fr from '~/i18n/locals/fr';
import ar from '~/i18n/locals/ar';
import hi from '~/i18n/locals/hi';
import bn from '~/i18n/locals/bn';
import te from '~/i18n/locals/te';
import ml from '~/i18n/locals/ml';

const resources = {
  en,
  fr,
  ar, 
  hi,
  bn,
  te,
  ml
};


if (!i18n.isInitialized) {
  await i18n
    .use(initReactI18next)
    .init({
      returnObjects: true,
      resources,
      lng: 'en',
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });
}
export function I18nProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);

  const langChange=async(savedLang:string)=>{
    await i18n.changeLanguage(savedLang);
  }
  useEffect(() => {
    // Get saved language from localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    
    if (savedLang && Object.keys(resources).includes(savedLang)) {
      langChange(savedLang)
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; 
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

