/* ==========================================================================
   FLORACRAFT - CONTACT & INTERACTIVE FAQ CONTROLLER
   Contact inquiries, validation, and real-time FAQ search filter
   ========================================================================== */

(function () {
  function initContactPage() {
    // Contact form submission
    const form = document.getElementById("contactInquiryForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value;

        window.showToast(
          "Message Dispatched!",
          `Thank you ${name}! Our botanical customer support team will reply to ${email} within 24 hours.`,
          "success"
        );
        form.reset();
      });
    }

    // FAQ live search
    const faqSearchInput = document.getElementById("faqSearchInput");
    const faqItems = document.querySelectorAll(".accordion-item");

    if (faqSearchInput) {
      faqSearchInput.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        faqItems.forEach((item) => {
          const text = item.textContent.toLowerCase();
          if (text.includes(q)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("contactInquiryForm") || document.getElementById("faqSearchInput")) {
      initContactPage();
    }
  });
})();
