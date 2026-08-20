/* ==========================================================================
   FLORACRAFT - RECENTLY VIEWED PRODUCTS TRACKER & FLOATING BAR
   Automatically logs visited specimens and offers quick re-access
   ========================================================================== */

(function () {
  const RECENT_KEY = "floracraft_recently_viewed";

  window.recordProductView = function (productId) {
    if (!productId) return;
    let list = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    list = list.filter((id) => id !== productId);
    list.unshift(productId);
    if (list.length > 8) list = list.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    renderRecentViewsBar();
  };

  window.getRecentViews = function () {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  };

  function renderRecentViewsBar() {
    const list = window.getRecentViews();
    if (list.length < 2 || !window.FLORACRAFT_DATA) return;

    let barEl = document.getElementById("recentViewsBar");
    if (!barEl) {
      const html = `
        <div id="recentViewsBar" class="d-none d-lg-block position-fixed bottom-0 start-50 translate-middle-x mb-3 z-3" style="max-width:920px; width:92%;">
          <div class="card border-0 bg-surface shadow-lg rounded-pill p-2 px-4 d-flex flex-row align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2 me-3">
              <i class="fa-solid fa-clock-rotate-left text-primary fs-5"></i>
              <span class="small fw-bold text-nowrap">Recently Viewed:</span>
            </div>
            <div id="recentViewsItemsContainer" class="d-flex align-items-center gap-3 overflow-auto py-1"></div>
            <button class="btn-close btn-close-sm ms-2" onclick="document.getElementById('recentViewsBar').remove()" title="Dismiss"></button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", html);
      barEl = document.getElementById("recentViewsBar");
    }

    const container = document.getElementById("recentViewsItemsContainer");
    if (!container) return;

    const recentProducts = list
      .map((id) => window.FLORACRAFT_DATA.products.find((p) => p.id === id))
      .filter(Boolean);

    container.innerHTML = recentProducts
      .slice(0, 4)
      .map(
        (p) => `
      <a href="product-details.html?id=${p.id}" class="d-flex align-items-center gap-2 text-decoration-none text-main bg-surface-alt p-1 pe-3 rounded-pill" style="min-width:140px;">
        <img src="${p.images[0]}" alt="${p.name}" class="rounded-circle" style="width:32px; height:32px; object-fit:cover;">
        <div class="lh-1">
          <span class="d-block text-truncate fw-bold" style="max-width:90px; font-size:0.75rem;">${p.name}</span>
          <span class="text-primary fw-bold" style="font-size:0.7rem;">${window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`}</span>
        </div>
      </a>
    `
      )
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderRecentViewsBar();
  });
})();
