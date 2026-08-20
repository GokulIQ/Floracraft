/* ==========================================================================
   FLORACRAFT - PRODUCT SINGLE DETAILS CONTROLLER
   Dynamic Product Loading by ID (?id=1 or ?id=prod-1), Gallery Switcher,
   Quantity Stepper, Add-to-Cart, Wishlist Toggle, Reviews & Related Products.
   ========================================================================== */

(function () {
  let activeProduct = null;
  let selectedPotSize = "Standard (8-inch)";

  function initProductDetailsPage() {
    if (!window.FLORACRAFT_DATA || !window.FLORACRAFT_DATA.products) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id") || "prod-1";

    activeProduct = window.getProductById ? window.getProductById(productId) : null;
    if (!activeProduct) {
      activeProduct = window.FLORACRAFT_DATA.products.find((p) => p.id === productId);
    }
    if (!activeProduct) {
      activeProduct = window.FLORACRAFT_DATA.products[0];
    }

    renderProductInfo(activeProduct);
    renderRelatedProducts(activeProduct);
    setupQuantityStepper();
    setupReviewForm();
  }

  function renderProductInfo(p) {
    document.title = `${p.name} - FloraCraft Botanical Store`;

    // Breadcrumbs
    const bcCat = document.getElementById("pdpBreadcrumbCategory");
    const bcName = document.getElementById("pdpBreadcrumbTitle");
    if (bcCat) {
      bcCat.textContent = p.categoryName;
      bcCat.href = `products.html?category=${p.category}`;
    }
    if (bcName) bcName.textContent = p.name;
    if (window.recordProductView) window.recordProductView(p.id);

    // Gallery Main Image & Thumbnails
    const mainImg = document.getElementById("pdpMainImage");
    const thumbsContainer = document.getElementById("pdpThumbsContainer");
    if (mainImg) {
      mainImg.src = p.images[0];
      mainImg.alt = p.name;
    }

    if (thumbsContainer) {
      thumbsContainer.innerHTML = p.images
        .map(
          (img, idx) => `
        <div class="thumb-item ${idx === 0 ? "active" : ""}" onclick="document.getElementById('pdpMainImage').src='${img}'; document.querySelectorAll('#pdpThumbsContainer .thumb-item').forEach(el=>el.classList.remove('active')); this.classList.add('active');">
          <img src="${img}" alt="${p.name} angle ${idx + 1}" loading="lazy">
        </div>
      `
        )
        .join("");
    }

    // Info Fields
    const titleEl = document.getElementById("pdpTitle");
    const skuEl = document.getElementById("pdpSku");
    const ratingCountEl = document.getElementById("pdpRatingCount");
    const starsEl = document.getElementById("pdpStars");
    const priceEl = document.getElementById("pdpPriceContainer");
    const descEl = document.getElementById("pdpShortDescription");
    const stockEl = document.getElementById("pdpStockBadge");

    if (titleEl) titleEl.textContent = p.name;
    if (skuEl) skuEl.textContent = p.sku || `FC-SKU-${p.id.replace('prod-', '')}`;
    if (ratingCountEl) ratingCountEl.textContent = `(${p.reviewsCount} verified customer reviews)`;
    if (starsEl) starsEl.innerHTML = generateStars(p.rating);
    if (descEl) descEl.textContent = p.description;

    const formattedPrice = window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`;
    const formattedOldPrice = p.oldPrice
      ? window.formatPrice ? window.formatPrice(p.oldPrice) : `$${p.oldPrice.toFixed(2)}`
      : null;

    if (priceEl) {
      priceEl.innerHTML = `
        <span class="current-price" style="font-size:1.95rem; font-weight:800; color:var(--primary);">${formattedPrice}</span>
        ${formattedOldPrice ? `<span class="old-price text-muted text-decoration-line-through ms-2" style="font-size:1.2rem;">${formattedOldPrice}</span>` : ""}
        ${p.discount ? `<span class="badge bg-danger-subtle text-danger ms-2 font-monospace fw-bold">${p.discount}</span>` : ""}
      `;
    }

    if (stockEl) {
      stockEl.innerHTML = p.inStock
        ? `<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-solid fa-circle-check me-1"></i> In Stock (${p.stockQty || 20} units ready in nursery)</span>`
        : `<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="fa-solid fa-circle-xmark me-1"></i> Currently Out of Stock</span>`;
    }

    // Care Specs Grid
    const careGrid = document.getElementById("pdpCareSpecsGrid");
    if (careGrid) {
      careGrid.innerHTML = `
        <div class="care-spec-box">
          <div class="care-spec-icon"><i class="fa-regular fa-sun"></i></div>
          <div class="care-spec-label">Sunlight</div>
          <div class="care-spec-val">${p.light || "Bright Indirect"}</div>
        </div>
        <div class="care-spec-box">
          <div class="care-spec-icon"><i class="fa-solid fa-droplet"></i></div>
          <div class="care-spec-label">Watering</div>
          <div class="care-spec-val">${p.water || "Once a Week"}</div>
        </div>
        <div class="care-spec-box">
          <div class="care-spec-icon"><i class="fa-solid fa-paw"></i></div>
          <div class="care-spec-label">Pet Friendly</div>
          <div class="care-spec-val">${p.petFriendly ? "Yes (100% Safe)" : "Keep Away (Toxic)"}</div>
        </div>
        <div class="care-spec-box">
          <div class="care-spec-icon"><i class="fa-solid fa-shield-heart"></i></div>
          <div class="care-spec-label">Care Level</div>
          <div class="care-spec-val">${p.difficulty || "Beginner Friendly"}</div>
        </div>
      `;
    }

    // Tab Contents
    const longDesc = document.getElementById("tabLongDescription");
    const careGuideTab = document.getElementById("tabCareGuide");
    if (longDesc) {
      longDesc.innerHTML = `
        <p class="lead text-muted">${p.description}</p>
        <p>Carefully cultivated in our eco-sustainable nursery using bio-active organic soil conditioners. Each plant is inspected by certified horticulturists before packaging to ensure vigorous foliage, well-established root systems, and zero transport shock.</p>
        <h5 class="fw-bold mt-4 mb-3">Specimen Highlights</h5>
        <ul>
          <li><strong>Organic Soil Blend:</strong> Potted in aerated coco-coir, chunky pine bark, and pure worm castings.</li>
          <li><strong>Zero Synthetic Pesticides:</strong> Naturally protected with cold-pressed organic neem sprays and biological controls.</li>
          <li><strong>Guarantee:</strong> Backed by our 30-Day Healthy Plant Arrival Guarantee.</li>
        </ul>
      `;
    }

    if (careGuideTab) {
      careGuideTab.innerHTML = `
        <div class="card p-4 border-0 bg-surface-alt rounded-4">
          <h5 class="fw-bold mb-3"><i class="fa-solid fa-seedling text-primary me-2"></i>Official Botanist Care Guide</h5>
          <p class="mb-3">${p.careGuide || "Place in bright indirect light, water deeply when the top 2 inches of soil feel dry, and mist weekly for optimal foliage humidity."}</p>
          <div class="row g-3">
            <div class="col-md-4">
              <div class="p-3 bg-surface rounded-3 border">
                <div class="fw-bold small text-primary"><i class="fa-regular fa-sun me-1"></i> Light Needs</div>
                <div class="small text-muted">${p.light || "Bright Indirect Light"}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-surface rounded-3 border">
                <div class="fw-bold small text-primary"><i class="fa-solid fa-droplet me-1"></i> Hydration</div>
                <div class="small text-muted">${p.water || "Every 7-10 Days"}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="p-3 bg-surface rounded-3 border">
                <div class="fw-bold small text-primary"><i class="fa-solid fa-paw me-1"></i> Pet Safety</div>
                <div class="small text-muted">${p.petFriendly ? "100% Non-Toxic" : "Keep out of pets' reach"}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Size Pills setup
    document.querySelectorAll(".pot-size-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".pot-size-pill").forEach((el) => el.classList.remove("active"));
        pill.classList.add("active");
        selectedPotSize = pill.getAttribute("data-size");
      });
    });

    // Add to cart click
    const addBtn = document.getElementById("pdpAddToCartBtn");
    const qtyInput = document.getElementById("pdpQuantityInput");
    if (addBtn) {
      addBtn.onclick = function () {
        const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
        if (window.addToCart) {
          window.addToCart(p.id, qty, { size: selectedPotSize });
        }
      };
    }

    // Wishlist Toggle PDP
    const wishBtn = document.getElementById("pdpWishlistBtn");
    if (wishBtn) {
      const isWish = window.isInWishlist ? window.isInWishlist(p.id) : false;
      const icon = wishBtn.querySelector("i");
      if (isWish) {
        wishBtn.classList.add("active");
        wishBtn.setAttribute("aria-pressed", "true");
        if (icon) icon.className = "fa-solid fa-heart fs-5";
      } else {
        wishBtn.classList.remove("active");
        wishBtn.setAttribute("aria-pressed", "false");
        if (icon) icon.className = "fa-regular fa-heart fs-5";
      }

      wishBtn.onclick = function () {
        if (window.toggleWishlist) {
          window.toggleWishlist(p.id);
          const nowWish = window.isInWishlist ? window.isInWishlist(p.id) : false;
          if (nowWish) {
            wishBtn.classList.add("active");
            wishBtn.setAttribute("aria-pressed", "true");
            if (icon) icon.className = "fa-solid fa-heart fs-5";
          } else {
            wishBtn.classList.remove("active");
            wishBtn.setAttribute("aria-pressed", "false");
            if (icon) icon.className = "fa-regular fa-heart fs-5";
          }
        }
      };
    }
  }

  function setupQuantityStepper() {
    const qtyInput = document.getElementById("pdpQuantityInput");
    const decBtn = document.getElementById("pdpQtyDec");
    const incBtn = document.getElementById("pdpQtyInc");

    if (decBtn && qtyInput) {
      decBtn.onclick = function () {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
        }
      };
    }

    if (incBtn && qtyInput) {
      incBtn.onclick = function () {
        let val = parseInt(qtyInput.value) || 1;
        qtyInput.value = val + 1;
      };
    }

    if (qtyInput) {
      qtyInput.onchange = function () {
        let val = parseInt(qtyInput.value) || 1;
        qtyInput.value = Math.max(1, val);
      };
    }
  }

  function renderRelatedProducts(current) {
    const container = document.getElementById("pdpRelatedContainer");
    if (!container) return;

    let related = window.FLORACRAFT_DATA.products
      .filter((p) => p.id !== current.id && p.category === current.category)
      .slice(0, 4);

    // Fallback if fewer than 4 in exact category
    if (related.length < 4) {
      const extra = window.FLORACRAFT_DATA.products
        .filter((p) => p.id !== current.id && !related.some((r) => r.id === p.id))
        .slice(0, 4 - related.length);
      related = [...related, ...extra];
    }

    container.innerHTML = related
      .map((p) => {
        const isWish = window.isInWishlist ? window.isInWishlist(p.id) : false;
        const formattedPrice = window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`;

        return `
        <div class="col-12 col-sm-6 col-lg-3 mb-4">
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
              <div class="product-footer">
                <div class="product-price">
                  <span class="current-price">${formattedPrice}</span>
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

  function setupReviewForm() {
    const form = document.getElementById("pdpReviewForm");
    const reviewsList = document.getElementById("pdpReviewsList");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const authorInput = document.getElementById("reviewAuthorInput");
        const ratingSelect = document.getElementById("reviewRatingSelect");
        const textInput = document.getElementById("reviewTextInput");

        const author = authorInput ? authorInput.value.trim() : "";
        const rating = ratingSelect ? ratingSelect.value : "5";
        const text = textInput ? textInput.value.trim() : "";

        if (!author || !text) {
          if (window.showToast) {
            window.showToast("Missing Information", "Please enter your name and review comments.", "warning");
          }
          return;
        }

        const newReviewHtml = `
          <div class="border-bottom pb-4 mb-4">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:42px; height:42px;">
                  ${author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 class="mb-0 fw-bold">${author} <span class="badge bg-success-subtle text-success ms-2 small">Verified Plant Parent</span></h6>
                  <small class="text-muted">Just now</small>
                </div>
              </div>
              <div>${generateStars(parseFloat(rating))}</div>
            </div>
            <p class="mb-0 text-muted">${text}</p>
          </div>
        `;

        if (reviewsList) {
          reviewsList.insertAdjacentHTML("afterbegin", newReviewHtml);
        }

        if (window.showToast) {
          window.showToast("Review Submitted!", "Thank you for sharing your plant care review with our community.", "success");
        }
        form.reset();
      });
    }
  }

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
    if (document.getElementById("pdpMainImage")) {
      initProductDetailsPage();
    }
  });
})();
