let currentLang = "en";

async function loadLanguage(lang) {
  try {
    const response = await fetch(`assets/lang/${lang}.json`);
    const translations = await response.json();

    // تحديث النصوص باستخدام الهيكل الصحيح للبيانات
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const keys = el.getAttribute("data-i18n").split(".");
      let value = translations;
      for (const key of keys) {
        value = value[key];
      }
      if (value) {
        el.textContent = value;
      }
    });

    // تحديث placeholder باستخدام الهيكل الصحيح للبيانات
    document.querySelectorAll("[data-placeholder]").forEach((el) => {
      const keys = el.getAttribute("data-placeholder").split(".");
      let value = translations;
      for (const key of keys) {
        value = value[key];
      }
      if (value) {
        el.setAttribute("placeholder", value);
      }
    });

    currentLang = lang;
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}

// تحديث شكل وحالة الزر
function updateButtonState() {
  const btn = document.getElementById("langToggleBtn");
  btn.textContent = currentLang === "en" ? "BN" : "EN";
  btn.classList.toggle("active", currentLang === "bn");
}

// زر تغيير اللغة
document.getElementById("langToggleBtn").addEventListener("click", async () => {
  const newLang = currentLang === "en" ? "bn" : "en";
  await loadLanguage(newLang);
  updateButtonState();
});

// تحميل اللغة الافتراضية
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
  updateButtonState();
});