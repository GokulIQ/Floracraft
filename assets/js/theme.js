/* ==========================================================================
   FLORACRAFT - THEME CONTROLLER (LIGHT / DARK MODE)
   ========================================================================== */

(function () {
  const THEME_KEY = "floracraft_theme";

  // Check saved or system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeToggleIcons(theme);
  }

  function updateThemeToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll(".theme-toggle-btn");
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector("i");
      if (icon) {
        if (theme === "dark") {
          icon.className = "fa-solid fa-sun";
          btn.setAttribute("title", "Switch to Light Mode");
        } else {
          icon.className = "fa-solid fa-moon";
          btn.setAttribute("title", "Switch to Dark Mode");
        }
      }
    });
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  // Expose toggle function globally
  window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (window.showToast) {
      window.showToast("Theme Updated", `Switched to ${newTheme.toUpperCase()} mode.`, "info");
    }
  };

  // Bind click listeners after DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    updateThemeToggleIcons(document.documentElement.getAttribute("data-theme") || "light");
    document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", window.toggleTheme);
    });
  });
})();
