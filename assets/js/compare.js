/* ==========================================================================
   FLORACRAFT - PRODUCT COMPARISON CONTROLLER
   Side-by-side specifications, max 4 products, LocalStorage state
   ========================================================================== */

(function () {
  const COMPARE_KEY = "floracraft_compare";

  window.getCompareList = function () {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  function saveCompareList(list) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
    updateCompareBadges();
    window.dispatchEvent(new CustomEvent("floracraft_compare_updated", { detail: { compare: list } }));
  }

  window.addToCompare = function (productId) {
    if (!window.FLORACRAFT_DATA) return;
    const product = (window.getProductById ? window.getProductById(productId) : null) || window.FLORACRAFT_DATA.products.find((p) => p.id === productId);
    if (!product) return;

    let list = window.getCompareList();
    if (list.includes(productId)) {
      if (window.showToast) {
        window.showToast("Already in Comparison", `${product.name} is already in your comparison table.`, "info");
      }
      return;
    }

    if (list.length >= 4) {
      if (window.showToast) {
        window.showToast("Limit Reached", "You can compare up to 4 products at a time.", "warning");
      }
      return;
    }

    list.push(productId);
    saveCompareList(list);
    if (window.showToast) {
      window.showToast("Added to Comparison", `${product.name} added to comparison list.`, "success");
    }
  };

  window.removeFromCompare = function (productId) {
    let list = window.getCompareList();
    list = list.filter((id) => id !== productId);
    saveCompareList(list);
  };

  window.clearCompare = function () {
    localStorage.removeItem(COMPARE_KEY);
    saveCompareList([]);
  };

  function updateCompareBadges() {
    const list = window.getCompareList();
    document.querySelectorAll(".compare-count-badge").forEach((badge) => {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? "flex" : "none";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCompareBadges();
  });
})();
