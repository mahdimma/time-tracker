import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2 rtl:space-x-reverse">
      {i18n.language === "en" ? (
        <button
          onClick={() => changeLanguage("fa")}
          className="px-4 py-2 rounded-lg transition-all duration-300 bg-blue-500 text-white"
        >
          English
        </button>
      ) : (
        <button
          onClick={() => changeLanguage("en")}
          className="px-4 py-2 rounded-lg transition-all duration-300 bg-blue-500 text-white"
        >
          فارسی
        </button>
      )}
    </div>
  );
}

export default LanguageSwitcher;
