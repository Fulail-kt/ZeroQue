'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

const LangSelector = () => {
    const { i18n } = useTranslation();
    
    const languages = [
        { code: 'ar', lang: 'Arabic' },
        { code: 'en', lang: 'English' },
        { code: 'fr', lang: 'French' },
        { code: 'hi', lang: 'Hindi' },
        { code: 'te', lang: 'Telugu' },
        { code: 'ml', lang: 'Malayalam' },
        { code: 'bn', lang: 'Bengali' },
    ];

    
    
    useEffect(() => {
        const langChange=async()=>{
            const savedLang = localStorage.getItem('selectedLanguage');
            if (savedLang && savedLang !== i18n.language) {
                await i18n.changeLanguage(savedLang);
            }
        }
        void langChange()
    }, [i18n]);
    
    useEffect(() => {
        document.body.dir=i18n.dir();
    }, [i18n,i18n.language]);

    const handleLanguageChange = async(code: string) => {
       await i18n.changeLanguage(code);
        localStorage.setItem('selectedLanguage', code);
    };

    return (
        <div>
            <Select
                value={i18n.language}
                onValueChange={handleLanguageChange}
            >
                <SelectTrigger className="!h-7 mt-1 gap-x-2 focus:outline-none outline-none focus:ring-0 ring-offset-0">
                    <SelectValue placeholder={languages.find(lang => lang.code === i18n.language)?.lang ?? 'English'} />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.lang}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LangSelector;