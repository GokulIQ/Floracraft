/* ==========================================================================
   FLORACRAFT - WISHLIST STATE & LOCALSTORAGE CONTROLLER
   Toggle favorites, sync badge counters, and move items to cart
   ========================================================================== */

(function () {
  const WISHLIST_KEY = "floracraft_wishlist";

  window.getWishlist = function () {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  function saveWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    updateWishlistBadges();
    updateWishlistButtons();
    window.dispatchEvent(new CustomEvent("floracraft_wishlist_updated", { detail: { wishlist: list } }));
  }

  window.isInWishlist = function (productId) {
    const list = window.getWishlist();
    return list.includes(productId);
  };

  window.toggleWishlist = function (productId) {
    if (!window.FLORACRAFT_DATA) return;
    const product = (window.getProductById ? window.getProductById(productId) : null) || window.FLORACRAFT_DATA.products.find((p) => p.id === productId);
    if (!product) return;

    let list = window.getWishlist();
    if (list.includes(productId)) {
      list = list.filter((id) => id !== productId);
      saveWishlist(list);
      if (window.showToast) {
        window.showToast("Wishlist Updated", `${product.name} removed from your favorites.`, "info");
      }
    } else {
      list.push(productId);
      saveWishlist(list);
      if (window.showToast) {
        window.showToast("Saved to Wishlist!", `${product.name} added to your favorites.`, "success");
      }
    }
  };

  window.removeFromWishlist = function (productId) {
    let list = window.getWishlist();
    list = list.filter((id) => id !== productId);
    saveWishlist(list);
  };

  window.moveWishlistItemToCart = function (productId) {
    if (window.addToCart) {
      window.addToCart(productId, 1);
      window.removeFromWishlist(productId);
    }
  };

  window.moveAllWishlistToCart = function () {
    const list = window.getWishlist();
    if (list.length === 0) return;

    list.forEach((id) => {
      if (window.addToCart) window.addToCart(id, 1);
    });
    localStorage.removeItem(WISHLIST_KEY);
    saveWishlist([]);
    if (window.showToast) {
      window.showToast("All Moved!", "All wishlist items added to your shopping cart.", "success");
    }
  };

  function updateWishlistBadges() {
    const list = window.getWishlist();
    document.querySelectorAll(".wishlist-count-badge").forEach((badge) => {
      badge.textContent = list.length;
      badge.style.display = list.length > 0 ? "flex" : "none";
    });
  }

  function updateWishlistButtons() {
    const list = window.getWishlist();
    document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
      const id = btn.getAttribute("data-wishlist-id");
      const icon = btn.querySelector("i");
      if (list.includes(id)) {
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");
        if (icon) icon.className = "fa-solid fa-heart";
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
        if (icon) icon.className = "fa-regular fa-heart";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateWishlistBadges();
    updateWishlistButtons();
  });
})();
