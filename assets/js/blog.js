/* ==========================================================================
   FLORACRAFT - PLANT CARE GUIDE & BLOG CONTROLLER
   Search articles, category filtering, and single post view loader
   ========================================================================== */

(function () {
  function initBlogList() {
    if (!window.FLORACRAFT_DATA) return;
    const container = document.getElementById("blogCardsContainer");
    if (!container) return;

    renderArticles(window.FLORACRAFT_DATA.blogs);

    // Search
    const searchInput = document.getElementById("blogSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase().trim();
        const filtered = window.FLORACRAFT_DATA.blogs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.excerpt.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
        );
        renderArticles(filtered);
      });
    }

    // Category pills
    document.querySelectorAll(".blog-cat-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".blog-cat-pill").forEach((el) => el.classList.remove("active"));
        pill.classList.add("active");
        const cat = pill.getAttribute("data-category");

        if (cat === "all") {
          renderArticles(window.FLORACRAFT_DATA.blogs);
        } else {
          const filtered = window.FLORACRAFT_DATA.blogs.filter((b) => b.category === cat);
          renderArticles(filtered);
        }
      });
    });
  }

  function renderArticles(blogs) {
    const container = document.getElementById("blogCardsContainer");
    if (!container) return;

    if (blogs.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <h4 class="fw-bold">No Botanical Guides Found</h4>
          <p class="text-muted">Try a different search keyword or category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = blogs
      .map(
        (b) => `
      <div class="col-12 col-md-6 col-lg-6 mb-4">
        <div class="blog-card">
          <div class="blog-media">
            <a href="blog-details.html?id=${b.id}" class="d-block w-100 h-100">
              <img src="${b.image}" alt="${b.title}" onerror="this.onerror=null; this.src='assets/images/blog/soil-aeration.jpg';">
            </a>
            <span class="blog-badge">${b.category}</span>
          </div>
          <div class="blog-body">
            <div class="blog-meta">
              <span><i class="fa-regular fa-calendar"></i> ${b.date}</span>
              <span><i class="fa-regular fa-clock"></i> ${b.readTime}</span>
            </div>
            <h3 class="blog-title">
              <a href="blog-details.html?id=${b.id}">${b.title}</a>
            </h3>
            <p class="blog-excerpt">${b.excerpt}</p>
            <div class="blog-footer">
              <div class="d-flex align-items-center gap-2">
                <img src="${b.author.avatar}" alt="${b.author.name}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;">
                <span class="small fw-semibold text-main">${b.author.name}</span>
              </div>
              <a href="blog-details.html?id=${b.id}" class="btn btn-outline-primary btn-sm">Read Article <i class="fa-solid fa-arrow-right ms-1"></i></a>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Single Blog Detail Page Loader
  function initBlogDetail() {
    if (!window.FLORACRAFT_DATA) return;
    const container = document.getElementById("singleBlogContentWrapper");
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id") || "blog-1";
    const blog = window.FLORACRAFT_DATA.blogs.find((b) => b.id === blogId) || window.FLORACRAFT_DATA.blogs[0];

    document.title = `${blog.title} - FloraCraft Plant Care Guide`;

    const titleEl = document.getElementById("blogSingleTitle");
    const catEl = document.getElementById("blogSingleCategory");
    const dateEl = document.getElementById("blogSingleDate");
    const readEl = document.getElementById("blogSingleReadTime");
    const authorNameEl = document.getElementById("blogSingleAuthorName");
    const authorRoleEl = document.getElementById("blogSingleAuthorRole");
    const authorAvatarEl = document.getElementById("blogSingleAuthorAvatar");
    const heroImgEl = document.getElementById("blogSingleHeroImg");
    const bodyEl = document.getElementById("blogSingleBody");
    const checklistEl = document.getElementById("blogSingleChecklist");

    if (titleEl) titleEl.textContent = blog.title;
    if (catEl) catEl.textContent = blog.category;
    if (dateEl) dateEl.textContent = blog.date;
    if (readEl) readEl.textContent = blog.readTime;
    if (authorNameEl) authorNameEl.textContent = blog.author.name;
    if (authorRoleEl) authorRoleEl.textContent = blog.author.role;
    if (authorAvatarEl) authorAvatarEl.src = blog.author.avatar;
    if (heroImgEl) {
      heroImgEl.src = blog.image;
      heroImgEl.onerror = function() {
        this.src = "assets/images/blog/soil-aeration.jpg";
      };
    }
    if (bodyEl) bodyEl.innerHTML = blog.content;

    if (checklistEl && blog.checklist) {
      checklistEl.innerHTML = blog.checklist
        .map(
          (item) => `
        <li class="d-flex align-items-start gap-2 mb-2">
          <i class="fa-solid fa-circle-check text-primary mt-1"></i>
          <span>${item}</span>
        </li>
      `
        )
        .join("");
    }

    // Comment form
    const commentForm = document.getElementById("blogCommentForm");
    const commentsList = document.getElementById("blogCommentsList");
    if (commentForm) {
      commentForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("commentName").value.trim();
        const text = document.getElementById("commentMessage").value.trim();
        if (!name || !text) return;

        const commentHtml = `
          <div class="card p-3 border-0 bg-surface-alt rounded-3 mb-3">
            <div class="d-flex align-items-center gap-3 mb-2">
              <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px;">
                ${name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h6 class="mb-0 fw-bold">${name}</h6>
                <small class="text-muted">Just now</small>
              </div>
            </div>
            <p class="mb-0 small text-muted">${text}</p>
          </div>
        `;

        if (commentsList) commentsList.insertAdjacentHTML("afterbegin", commentHtml);
        window.showToast("Comment Submitted!", "Your feedback has been added to this guide.", "success");
        commentForm.reset();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initBlogList();
    initBlogDetail();
  });
})();
