/* ==========================================================================
   FLORACRAFT - RTL / LTR CONTROLLER
   ========================================================================== */

(function () {
  const DIR_KEY = "floracraft_dir";

  function setDir(dir) {
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem(DIR_KEY, dir);
  }

  function renderDirectionLabels(dir) {
    document.querySelectorAll(".rtl-toggle-btn").forEach((btn) => {
      const nextDir = dir === "ltr" ? "rtl" : "ltr";
      btn.innerHTML = `<span class="rtl-label">${nextDir.toUpperCase()}</span>`;
      btn.setAttribute("title", `Switch to ${nextDir.toUpperCase()} layout`);
      btn.setAttribute("aria-label", `Switch to ${nextDir.toUpperCase()} layout`);
      btn.disabled = false;
    });
  }

  // Start in LTR unless the visitor has already selected a direction.
  const savedDir = localStorage.getItem(DIR_KEY) || "ltr";
  setDir(savedDir);

  window.toggleRTL = function () {
    const currentDir = document.documentElement.getAttribute("dir") || "ltr";
    const nextDir = currentDir === "ltr" ? "rtl" : "ltr";
    setDir(nextDir);
    renderDirectionLabels(nextDir);
    if (window.showToast) {
      window.showToast("Direction Changed", `Switched to ${nextDir.toUpperCase()} layout.`, "info");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const currentDir = document.documentElement.getAttribute("dir") || "ltr";
    renderDirectionLabels(currentDir);
    document.querySelectorAll(".rtl-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", window.toggleRTL);
    });
  });
})();
