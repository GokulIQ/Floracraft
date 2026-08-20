/* ==========================================================================
   FLORACRAFT - BULK & B2B ORDERS PRICING CALCULATOR
   Interactive tiered discounting, instant cost estimation, and RFQ form
   ========================================================================== */

(function () {
  const CATEGORY_RATES = {
    "indoor-plants": { name: "Indoor Tropical Plants", basePrice: 32.00 },
    "outdoor-plants": { name: "Hardy Outdoor Perennials & Shrubs", basePrice: 20.00 },
    "flower-pots": { name: "Handcrafted Terracotta & Ceramic Pots", basePrice: 22.00 },
    "soil-fertilizers": { name: "Organic Bio-Active Soils & Amendments (Bags)", basePrice: 14.00 },
    "gardening-tools": { name: "Commercial Horticultural Tool Sets", basePrice: 30.00 }
  };

  function calculateTierDiscount(qty) {
    if (qty >= 200) return { percent: 35, tier: "Enterprise Tier (35% OFF)" };
    if (qty >= 51) return { percent: 20, tier: "Commercial Tier (20% OFF)" };
    if (qty >= 10) return { percent: 10, tier: "Volume Starter (10% OFF)" };
    return { percent: 0, tier: "Standard Unit Rate (0% OFF)" };
  }

  function updateCalculator() {
    const catSelect = document.getElementById("bulkCategorySelect");
    const qtyInput = document.getElementById("bulkQtyInput");
    const qtySlider = document.getElementById("bulkQtySlider");

    if (!catSelect || !qtyInput) return;

    const catKey = catSelect.value;
    const itemData = CATEGORY_RATES[catKey] || CATEGORY_RATES["indoor-plants"];
    const qty = parseInt(qtyInput.value) || 10;

    const tierInfo = calculateTierDiscount(qty);
    const subtotal = itemData.basePrice * qty;
    const discountAmount = (subtotal * tierInfo.percent) / 100;
    const estimatedFreight = qty > 100 ? 0 : 45.00; // Free freight over 100 units
    const total = subtotal - discountAmount + estimatedFreight;
    const unitFinalPrice = total / qty;

    // Update DOM display
    const unitBaseEl = document.getElementById("calcUnitBasePrice");
    const tierBadgeEl = document.getElementById("calcTierBadge");
    const subtotalEl = document.getElementById("calcSubtotal");
    const discountEl = document.getElementById("calcDiscountAmount");
    const freightEl = document.getElementById("calcFreight");
    const totalEl = document.getElementById("calcFinalTotal");
    const effectiveUnitEl = document.getElementById("calcEffectiveUnitPrice");

    if (unitBaseEl) unitBaseEl.textContent = `$${itemData.basePrice.toFixed(2)}`;
    if (tierBadgeEl) tierBadgeEl.textContent = tierInfo.tier;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `-$${discountAmount.toFixed(2)} (${tierInfo.percent}%)`;
    if (freightEl) freightEl.textContent = estimatedFreight === 0 ? "FREE (Volume perk)" : `$${estimatedFreight.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (effectiveUnitEl) effectiveUnitEl.textContent = `$${unitFinalPrice.toFixed(2)} / unit`;
  }

  function initBulkPage() {
    const catSelect = document.getElementById("bulkCategorySelect");
    const qtyInput = document.getElementById("bulkQtyInput");
    const qtySlider = document.getElementById("bulkQtySlider");
    const rfqForm = document.getElementById("bulkRfqForm");

    if (qtySlider && qtyInput) {
      qtySlider.addEventListener("input", (e) => {
        qtyInput.value = e.target.value;
        updateCalculator();
      });
      qtyInput.addEventListener("input", (e) => {
        qtySlider.value = e.target.value;
        updateCalculator();
      });
    }

    if (catSelect) {
      catSelect.addEventListener("change", updateCalculator);
    }

    if (rfqForm) {
      rfqForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const company = document.getElementById("rfqCompany").value;
        const name = document.getElementById("rfqName").value;
        
        window.showToast("Quote Request Submitted!", `Thank you, ${name} (${company}). Our commercial B2B team will email your official formal proforma quote within 4 business hours.`, "success");
        rfqForm.reset();
      });
    }

    updateCalculator();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("bulkCategorySelect")) {
      initBulkPage();
    }
  });
})();
