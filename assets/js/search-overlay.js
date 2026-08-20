/* ==========================================================================
   FLORACRAFT - GLOBAL BOTANICAL SEARCH OVERLAY (CMD/CTRL + K)
   High-speed typeahead modal with image previews, tags & quick cart
   ========================================================================== */

(function () {
  function injectSearchModalHTML() {
    if (document.getElementById("globalSearchModal")) return;

    const modalHTML = `
      <div class="modal fade" id="globalSearchModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content border-0 shadow-lg" style="border-radius: var(--radius-lg); background: var(--bg-surface);">
            <div class="modal-header border-bottom p-3">
              <div class="input-group align-items-center w-100">
                <span class="input-group-text bg-transparent border-0 fs-5 text-primary ps-0"><i class="fa-solid fa-magnifying-glass"></i></span>
                <input type="text" id="globalSearchInput" class="form-control border-0 shadow-none fs-5" placeholder="Search plants, terracotta pots, tools, soil (e.g., 'pet friendly', 'monstera')..." autofocus>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="window.closeModal && window.closeModal(this)"></button>
              </div>
            </div>
            
            <div class="modal-body p-4">
              <!-- Quick Search Chips -->
              <div class="mb-3">
                <span class="small fw-bold text-muted me-2">Popular Searches:</span>
                <span class="badge bg-surface-alt text-main border cursor-pointer me-1 quick-chip" data-query="indoor">Indoor Plants</span>
                <span class="badge bg-surface-alt text-main border cursor-pointer me-1 quick-chip" data-query="terracotta">Terracotta Pots</span>
                <span class="badge bg-surface-alt text-main border cursor-pointer me-1 quick-chip" data-query="soil">Bio-Active Soil</span>
                <span class="badge bg-surface-alt text-main border cursor-pointer quick-chip" data-query="brass">Brass Misting Set</span>
              </div>

              <!-- Instant Results List -->
              <div id="globalSearchResultsContainer" class="d-flex flex-column gap-2">
                <div class="text-center py-4 text-muted">
                  <i class="fa-solid fa-seedling fs-1 opacity-50 mb-2"></i>
                  <p class="small mb-0">Type keywords to search our entire botanical catalog...</p>
                </div>
              </div>
            </div>
            
            <div class="modal-footer border-top py-2 px-3 d-flex justify-content-between small text-muted">
              <span><kbd>ESC</kbd> to close</span>
              <span><i class="fa-solid fa-bolt text-warning me-1"></i> Instant Botanical Search</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Bind input listener
    const searchInput = document.getElementById("globalSearchInput");
    searchInput?.addEventListener("input", (e) => {
      renderSearchMatches(e.target.value);
    });

    // Bind quick chips
    document.querySelectorAll(".quick-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.getAttribute("data-query");
        if (searchInput) {
          searchInput.value = q;
          renderSearchMatches(q);
        }
      });
    });
  }

  function renderSearchMatches(query) {
    const container = document.getElementById("globalSearchResultsContainer");
    if (!container || !window.FLORACRAFT_DATA) return;

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="fa-solid fa-seedling fs-1 opacity-50 mb-2"></i>
          <p class="small mb-0">Type keywords to search our entire botanical catalog...</p>
        </div>
      `;
      return;
    }

    const matches = window.FLORACRAFT_DATA.products.filter((p) => {
      return (
        p.name.toLowerCase().includes(trimmed) ||
        p.category.toLowerCase().includes(trimmed) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(trimmed)) ||
        (p.description && p.description.toLowerCase().includes(trimmed)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(trimmed))) ||
        (p.difficulty && p.difficulty.toLowerCase().includes(trimmed))
      );
    });

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="fa-solid fa-magnifying-glass-chart fs-1 opacity-50 mb-2"></i>
          <p class="mb-1">No botanical specimens found matching <strong>"${query}"</strong></p>
          <a href="products.html" class="small text-primary text-decoration-underline" data-bs-dismiss="modal">Browse complete catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = matches
      .slice(0, 6)
      .map(
        (p) => `
      <div class="card p-3 border-0 bg-surface-alt rounded-3 shadow-none">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-3">
            <img src="${p.images[0]}" alt="${p.name}" class="rounded-2" style="width:50px; height:50px; object-fit:cover;">
            <div>
              <h6 class="fw-bold mb-0"><a href="product-details.html?id=${p.id}" class="text-main text-decoration-none">${p.name}</a></h6>
              <div class="d-flex align-items-center gap-2 small">
                <span class="text-primary fw-bold">${window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`}</span>
                <span class="text-muted">• ${p.category}</span>
                ${p.petFriendly ? '<span class="badge bg-warning-subtle text-dark" style="font-size:0.65rem;">Pet Safe</span>' : ''}
              </div>
            </div>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" onclick="window.addToCart('${p.id}', 1)" title="Add to basket"><i class="fa-solid fa-cart-plus"></i></button>
            <a href="product-details.html?id=${p.id}" class="btn btn-primary btn-sm">View</a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  window.openGlobalSearch = function () {
    injectSearchModalHTML();
    const modalEl = document.getElementById("globalSearchModal");
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      setTimeout(() => {
        document.getElementById("globalSearchInput")?.focus();
      }, 400);
    }
  };

  // Keyboard shortcut: Ctrl + K or Cmd + K
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      window.openGlobalSearch();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    injectSearchModalHTML();
    document.querySelectorAll(".header-search-form input, .header-search-form button").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.openGlobalSearch();
      });
    });
  });
})();
