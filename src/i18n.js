async function loadLanguage(lang) {
    const response = await fetch(`/lang/${lang}.json`);
    const translations = await response.json();
  
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) el.textContent = translations[key];
    });
  
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) el.placeholder = translations[key];
    });
  
    document.querySelectorAll("[data-i18n-option]").forEach(el => {
      const key = el.getAttribute("data-i18n-option");
      if (translations[key]) el.textContent = translations[key];
    });
  }
  
  function setLanguage(lang) {
    localStorage.setItem("lang", lang);
    loadLanguage(lang);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "pt";
    loadLanguage(savedLang);
  
    const select = document.getElementById("languageSelect");
    if (select) {
      select.value = savedLang;
      select.addEventListener("change", e => setLanguage(e.target.value));
    }
  });