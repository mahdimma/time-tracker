import React from "react";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();
  
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>404</h1>
      <p>{t("page_not_found")}</p>
    </div>
  );
}
