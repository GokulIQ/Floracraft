/* ==========================================================================
   FLORACRAFT - CHECKOUT & ORDER CONFIRMATION CONTROLLER
   Multi-step checkout flow, live shipping calculation, simulated payments,
   and dynamic Order Invoice Modal generation saved to LocalStorage
   ========================================================================== */

(function () {
  let selectedShippingRate = 0.00;
  let shippingMethodName = "Standard Ground (3-5 Days)";

  function initCheckoutPage() {
    renderCheckoutSummary();
    setupShippingMethodListeners();
    setupPaymentMethodTabs();
    setupCheckoutForm();
    setupCouponInput();
    prefillUserData();
  }

  function prefillUserData() {
    if (window.getCurrentUser) {
      const user = window.getCurrentUser();
      if (user) {
        const nameInput = document.getElementById("checkoutFullName");
        const emailInput = document.getElementById("checkoutEmail");
        const phoneInput = document.getElementById("checkoutPhone");
        const addressInput = document.getElementById("checkoutAddress");

        if (nameInput) nameInput.value = user.name || "";
        if (emailInput) emailInput.value = user.email || "";
        if (phoneInput) phoneInput.value = user.phone || "";
        if (addressInput) addressInput.value = user.address || "";
      }
    }
  }

  function renderCheckoutSummary() {
    const itemsContainer = document.getElementById("checkoutItemsList");
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const discountRow = document.getElementById("checkoutDiscountRow");
    const discountEl = document.getElementById("checkoutDiscountAmount");
    const shippingEl = document.getElementById("checkoutShippingCost");
    const taxEl = document.getElementById("checkoutTax");
    const grandTotalEl = document.getElementById("checkoutGrandTotal");

    if (!itemsContainer) return;

    const cart = window.getCart();
    const totals = window.getCartTotals();

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="text-center py-4">
          <p class="text-muted">Your cart is empty.</p>
          <a href="products.html" class="btn btn-primary btn-sm">Return to Shop</a>
        </div>
      `;
      return;
    }

    itemsContainer.innerHTML = cart
      .map(
        (item) => `
      <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width:48px; height:48px; border-radius:8px; object-fit:cover;">
          <div>
            <h6 class="mb-0 text-truncate" style="max-width:180px; font-size:0.9rem;">${item.name}</h6>
            <small class="text-muted">Qty: ${item.quantity} ${item.size ? `• ${item.size}` : ""}</small>
          </div>
        </div>
        <div class="fw-bold" style="font-size:0.95rem;">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `
      )
      .join("");

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;

    if (totals.discount > 0) {
      if (discountRow) discountRow.style.display = "flex";
      if (discountEl) discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
    } else {
      if (discountRow) discountRow.style.display = "none";
    }

    // Base shipping or custom selected
    let effectiveShipping = selectedShippingRate;
    if (totals.coupon && totals.coupon.freeShipping) {
      effectiveShipping = 0.00;
    }

    if (shippingEl) shippingEl.textContent = effectiveShipping === 0 ? "FREE" : `$${effectiveShipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${totals.estimatedTax.toFixed(2)}`;

    const finalTotal = Math.max(0, totals.subtotal - totals.discount + effectiveShipping + totals.estimatedTax);
    if (grandTotalEl) grandTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
  }

  function setupShippingMethodListeners() {
    document.querySelectorAll("input[name=\"shippingMethod\"]").forEach((radio) => {
      radio.addEventListener("change", (e) => {
        selectedShippingRate = parseFloat(e.target.value) || 0.00;
        shippingMethodName = e.target.getAttribute("data-method-name") || "Standard Ground";
        renderCheckoutSummary();
      });
    });
  }

  function setupPaymentMethodTabs() {
    document.querySelectorAll(".payment-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".payment-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const targetId = btn.getAttribute("data-target");

        document.querySelectorAll(".payment-method-panel").forEach((panel) => {
          panel.style.display = "none";
        });
        const activePanel = document.getElementById(targetId);
        if (activePanel) activePanel.style.display = "block";
      });
    });
  }

  function setupCouponInput() {
    const couponForm = document.getElementById("checkoutCouponForm");
    if (couponForm) {
      couponForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("checkoutCouponInput");
        if (input && input.value) {
          const res = window.applyCoupon(input.value);
          if (res.success) {
            window.showToast("Coupon Applied", res.message, "success");
            renderCheckoutSummary();
          } else {
            window.showToast("Coupon Error", res.message, "warning");
          }
        }
      });
    }
  }

  function setupCheckoutForm() {
    const form = document.getElementById("mainCheckoutForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const cart = window.getCart();
      if (cart.length === 0) {
        window.showToast("Cannot Place Order", "Your basket is empty.", "warning");
        return;
      }

      // Collect data
      const orderId = "FC-" + Math.floor(100000 + Math.random() * 900000);
      const fullName = document.getElementById("checkoutFullName").value.trim();
      const email = document.getElementById("checkoutEmail").value.trim();
      const phone = document.getElementById("checkoutPhone").value.trim();
      const address = document.getElementById("checkoutAddress").value.trim();
      const city = document.getElementById("checkoutCity").value.trim();
      const zip = document.getElementById("checkoutZip").value.trim();
      const notes = document.getElementById("checkoutNotes") ? document.getElementById("checkoutNotes").value.trim() : "";

      const totals = window.getCartTotals();
      let effectiveShipping = selectedShippingRate;
      if (totals.coupon && totals.coupon.freeShipping) effectiveShipping = 0.00;
      const finalAmount = Math.max(0, totals.subtotal - totals.discount + effectiveShipping + totals.estimatedTax);

      const orderRecord = {
        orderId,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        items: [...cart],
        totals: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: effectiveShipping,
          tax: totals.estimatedTax,
          total: finalAmount
        },
        shippingMethod: shippingMethodName,
        customer: {
          fullName,
          email,
          phone,
          address: `${address}, ${city}, ${zip}`,
          notes
        },
        status: "Confirmed & Packing"
      };

      // Save to localStorage orders array
      const existingOrders = JSON.parse(localStorage.getItem("floracraft_orders") || "[]");
      existingOrders.unshift(orderRecord);
      localStorage.setItem("floracraft_orders", JSON.stringify(existingOrders));

      // Clear current cart
      window.clearCart();

      // Show confirmation modal
      showOrderSuccessModal(orderRecord);
    });
  }

  function showOrderSuccessModal(order) {
    const modalEl = document.getElementById("orderSuccessModal");
    if (!modalEl) {
      window.location.href = "index.html";
      return;
    }

    const idEl = modalEl.querySelector(".modal-order-id");
    const nameEl = modalEl.querySelector(".modal-cust-name");
    const emailEl = modalEl.querySelector(".modal-cust-email");
    const totalEl = modalEl.querySelector(".modal-order-total");
    const itemsEl = modalEl.querySelector(".modal-order-items");
    const printBtn = modalEl.querySelector(".modal-print-invoice-btn");

    if (idEl) idEl.textContent = order.orderId;
    if (nameEl) nameEl.textContent = order.customer.fullName;
    if (emailEl) emailEl.textContent = order.customer.email;
    if (totalEl) totalEl.textContent = `$${order.totals.total.toFixed(2)}`;

    if (itemsEl) {
      itemsEl.innerHTML = order.items
        .map(
          (i) => `
        <div class="d-flex justify-content-between small py-1 border-bottom">
          <span>${i.name} × ${i.quantity}</span>
          <span class="fw-bold">$${(i.price * i.quantity).toFixed(2)}</span>
        </div>
      `
        )
        .join("");
    }

    if (printBtn) {
      printBtn.onclick = function () {
        window.print();
      };
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("mainCheckoutForm")) {
      initCheckoutPage();
    }
  });
})();
