/* ==========================================================================
   FLORACRAFT - CORE UI & INTERACTION CONTROLLER
   Toast Engine, Mini-Cart Drawer, QuickView Modal, Sticky Nav, etc.
   ========================================================================== */

// Global Toast Notification Engine
window.showToast = function (title, message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `custom-toast toast-${type}`;

  let iconClass = "fa-solid fa-circle-check";
  if (type === "danger" || type === "error") iconClass = "fa-solid fa-circle-xmark";
  if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";
  if (type === "info") iconClass = "fa-solid fa-circle-info";

  toast.innerHTML = `
    <div class="toast-icon"><i class="${iconClass}"></i></div>
    <div class="toast-body-text">
      <div class="toast-title">${title}</div>
      <p class="toast-message">${message}</p>
    </div>
    <button type="button" class="btn-close btn-close-sm" style="font-size:0.7rem; opacity:0.6;" aria-label="Close"></button>
  `;

  const closeBtn = toast.querySelector(".btn-close");
  closeBtn.addEventListener("click", () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 250);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 250);
    }
  }, 4000);
};

// Mini-Cart Drawer Operations
window.openCartDrawer = function () {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer && overlay) {
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.renderCartDrawer) window.renderCartDrawer();
  }
};

window.closeCartDrawer = function () {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartDrawerOverlay");
  if (drawer && overlay) {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
};

// Universal Modal Closer & Cleanup Helper
window.closeModal = function (target) {
  let modalEl = null;
  if (typeof target === "string") {
    modalEl = document.getElementById(target);
  } else if (target && target.closest) {
    modalEl = target.closest(".modal");
  } else if (target instanceof HTMLElement && target.classList.contains("modal")) {
    modalEl = target;
  }

  if (!modalEl) {
    modalEl = document.querySelector(".modal.show");
  }

  if (modalEl) {
    if (window.bootstrap && bootstrap.Modal) {
      const instance = bootstrap.Modal.getInstance(modalEl) || bootstrap.Modal.getOrCreateInstance(modalEl);
      if (instance) {
        try {
          instance.hide();
        } catch (err) {}
      }
    }
    modalEl.classList.remove("show");
    modalEl.style.display = "none";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.removeAttribute("aria-modal");
  }

  // Restore scroll and purge any leftover backdrops
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
};

// QuickView Modal Functionality
window.openQuickView = function (productId) {
  if (!window.FLORACRAFT_DATA) return;
  const product = window.FLORACRAFT_DATA.products.find((p) => p.id === productId);
  if (!product) return;

  const modalEl = document.getElementById("quickViewModal");
  if (!modalEl) return;

  const titleEl = modalEl.querySelector(".qv-title");
  const catEl = modalEl.querySelector(".qv-category");
  const priceEl = modalEl.querySelector(".qv-price");
  const descEl = modalEl.querySelector(".qv-desc");
  const imgEl = modalEl.querySelector(".qv-main-img");
  const thumbsContainer = modalEl.querySelector(".qv-thumbs");
  const addBtn = modalEl.querySelector(".qv-add-btn");
  const detailsLink = modalEl.querySelector(".qv-details-link");
  const qtyInput = modalEl.querySelector(".qv-qty-input");

  if (titleEl) titleEl.textContent = product.name;
  if (catEl) catEl.textContent = product.categoryName;
  if (priceEl) {
    priceEl.innerHTML = `
      <span class="current-price">${window.formatPrice ? window.formatPrice(product.price) : `$${product.price.toFixed(2)}`}</span>
      ${product.oldPrice ? `<span class="old-price">${window.formatPrice ? window.formatPrice(product.oldPrice) : `$${product.oldPrice.toFixed(2)}`}</span>` : ""}
    `;
  }
  if (descEl) descEl.textContent = product.description;
  if (imgEl) imgEl.src = product.images[0];
  if (detailsLink) detailsLink.href = `product-details.html?id=${product.id}`;
  if (qtyInput) qtyInput.value = 1;

  if (thumbsContainer) {
    thumbsContainer.innerHTML = product.images
      .map(
        (img, idx) => `
      <div class="thumb-item ${idx === 0 ? "active" : ""}" onclick="document.querySelector('.qv-main-img').src='${img}'; document.querySelectorAll('.qv-thumbs .thumb-item').forEach(el=>el.classList.remove('active')); this.classList.add('active');">
        <img src="${img}" alt="Thumbnail ${idx + 1}">
      </div>
    `
      )
      .join("");
  }

  if (addBtn) {
    addBtn.onclick = function () {
      const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
      if (window.addToCart) {
        window.addToCart(product.id, qty);
        window.closeModal(modalEl);
      }
    };
  }

  // Use getOrCreateInstance to prevent corrupted duplicate instances
  if (window.bootstrap && bootstrap.Modal) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl, {
      backdrop: true,
      keyboard: true,
      focus: true
    });
    modal.show();
  } else {
    modalEl.classList.add("show");
    modalEl.style.display = "block";
    modalEl.setAttribute("aria-modal", "true");
    modalEl.removeAttribute("aria-hidden");
    document.body.classList.add("modal-open");
  }
};

// Global Listeners for Modal Dismiss Buttons & Backdrops
document.addEventListener("click", function (e) {
  const dismissBtn = e.target.closest('[data-bs-dismiss="modal"], .btn-close, .modal-close-btn, .btn-modal-cancel');
  if (dismissBtn) {
    e.preventDefault();
    e.stopPropagation();
    window.closeModal(dismissBtn);
    return;
  }

  // Backdrop click on modal overlay background
  if (e.target.classList && e.target.classList.contains("modal") && e.target.classList.contains("show")) {
    window.closeModal(e.target);
  }
});

// ESC Key closes any active modal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.keyCode === 27) {
    const openModal = document.querySelector(".modal.show, .modal[style*='display: block']");
    if (openModal) {
      window.closeModal(openModal);
    }
  }
});

// Global Sticky Navbar & Back-to-Top Setup
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      if (header) header.classList.add("scrolled");
      if (backToTopBtn) backToTopBtn.classList.add("show");
    } else {
      if (header) header.classList.remove("scrolled");
      if (backToTopBtn) backToTopBtn.classList.remove("show");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Cart Drawer Close Listeners
  const closeCartBtn = document.getElementById("closeCartDrawerBtn");
  const cartOverlay = document.getElementById("cartDrawerOverlay");
  if (closeCartBtn) closeCartBtn.addEventListener("click", window.closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener("click", window.closeCartDrawer);

  // Cart trigger buttons
  document.querySelectorAll(".cart-drawer-trigger").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.openCartDrawer();
    });
  });

  // Global Newsletter subscription forms
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        window.showToast("Welcome to FloraCraft Club!", `Thank you for subscribing! A 15% discount code has been sent to ${input.value}.`, "success");
        input.value = "";
      }
    });
  });

  // Active page highlight in mobile nav
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Home Bestseller Tab Switcher
  const homeTabs = document.getElementById("homeBestsellerTabs");
  const homeContainer = document.getElementById("homeBestsellersContainer");
  if (homeTabs && homeContainer && window.FLORACRAFT_DATA) {
    const renderHomeBestsellers = (cat) => {
      let prods = window.FLORACRAFT_DATA.products;
      if (cat !== "all") {
        prods = prods.filter((p) => p.category === cat);
      }
      const display = prods.slice(0, 4);
      homeContainer.innerHTML = display.map((p) => {
        const isWish = window.isInWishlist ? window.isInWishlist(p.id) : false;
        return `
          <div class="col-12 col-sm-6 col-lg-3">
            <div class="product-card">
              <div class="product-media">
                <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
                ${p.badge ? `<div class="product-badge-group"><span class="badge-botanical badge-${p.badgeType || "bestseller"}">${p.badge}</span></div>` : ""}
                <div class="product-actions-bar">
                  <button class="action-btn-sm" title="Quick View" onclick="window.openQuickView('${p.id}')"><i class="fa-regular fa-eye"></i></button>
                  <button class="action-btn-sm ${isWish ? "active" : ""}" data-wishlist-id="${p.id}" title="Wishlist" onclick="window.toggleWishlist('${p.id}')">
                    <i class="${isWish ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
                  </button>
                  <button class="action-btn-sm" title="Compare" onclick="window.addToCompare('${p.id}')"><i class="fa-solid fa-code-compare"></i></button>
                </div>
              </div>
              <div class="product-body">
                <span class="product-category">${p.categoryName}</span>
                <h3 class="product-title"><a href="product-details.html?id=${p.id}">${p.name}</a></h3>
                <div class="product-rating">
                  <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
                  <span class="rating-count">(${p.reviewsCount})</span>
                </div>
                <div class="product-care-tags">
                  ${p.light ? `<span class="care-tag"><i class="fa-regular fa-sun"></i> ${p.light}</span>` : ""}
                  ${p.water ? `<span class="care-tag"><i class="fa-solid fa-droplet"></i> ${p.water}</span>` : ""}
                </div>
                <div class="product-footer">
                  <div class="product-price">
                    <span class="current-price">${window.formatPrice ? window.formatPrice(p.price) : `$${p.price.toFixed(2)}`}</span>
                    ${p.oldPrice ? `<span class="old-price">${window.formatPrice ? window.formatPrice(p.oldPrice) : `$${p.oldPrice.toFixed(2)}`}</span>` : ""}
                  </div>
                  <button class="btn-add-cart-quick" title="Add to Cart" onclick="window.addToCart('${p.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join("");
    };

    homeTabs.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        homeTabs.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-home-cat");
        renderHomeBestsellers(cat);
      });
    });
  }
});
