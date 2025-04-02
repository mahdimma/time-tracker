// src/components/MyLanguageSwitcher.js (or your file name)
import React from "react";
import { useTranslation } from "react-i18next";

function MyLanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;
  const languages = [ // Define available languages
    { code: 'en', name: 'English' },
    { code: 'fa', name: 'فارسی' },
    // Add more languages here if needed
  ];

  return (
    // Use flex and space utilities. RTL support is handled by the parent/global dir attribute mostly.
    // Tailwind's space-x-* utilities automatically reverse in RTL if `dir="rtl"` is set globally.
    <div className="flex space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          disabled={currentLanguage === lang.code} // Disable button for current language
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
            ${currentLanguage === lang.code
              ? 'bg-blue-600 text-white cursor-default' // Style for active/disabled
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // Style for inactive
            }
          `}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}

export default MyLanguageSwitcher;