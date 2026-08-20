/* ==========================================================================
   FLORACRAFT - PRODUCTS CATALOG & MULTI-FILTER CONTROLLER
   Search, Category Pills, Min/Max Price, Ratings, Availability, Discounts,
   Sorting, Active Filter Chips, Pagination & Grid/List views.
   ========================================================================== */

(function () {
  let allProducts = [];
  let filteredProducts = [];
  let currentPage = 1;
  let itemsPerPage = 8;
  let showAllItems = false;
  let currentView = "grid"; // 'grid' | 'list'

  function initProductsPage() {
    if (!window.FLORACRAFT_DATA || !window.FLORACRAFT_DATA.products) return;
    allProducts = [...window.FLORACRAFT_DATA.products];

    updateCategoryCounts();

    // Check URL parameters for pre-selected filters
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("category");
    const searchParam = urlParams.get("search");
    const filterParam = urlParams.get("filter");

    if (catParam) {
      const checkbox = document.querySelector(`input[name="categoryFilter"][value="${catParam}"]`);
      if (checkbox) checkbox.checked = true;
      const mobileCheckbox = document.querySelector(`input[name="mobileCategoryFilter"][value="${catParam}"]`);
      if (mobileCheckbox) mobileCheckbox.checked = true;
      const pill = document.querySelector(`.category-pill-btn[data-pill-cat="${catParam}"]`);
      if (pill) {
        document.querySelectorAll(".category-pill-btn").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
      }
    }

    if (searchParam) {
      const searchInput = document.getElementById("catalogSearchInput");
      if (searchInput) searchInput.value = searchParam;
      const mobileSearch = document.getElementById("mobileSearchInput");
      if (mobileSearch) mobileSearch.value = searchParam;
    }

    if (filterParam === "sale") {
      const saleCb = document.getElementById("onSaleOnlyCheckbox");
      if (saleCb) saleCb.checked = true;
      const mSaleCb = document.getElementById("mobileOnSaleCheckbox");
      if (mSaleCb) mSaleCb.checked = true;
    } else if (filterParam === "pets") {
      const petCb = document.getElementById("petFriendlyCheckbox");
      if (petCb) petCb.checked = true;
      const mPetCb = document.getElementById("mobilePetCheckbox");
      if (mPetCb) mPetCb.checked = true;
    }

    setupEventListeners();
    applyFilters();

    // Smooth scroll down to catalog if filtered by category parameter
    if (catParam || searchParam || filterParam) {
      setTimeout(() => {
        const target = document.getElementById("catalogProductsContainer");
        if (target) {
          const topOffset = target.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
        }
      }, 150);
    }

    // Listen to browser navigation changes
    window.addEventListener("popstate", () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentCat = currentParams.get("category");
      document.querySelectorAll('input[name="categoryFilter"]').forEach((cb) => {
        cb.checked = currentCat ? cb.value === currentCat : false;
      });
      document.querySelectorAll(".category-pill-btn").forEach((p) => {
        p.classList.toggle("active", currentCat ? p.getAttribute("data-pill-cat") === currentCat : p.getAttribute("data-pill-cat") === "all");
      });
      currentPage = 1;
      applyFilters();
    });
  }

  function updateCategoryCounts() {
    const cats = ["indoor-plants", "outdoor-plants", "flower-pots", "seeds", "soil-fertilizers", "gardening-tools", "plant-accessories"];
    cats.forEach((cat) => {
      const count = allProducts.filter((p) => p.category === cat).length;
      const badge = document.getElementById(`count-${cat}`);
      if (badge) badge.textContent = count;
      const pill = document.querySelector(`.category-pill-btn[data-pill-cat="${cat}"] .pill-count`);
      if (pill) pill.textContent = count;
    });

    const allPillCount = document.querySelector('.category-pill-btn[data-pill-cat="all"] .pill-count');
    if (allPillCount) allPillCount.textContent = allProducts.length;
  }

  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById("catalogSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchInputBtn");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchInput.value.trim() ? "block" : "none";
        }
        currentPage = 1;
        applyFilters();
      });
    }

    if (clearSearchBtn && searchInput) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        currentPage = 1;
        applyFilters();
      });
    }

    // Top Category Pill buttons
    document.querySelectorAll(".category-pill-btn").forEach((pill) => {
      pill.addEventListener("click", () => {
        const cat = pill.getAttribute("data-pill-cat");
        document.querySelectorAll(".category-pill-btn").forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        // Uncheck all sidebar checkboxes
        document.querySelectorAll('input[name="categoryFilter"]').forEach((cb) => (cb.checked = false));

        if (cat !== "all") {
          const matchingCb = document.querySelector(`input[name="categoryFilter"][value="${cat}"]`);
          if (matchingCb) matchingCb.checked = true;
        }

        currentPage = 1;
        applyFilters();
      });
    });

    // Sidebar Category checkboxes
    document.querySelectorAll('input[name="categoryFilter"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        currentPage = 1;
        updatePillsFromCheckboxes();
        applyFilters();
      });
    });

    // Price Range Slider & Inputs
    const priceSlider = document.getElementById("priceRangeSlider");
    const priceDisplay = document.getElementById("priceRangeValue");
    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");

    if (priceSlider && priceDisplay) {
      priceSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        priceDisplay.textContent = `$${val}`;
        if (maxPriceInput) maxPriceInput.value = val;
        currentPage = 1;
        applyFilters();
      });
    }

    if (minPriceInput) {
      minPriceInput.addEventListener("input", () => {
        currentPage = 1;
        applyFilters();
      });
    }

    if (maxPriceInput) {
      maxPriceInput.addEventListener("input", () => {
        const val = parseFloat(maxPriceInput.value) || 120;
        if (priceSlider) priceSlider.value = val;
        if (priceDisplay) priceDisplay.textContent = `$${val}`;
        currentPage = 1;
        applyFilters();
      });
    }

    // Rating Filter Radios
    document.querySelectorAll('input[name="ratingFilter"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        currentPage = 1;
        applyFilters();
      });
    });

    // Availability & Offers checkboxes
    const inStockCb = document.getElementById("inStockOnlyCheckbox");
    const onSaleCb = document.getElementById("onSaleOnlyCheckbox");
    if (inStockCb) inStockCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    if (onSaleCb) onSaleCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });

    // Botanical Features checkboxes
    const petCb = document.getElementById("petFriendlyCheckbox");
    const airCb = document.getElementById("airPurifyingCheckbox");
    const lightCb = document.getElementById("lowLightCheckbox");
    const difficultyCb = document.getElementById("beginnerCheckbox");

    if (petCb) petCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    if (airCb) airCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    if (lightCb) lightCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    if (difficultyCb) difficultyCb.addEventListener("change", () => { currentPage = 1; applyFilters(); });

    // Items Per Page Select
    const perPageSelect = document.getElementById("catalogPerPageSelect");
    if (perPageSelect) {
      perPageSelect.addEventListener("change", (e) => {
        showAllItems = e.target.value === "all";
        if (!showAllItems) itemsPerPage = parseInt(e.target.value) || 8;
        currentPage = 1;
        applyFilters();
      });
    }

    // Mobile Offcanvas Filter Sync
    const mobileSearch = document.getElementById("mobileSearchInput");
    if (mobileSearch) {
      mobileSearch.addEventListener("input", () => {
        const desktopSearch = document.getElementById("catalogSearchInput");
        if (desktopSearch) desktopSearch.value = mobileSearch.value;
        currentPage = 1;
        applyFilters();
      });
    }

    document.querySelectorAll('input[name="mobileCategoryFilter"]').forEach((mcb) => {
      mcb.addEventListener("change", () => {
        const desktopCb = document.querySelector(`input[name="categoryFilter"][value="${mcb.value}"]`);
        if (desktopCb) desktopCb.checked = mcb.checked;
        updatePillsFromCheckboxes();
        currentPage = 1;
        applyFilters();
      });
    });

    const mobileSlider = document.getElementById("mobilePriceSlider");
    const mobilePriceDisplay = document.getElementById("mobilePriceDisplay");
    if (mobileSlider) {
      mobileSlider.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        if (mobilePriceDisplay) mobilePriceDisplay.textContent = `$${val}`;
        const desktopSlider = document.getElementById("priceRangeSlider");
        const desktopDisplay = document.getElementById("priceRangeValue");
        const maxInput = document.getElementById("maxPriceInput");
        if (desktopSlider) desktopSlider.value = val;
        if (desktopDisplay) desktopDisplay.textContent = `$${val}`;
        if (maxInput) maxInput.value = val;
        currentPage = 1;
        applyFilters();
      });
    }

    const mobileStock = document.getElementById("mobileInStockCheckbox");
    if (mobileStock) {
      mobileStock.addEventListener("change", () => {
        const dStock = document.getElementById("inStockOnlyCheckbox");
        if (dStock) dStock.checked = mobileStock.checked;
        currentPage = 1;
        applyFilters();
      });
    }

    const mobileSale = document.getElementById("mobileOnSaleCheckbox");
    if (mobileSale) {
      mobileSale.addEventListener("change", () => {
        const dSale = document.getElementById("onSaleOnlyCheckbox");
        if (dSale) dSale.checked = mobileSale.checked;
        currentPage = 1;
        applyFilters();
      });
    }

    const mobilePet = document.getElementById("mobilePetCheckbox");
    if (mobilePet) {
      mobilePet.addEventListener("change", () => {
        const dPet = document.getElementById("petFriendlyCheckbox");
        if (dPet) dPet.checked = mobilePet.checked;
        currentPage = 1;
        applyFilters();
      });
    }
    // Sort Dropdown
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        applyFilters();
      });
    }

    // Grid / List View Switcher
    const gridBtn = document.getElementById("viewGridBtn");
    const listBtn = document.getElementById("viewListBtn");
    if (gridBtn && listBtn) {
      gridBtn.addEventListener("click", () => {
        currentView = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        renderCatalog();
      });
      listBtn.addEventListener("click", () => {
        currentView = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        renderCatalog();
      });
    }

    // Reset / Clear All Filters Button
    const resetBtn = document.getElementById("resetFiltersBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", clearAllFilters);
    }
  }

  function clearAllFilters() {
    // Reset search
    const searchInput = document.getElementById("catalogSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchInputBtn");
    if (searchInput) searchInput.value = "";
    if (clearSearchBtn) clearSearchBtn.style.display = "none";

    // Reset categories
    document.querySelectorAll('input[name="categoryFilter"]').forEach((cb) => (cb.checked = false));
    document.querySelectorAll(".category-pill-btn").forEach((p) => p.classList.remove("active"));
    const allPill = document.querySelector('.category-pill-btn[data-pill-cat="all"]');
    if (allPill) allPill.classList.add("active");

    // Reset price
    const priceSlider = document.getElementById("priceRangeSlider");
    const priceDisplay = document.getElementById("priceRangeValue");
    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");

    if (priceSlider) priceSlider.value = 120;
    if (priceDisplay) priceDisplay.textContent = "$120";
    if (minPriceInput) minPriceInput.value = 0;
    if (maxPriceInput) maxPriceInput.value = 120;

    // Reset rating
    const anyRatingRadio = document.querySelector('input[name="ratingFilter"][value="0"]');
    if (anyRatingRadio) anyRatingRadio.checked = true;

    // Reset checkboxes
    const inStockCb = document.getElementById("inStockOnlyCheckbox");
    const onSaleCb = document.getElementById("onSaleOnlyCheckbox");
    const petCb = document.getElementById("petFriendlyCheckbox");
    const airCb = document.getElementById("airPurifyingCheckbox");
    const lightCb = document.getElementById("lowLightCheckbox");
    const difficultyCb = document.getElementById("beginnerCheckbox");

    if (inStockCb) inStockCb.checked = false;
    if (onSaleCb) onSaleCb.checked = false;
    if (petCb) petCb.checked = false;
    if (airCb) airCb.checked = false;
    if (lightCb) lightCb.checked = false;
    if (difficultyCb) difficultyCb.checked = false;

    // Reset sort
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) sortSelect.value = "featured";

    currentPage = 1;
    applyFilters();
  }

  function updatePillsFromCheckboxes() {
    const checked = Array.from(document.querySelectorAll('input[name="categoryFilter"]:checked')).map((cb) => cb.value);
    document.querySelectorAll(".category-pill-btn").forEach((p) => p.classList.remove("active"));

    if (checked.length === 1) {
      const matchingPill = document.querySelector(`.category-pill-btn[data-pill-cat="${checked[0]}"]`);
      if (matchingPill) matchingPill.classList.add("active");
    } else if (checked.length === 0) {
      const allPill = document.querySelector('.category-pill-btn[data-pill-cat="all"]');
      if (allPill) allPill.classList.add("active");
    }
  }

  function applyFilters() {
    let result = [...allProducts];

    // 1. Search Query
    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput && searchInput.value.trim() !== "") {
      const q = searchInput.value.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const catMatch = p.categoryName.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const tagsMatch = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return nameMatch || catMatch || descMatch || tagsMatch;
      });
    }

    // 2. Category Checkboxes
    const checkedCats = Array.from(document.querySelectorAll('input[name="categoryFilter"]:checked')).map(
      (cb) => cb.value
    );
    if (checkedCats.length > 0) {
      result = result.filter((p) => checkedCats.includes(p.category));
    }

    // 3. Price Filter (Min & Max)
    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");
    const priceSlider = document.getElementById("priceRangeSlider");

    const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
    const maxPrice = maxPriceInput
      ? parseFloat(maxPriceInput.value) || (priceSlider ? parseFloat(priceSlider.value) : 120)
      : priceSlider ? parseFloat(priceSlider.value) : 120;

    result = result.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 4. Rating Filter
    const selectedRatingRadio = document.querySelector('input[name="ratingFilter"]:checked');
    if (selectedRatingRadio) {
      const minRating = parseFloat(selectedRatingRadio.value) || 0;
      if (minRating > 0) {
        result = result.filter((p) => p.rating >= minRating);
      }
    }

    // 5. In Stock Only
    const inStockCb = document.getElementById("inStockOnlyCheckbox");
    if (inStockCb && inStockCb.checked) {
      result = result.filter((p) => p.inStock === true);
    }

    // 6. On Sale Only
    const onSaleCb = document.getElementById("onSaleOnlyCheckbox");
    if (onSaleCb && onSaleCb.checked) {
      result = result.filter((p) => p.oldPrice !== null && p.oldPrice > p.price);
    }

    // 7. Botanical Features
    const petCb = document.getElementById("petFriendlyCheckbox");
    if (petCb && petCb.checked) {
      result = result.filter((p) => p.petFriendly === true);
    }

    const airCb = document.getElementById("airPurifyingCheckbox");
    if (airCb && airCb.checked) {
      result = result.filter((p) => p.airPurifying === true);
    }

    const lightCb = document.getElementById("lowLightCheckbox");
    if (lightCb && lightCb.checked) {
      result = result.filter(
        (p) => p.light && (p.light.toLowerCase().includes("low") || p.light.toLowerCase().includes("indirect"))
      );
    }

    const difficultyCb = document.getElementById("beginnerCheckbox");
    if (difficultyCb && difficultyCb.checked) {
      result = result.filter(
        (p) =>
          p.difficulty &&
          (p.difficulty.toLowerCase().includes("beginner") ||
            p.difficulty.toLowerCase().includes("easy") ||
            p.difficulty.toLowerCase().includes("indestructible"))
      );
    }

    // 8. Sorting
    const sortSelect = document.getElementById("catalogSortSelect");
    if (sortSelect) {
      const sortVal = sortSelect.value;
      if (sortVal === "price-low") {
        result.sort((a, b) => a.price - b.price);
      } else if (sortVal === "price-high") {
        result.sort((a, b) => b.price - a.price);
      } else if (sortVal === "rating") {
        result.sort((a, b) => b.rating - a.rating);
      } else if (sortVal === "popular") {
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
      } else if (sortVal === "newest") {
        result.sort((a, b) => (b.badgeType === "new" ? 1 : 0) - (a.badgeType === "new" ? 1 : 0));
      } else {
        // featured
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
      }
    }

    filteredProducts = result;
    renderActiveFilterChips();
    renderCatalog();
    renderPagination();
  }

  function renderActiveFilterChips() {
    const chipContainer = document.getElementById("activeFilterChips");
    if (!chipContainer) return;

    const chips = [];

    const searchInput = document.getElementById("catalogSearchInput");
    if (searchInput && searchInput.value.trim() !== "") {
      chips.push({
        label: `Search: "${searchInput.value.trim()}"`,
        action: () => {
          searchInput.value = "";
          const clearBtn = document.getElementById("clearSearchInputBtn");
          if (clearBtn) clearBtn.style.display = "none";
          applyFilters();
        }
      });
    }

    document.querySelectorAll('input[name="categoryFilter"]:checked').forEach((cb) => {
      const labelText = cb.parentElement ? cb.parentElement.textContent.trim() : cb.value;
      chips.push({
        label: `Category: ${labelText}`,
        action: () => {
          cb.checked = false;
          updatePillsFromCheckboxes();
          applyFilters();
        }
      });
    });

    const minPriceInput = document.getElementById("minPriceInput");
    const maxPriceInput = document.getElementById("maxPriceInput");
    const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || 0 : 0;
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || 120 : 120;

    if (minPrice > 0 || maxPrice < 120) {
      chips.push({
        label: `Price: $${minPrice} - $${maxPrice}`,
        action: () => {
          if (minPriceInput) minPriceInput.value = 0;
          if (maxPriceInput) maxPriceInput.value = 120;
          const slider = document.getElementById("priceRangeSlider");
          const display = document.getElementById("priceRangeValue");
          if (slider) slider.value = 120;
          if (display) display.textContent = "$120";
          applyFilters();
        }
      });
    }

    const selectedRatingRadio = document.querySelector('input[name="ratingFilter"]:checked');
    if (selectedRatingRadio && parseFloat(selectedRatingRadio.value) > 0) {
      chips.push({
        label: `Rating: ${selectedRatingRadio.value}★+`,
        action: () => {
          const anyRadio = document.querySelector('input[name="ratingFilter"][value="0"]');
          if (anyRadio) anyRadio.checked = true;
          applyFilters();
        }
      });
    }

    const inStockCb = document.getElementById("inStockOnlyCheckbox");
    if (inStockCb && inStockCb.checked) {
      chips.push({
        label: "In Stock Only",
        action: () => {
          inStockCb.checked = false;
          applyFilters();
        }
      });
    }

    const onSaleCb = document.getElementById("onSaleOnlyCheckbox");
    if (onSaleCb && onSaleCb.checked) {
      chips.push({
        label: "On Sale",
        action: () => {
          onSaleCb.checked = false;
          applyFilters();
        }
      });
    }

    const petCb = document.getElementById("petFriendlyCheckbox");
    if (petCb && petCb.checked) {
      chips.push({
        label: "Pet Friendly",
        action: () => {
          petCb.checked = false;
          applyFilters();
        }
      });
    }

    const airCb = document.getElementById("airPurifyingCheckbox");
    if (airCb && airCb.checked) {
      chips.push({
        label: "Air Purifying",
        action: () => {
          airCb.checked = false;
          applyFilters();
        }
      });
    }

    const lightCb = document.getElementById("lowLightCheckbox");
    if (lightCb && lightCb.checked) {
      chips.push({
        label: "Low Light Tolerant",
        action: () => {
          lightCb.checked = false;
          applyFilters();
        }
      });
    }

    const difficultyCb = document.getElementById("beginnerCheckbox");
    if (difficultyCb && difficultyCb.checked) {
      chips.push({
        label: "Beginner Friendly",
        action: () => {
          difficultyCb.checked = false;
          applyFilters();
        }
      });
    }

    if (chips.length === 0) {
      chipContainer.style.display = "none";
      chipContainer.innerHTML = "";
    } else {
      chipContainer.style.display = "flex";
      chipContainer.innerHTML = `
        <span class="small text-muted fw-bold me-1">Active Filters:</span>
        ${chips
          .map(
            (c, idx) => `
          <span class="filter-chip">
            ${c.label}
            <i class="fa-solid fa-xmark filter-chip-remove" data-chip-idx="${idx}" title="Remove filter"></i>
          </span>
        `
          )
          .join("")}
        <button type="button" class="btn btn-link btn-sm text-primary p-0 ms-2 text-decoration-none fw-bold" onclick="document.getElementById('resetFiltersBtn').click()">Clear All</button>
      `;

      chipContainer.querySelectorAll(".filter-chip-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-chip-idx"));
          if (chips[idx] && chips[idx].action) chips[idx].action();
        });
      });
    }
  }

  function renderCatalog() {
    const container = document.getElementById("catalogProductsContainer");
    const countEl = document.getElementById("catalogResultsCount");
    if (!container) return;

    const total = filteredProducts.length;
    const pageSize = showAllItems ? Math.max(total, 1) : itemsPerPage;
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, total);

    if (countEl) {
      if (total === 0) {
        countEl.textContent = "Showing 0 of 0 products";
      } else {
        countEl.textContent = `Showing ${startIdx + 1}–${endIdx} of ${total} products`;
      }
    }

    if (total === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="mb-3 text-muted" style="font-size:3.5rem; opacity:0.3;"><i class="fa-solid fa-seedling"></i></div>
          <h4 class="fw-bold">No Botanical Matches Found</h4>
          <p class="text-muted">No specimens match your selected combination of filters.</p>
          <button class="btn btn-primary btn-sm mt-2" onclick="document.getElementById('resetFiltersBtn').click()">
            <i class="fa-solid fa-arrow-rotate-left me-1"></i> Clear All Filters
          </button>
        </div>
      `;
      return;
    }

    const paginated = filteredProducts.slice(startIdx, startIdx + pageSize);

    container.innerHTML = paginated
      .map((p) => {
        const isWish = window.isInWishlist ? window.isInWishlist(p.id) : false;
        const colClass = currentView === "grid" ? "col-12 col-md-6 col-lg-4 mb-4" : "col-12 mb-4";
        const formattedPrice = window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`;
        const formattedOldPrice = p.oldPrice
          ? window.formatPrice ? window.formatPrice(p.oldPrice) : `$${p.oldPrice.toFixed(2)}`
          : null;

        if (currentView === "list") {
          return `
            <div class="${colClass}">
              <div class="product-card list-view">
                <div class="product-media">
                  <a href="product-details.html?id=${p.id}" class="d-block w-100 h-100">
                    <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
                  </a>
                  ${
                    p.badge
                      ? `<div class="product-badge-group"><span class="badge-botanical badge-${p.badgeType || "new"}">${p.badge}</span></div>`
                      : ""
                  }
                  <div class="product-actions-bar">
                    <button class="action-btn-sm" title="Quick View" onclick="window.openQuickView('${p.id}')">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                    <button class="action-btn-sm ${isWish ? "active" : ""}" data-wishlist-id="${p.id}" title="Wishlist" onclick="window.toggleWishlist('${p.id}')">
                      <i class="${isWish ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
                    </button>
                    <button class="action-btn-sm" title="Compare" onclick="window.addToCompare('${p.id}')">
                      <i class="fa-solid fa-code-compare"></i>
                    </button>
                  </div>
                </div>
                <div class="product-body">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="product-category">${p.categoryName}</span>
                    ${
                      p.inStock
                        ? `<span class="badge bg-success-subtle text-success small"><i class="fa-solid fa-check me-1"></i>In Stock</span>`
                        : `<span class="badge bg-danger-subtle text-danger small">Out of Stock</span>`
                    }
                  </div>
                  <h3 class="product-title mb-2">
                    <a href="product-details.html?id=${p.id}">${p.name}</a>
                  </h3>
                  <div class="product-rating mb-2">
                    ${generateStars(p.rating)}
                    <span class="rating-count">(${p.reviewsCount} reviews)</span>
                  </div>
                  <p class="text-muted small mb-3">${p.description}</p>
                  <div class="product-care-tags mb-3">
                    ${p.light ? `<span class="care-tag"><i class="fa-regular fa-sun"></i> ${p.light}</span>` : ""}
                    ${p.water ? `<span class="care-tag"><i class="fa-solid fa-droplet"></i> ${p.water}</span>` : ""}
                    ${p.petFriendly ? `<span class="care-tag text-success"><i class="fa-solid fa-paw"></i> Pet Safe</span>` : ""}
                  </div>
                  <div class="product-footer pt-3 border-top">
                    <div class="product-price">
                      <span class="current-price fs-5">${formattedPrice}</span>
                      ${formattedOldPrice ? `<span class="old-price">${formattedOldPrice}</span>` : ""}
                    </div>
                    <div class="d-flex gap-2">
                      <a href="product-details.html?id=${p.id}" class="btn btn-outline-primary btn-sm">Details</a>
                      <button class="btn btn-primary btn-sm" onclick="window.addToCart('${p.id}', 1)">
                        <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        return `
          <div class="${colClass}">
            <div class="product-card">
              <div class="product-media">
                <a href="product-details.html?id=${p.id}" class="d-block w-100 h-100">
                  <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
                </a>
                ${
                  p.badge
                    ? `<div class="product-badge-group"><span class="badge-botanical badge-${p.badgeType || "new"}">${p.badge}</span></div>`
                    : ""
                }
                <div class="product-actions-bar">
                  <button class="action-btn-sm" title="Quick View" onclick="window.openQuickView('${p.id}')">
                    <i class="fa-regular fa-eye"></i>
                  </button>
                  <button class="action-btn-sm ${isWish ? "active" : ""}" data-wishlist-id="${p.id}" title="Wishlist" onclick="window.toggleWishlist('${p.id}')">
                    <i class="${isWish ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
                  </button>
                  <button class="action-btn-sm" title="Compare" onclick="window.addToCompare('${p.id}')">
                    <i class="fa-solid fa-code-compare"></i>
                  </button>
                </div>
              </div>
              <div class="product-body">
                <span class="product-category">${p.categoryName}</span>
                <h3 class="product-title">
                  <a href="product-details.html?id=${p.id}">${p.name}</a>
                </h3>
                <div class="product-rating">
                  ${generateStars(p.rating)}
                  <span class="rating-count">(${p.reviewsCount})</span>
                </div>
                <div class="product-care-tags">
                  ${p.light ? `<span class="care-tag"><i class="fa-regular fa-sun"></i> ${p.light}</span>` : ""}
                  ${p.water ? `<span class="care-tag"><i class="fa-solid fa-droplet"></i> ${p.water}</span>` : ""}
                </div>
                <div class="product-footer">
                  <div class="product-price">
                    <span class="current-price">${formattedPrice}</span>
                    ${formattedOldPrice ? `<span class="old-price">${formattedOldPrice}</span>` : ""}
                  </div>
                  <button class="btn-add-cart-quick" title="Add to Cart" onclick="window.addToCart('${p.id}', 1)">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderPagination() {
    const paginationEl = document.getElementById("catalogPagination");
    if (!paginationEl) return;

    const pageSize = showAllItems ? Math.max(filteredProducts.length, 1) : itemsPerPage;
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (totalPages <= 1) {
      paginationEl.innerHTML = "";
      return;
    }

    let html = `
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <button class="page-link" type="button" ${currentPage === 1 ? "disabled" : ""} onclick="window.changeCatalogPage(${currentPage - 1})" aria-label="Previous Page" title="Previous Page">
          <i class="fa-solid fa-arrow-left-long"></i>
        </button>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      html += `
        <li class="page-item ${currentPage === i ? "active" : ""}">
          <button class="page-link" type="button" onclick="window.changeCatalogPage(${i})" aria-label="Page ${i}" title="Page ${i}">
            ${i}
          </button>
        </li>
      `;
    }

    html += `
      <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <button class="page-link" type="button" ${currentPage === totalPages ? "disabled" : ""} onclick="window.changeCatalogPage(${currentPage + 1})" aria-label="Next Page" title="Next Page">
          <i class="fa-solid fa-arrow-right-long"></i>
        </button>
      </li>
    `;

    paginationEl.innerHTML = html;
  }

  window.changeCatalogPage = function (page) {
    const pageSize = showAllItems ? Math.max(filteredProducts.length, 1) : itemsPerPage;
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderCatalog();
    renderPagination();
    const target = document.getElementById("catalogProductsContainer");
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  function generateStars(rating) {
    let stars = "";
    const full = Math.floor(rating);
    for (let i = 0; i < full; i++) stars += '<i class="fa-solid fa-star text-warning"></i>';
    if (rating % 1 !== 0) stars += '<i class="fa-solid fa-star-half-stroke text-warning"></i>';
    const empty = 5 - Math.ceil(rating);
    for (let i = 0; i < empty; i++) stars += '<i class="fa-regular fa-star text-warning"></i>';
    return stars;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("catalogProductsContainer")) {
      initProductsPage();
    }
  });
})();
