/* ==========================================================================
   FLORACRAFT - CART STATE & LOCALSTORAGE CONTROLLER
   Full Cart operations, Drawer Sync, Quantity Steppers & Coupon Calculations
   ========================================================================== */

(function () {
  const CART_KEY = "floracraft_cart";
  const APPLIED_COUPON_KEY = "floracraft_coupon";
  const FREE_SHIPPING_THRESHOLD = 75.00;

  // Read cart from localStorage
  window.getCart = function () {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadges();
    window.renderCartDrawer();
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("floracraft_cart_updated", { detail: { cart } }));
  }

  // Add Item to Cart
  window.addToCart = function (productId, quantity = 1, options = {}) {
    if (!window.FLORACRAFT_DATA) return;
    const product = (window.getProductById ? window.getProductById(productId) : null) || window.FLORACRAFT_DATA.products.find((p) => p.id === productId);
    if (!product) return;

    const cart = window.getCart();
    const existingIndex = cart.findIndex((item) => item.id === productId && (!options.size || item.size === options.size));

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.categoryName,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        size: options.size || "Standard",
        sku: product.sku
      });
    }

    saveCart(cart);
    if (window.showToast) {
      window.showToast("Added to Cart!", `${quantity} × ${product.name} added to your basket.`, "success");
    }
    window.openCartDrawer();
  };

  // Remove Item from Cart
  window.removeFromCart = function (productId) {
    let cart = window.getCart();
    const item = cart.find((i) => i.id === productId);
    cart = cart.filter((i) => i.id !== productId);
    saveCart(cart);
    if (window.showToast && item) {
      window.showToast("Removed Item", `${item.name} removed from your cart.`, "info");
    }
  };

  // Update Item Quantity
  window.updateCartQuantity = function (productId, newQty) {
    const cart = window.getCart();
    const item = cart.find((i) => i.id === productId);
    if (item) {
      if (newQty <= 0) {
        window.removeFromCart(productId);
      } else {
        item.quantity = newQty;
        saveCart(cart);
      }
    }
  };

  // Clear entire cart
  window.clearCart = function () {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(APPLIED_COUPON_KEY);
    updateCartBadges();
    window.renderCartDrawer();
    window.dispatchEvent(new CustomEvent("floracraft_cart_updated", { detail: { cart: [] } }));
  };

  // Get active coupon
  window.getAppliedCoupon = function () {
    const raw = localStorage.getItem(APPLIED_COUPON_KEY);
    return raw ? JSON.parse(raw) : null;
  };

  // Apply coupon code
  window.applyCoupon = function (code) {
    if (!window.FLORACRAFT_DATA || !window.FLORACRAFT_DATA.coupons) {
      return { success: false, message: "Coupon engine unavailable." };
    }
    const cleanCode = code.trim().toUpperCase();
    const coupon = window.FLORACRAFT_DATA.coupons[cleanCode];

    if (coupon) {
      const couponObj = { code: cleanCode, ...coupon };
      localStorage.setItem(APPLIED_COUPON_KEY, JSON.stringify(couponObj));
      window.dispatchEvent(new CustomEvent("floracraft_cart_updated", { detail: { cart: window.getCart() } }));
      return { success: true, message: `Coupon "${cleanCode}" applied! ${coupon.description}` };
    }
    return { success: false, message: "Invalid promo code. Try GROW20 or SPRING10!" };
  };

  // Remove coupon
  window.removeCoupon = function () {
    localStorage.removeItem(APPLIED_COUPON_KEY);
    window.dispatchEvent(new CustomEvent("floracraft_cart_updated", { detail: { cart: window.getCart() } }));
  };

  // Calculate totals breakdown
  window.getCartTotals = function () {
    const cart = window.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const coupon = window.getAppliedCoupon();

    let discount = 0;
    if (coupon && coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100;
    }

    let shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? 7.99 : 0.00;
    if (coupon && coupon.freeShipping) {
      shipping = 0.00;
    }

    const estimatedTax = (subtotal - discount) > 0 ? (subtotal - discount) * 0.05 : 0; // 5% est tax
    const total = Math.max(0, subtotal - discount + shipping + estimatedTax);
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    return {
      subtotal,
      discount,
      shipping,
      estimatedTax,
      total,
      coupon,
      amountToFreeShipping,
      freeShippingProgress,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
  };

  // Update badge count across headers & mobile nav
  function updateCartBadges() {
    const cart = window.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelectorAll(".cart-count-badge").forEach((badge) => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    });
  }

  // Render Mini-Cart Drawer
  window.renderCartDrawer = function () {
    const container = document.getElementById("cartDrawerItems");
    const subtotalEl = document.getElementById("cartDrawerSubtotal");
    const shippingProgressEl = document.getElementById("freeShippingProgress");
    const shippingTextEl = document.getElementById("freeShippingText");
    const drawerFooter = document.getElementById("cartDrawerFooter");

    if (!container) return;

    const cart = window.getCart();
    const totals = window.getCartTotals();

    if (subtotalEl) subtotalEl.textContent = window.formatPrice ? window.formatPrice(totals.subtotal) : `$${totals.subtotal.toFixed(2)}`;

    if (shippingProgressEl) {
      shippingProgressEl.style.width = `${totals.freeShippingProgress}%`;
    }

    if (shippingTextEl) {
      if (totals.amountToFreeShipping === 0 && totals.subtotal > 0) {
        shippingTextEl.innerHTML = `<i class="fa-solid fa-truck-fast text-success me-1"></i> You've unlocked <strong>FREE Standard Shipping</strong>!`;
      } else {
        const amtStr = window.formatPrice ? window.formatPrice(totals.amountToFreeShipping) : `$${totals.amountToFreeShipping.toFixed(2)}`;
        shippingTextEl.innerHTML = `Add <strong>${amtStr}</strong> more to get <strong>FREE Shipping</strong>!`;
      }
    }

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <div class="mb-3 text-muted" style="font-size:3.5rem; opacity:0.3;"><i class="fa-solid fa-basket-shopping"></i></div>
          <h5 class="fw-bold">Your basket is empty</h5>
          <p class="text-muted small">Explore our lush botanical collection and add some green to your space!</p>
          <a href="products.html" class="btn btn-primary btn-sm mt-2" onclick="window.closeCartDrawer()">Start Shopping</a>
        </div>
      `;
      if (drawerFooter) drawerFooter.style.display = "none";
    } else {
      if (drawerFooter) drawerFooter.style.display = "block";
      container.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-drawer-item">
          <div class="cart-item-thumb">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${window.formatPrice ? window.formatPrice(item.price) : `$${item.price.toFixed(2)}`}</div>
            <div class="cart-qty-stepper">
              <button class="qty-btn" onclick="window.updateCartQuantity('${item.id}', ${item.quantity - 1})"><i class="fa-solid fa-minus"></i></button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.updateCartQuantity('${item.id}', ${item.quantity + 1})"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.removeFromCart('${item.id}')" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      `
        )
        .join("");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateCartBadges();
    window.renderCartDrawer();
  });
})();
