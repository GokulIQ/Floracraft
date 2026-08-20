/* ==========================================================================
   FLORACRAFT - MULTI-CURRENCY CONVERTER SYSTEM
   Real-time conversion & formatting across products, cart, checkout & bulk
   ========================================================================== */

(function () {
  const CURRENCY_KEY = "floracraft_currency";

  const CURRENCY_RATES = {
    USD: { symbol: "$", rate: 1.00, label: "USD ($)", name: "US Dollar" },
    EUR: { symbol: "€", rate: 0.92, label: "EUR (€)", name: "Euro" },
    GBP: { symbol: "£", rate: 0.79, label: "GBP (£)", name: "British Pound" },
    CAD: { symbol: "CA$", rate: 1.36, label: "CAD (CA$)", name: "Canadian Dollar" },
    AUD: { symbol: "AU$", rate: 1.52, label: "AUD (AU$)", name: "Australian Dollar" },
    JPY: { symbol: "¥", rate: 155.0, label: "JPY (¥)", name: "Japanese Yen" },
    INR: { symbol: "₹", rate: 83.50, label: "INR (₹)", name: "Indian Rupee" }
  };

  window.getSelectedCurrency = function () {
    return localStorage.getItem(CURRENCY_KEY) || "USD";
  };

  window.formatPrice = function (amountInUSD) {
    const curCode = window.getSelectedCurrency();
    const curInfo = CURRENCY_RATES[curCode] || CURRENCY_RATES.USD;
    const converted = amountInUSD * curInfo.rate;

    if (curCode === "JPY") {
      return `${curInfo.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curInfo.symbol}${converted.toFixed(2)}`;
  };

  window.setCurrency = function (curCode) {
    if (CURRENCY_RATES[curCode]) {
      localStorage.setItem(CURRENCY_KEY, curCode);
      updateCurrencyDropdowns();
      // Notify all pages and cart
      window.dispatchEvent(new CustomEvent("floracraft_currency_changed", { detail: { currency: curCode } }));
      if (window.showToast) {
        window.showToast("Currency Changed", `Displaying prices in ${CURRENCY_RATES[curCode].label}`, "info");
      }
      // Re-render cart drawer if open
      if (window.renderCartDrawer) window.renderCartDrawer();
      // Trigger page re-render if catalog
      if (window.applyFilters) window.applyFilters();
    }
  };

  function updateCurrencyDropdowns() {
    const curCode = window.getSelectedCurrency();
    document.querySelectorAll(".current-currency-label").forEach((el) => {
      el.textContent = curCode;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCurrencyDropdowns();
    document.querySelectorAll(".currency-select-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const code = item.getAttribute("data-currency");
        if (code) window.setCurrency(code);
      });
    });
  });
})();
