/* ==========================================================================
   FLORACRAFT - AUTHENTICATION CONTROLLER (No Admin)
   ========================================================================== */

(function () {
  const USERS_LIST_KEY = "floracraft_users_list";
  const USER_KEY = "floracraft_current_user";

  function getRegisteredUsers() {
    let users = JSON.parse(localStorage.getItem(USERS_LIST_KEY) || '[]');
    // Seed initial users if none exist
    if (users.length === 0) {
      users = [
        {
          id: "USR-001", name: "Eleanor Vance", email: "eleanor@example.com", password: "password123", role: "user", status: "Active", phone: "+1 (503) 555-0198", address: "Portland, OR", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", registeredAt: "Jan 12, 2026, 9:41 AM", memberSince: "January 2026"
        },
        {
          id: "USR-002", name: "Gardener", email: "gardener@floracraft.com", password: "password123", role: "user", status: "Active", phone: "+1 (503) 555-9921", address: "Seattle, WA", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80", registeredAt: "Feb 05, 2026, 2:15 PM", memberSince: "February 2026"
        }
      ];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    }
    return users;
  }
  window.getRegisteredUsers = getRegisteredUsers;

  window.getCurrentUser = function () {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  };

  window.getAllUsers = function () {
    return getRegisteredUsers().map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, status: u.status, phone: u.phone, address: u.address, avatar: u.avatar, registeredAt: u.registeredAt
    }));
  };

  window.loginUser = function (email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getRegisteredUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (foundUser) {
      if (foundUser.status === 'Suspended') {
        return { success: false, message: "Your account is currently suspended. Please contact customer support." };
      }
      localStorage.setItem(USER_KEY, JSON.stringify(foundUser));
      updateAuthUI();
      return { success: true, user: foundUser };
    }
    return { success: false, message: "Invalid email or password. Please check your credentials." };
  };

  window.registerUser = function (name, email, password, phone = "", address = "") {
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getRegisteredUsers();
    
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "An account with this email address already exists. Please sign in or use another email." };
    }

    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
    const uniqueId = "USR-" + Math.floor(1000 + Math.random() * 9000);

    const newUser = {
      id: uniqueId, name: name.trim(), email: cleanEmail, password: password, phone: phone.trim() || "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000), address: address.trim() || "Portland, OR", role: "user", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", registeredAt: formattedDate, memberSince: now.toLocaleString("en-US", { month: "long", year: "numeric" })
    };

    users.unshift(newUser);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    updateAuthUI();
    return { success: true, user: newUser };
  };

  window.logoutUser = function () {
    localStorage.removeItem(USER_KEY);
    updateAuthUI();
    if (window.showToast) {
      window.showToast("Signed Out", "You have been safely logged out.", "info");
    }
    setTimeout(() => { window.location.href = "login.html"; }, 400);
  };

  window.updateUserProfile = function (updatedData) {
    const currentUser = window.getCurrentUser();
    if (!currentUser) return false;

    const merged = { ...currentUser, ...updatedData };
    localStorage.setItem(USER_KEY, JSON.stringify(merged));

    const users = getRegisteredUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = merged;
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    }

    updateAuthUI();
    return true;
  };

  function updateAuthUI() {
    const currentUser = window.getCurrentUser();
    const authContainers = document.querySelectorAll(".auth-nav-container");

    authContainers.forEach((container) => {
      if (currentUser && currentUser.name) {
        let displayName = currentUser.name.trim();
        if (displayName.includes(' ')) {
          displayName = displayName.split(' ')[0];
        }

        container.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false" style="height: 42px;">
              <img src="${currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"}" alt="${currentUser.name}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">
              <span class="d-inline fw-bold">${displayName}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
              <li class="px-3 py-2 border-bottom">
                <div class="fw-bold text-main">${currentUser.name}</div>
                <div class="text-muted small text-truncate" style="max-width:180px;">${currentUser.email}</div>
                <span class="badge bg-success-subtle text-success mt-1" style="font-size:0.7rem;">Club Member</span>
              </li>
              <li><a class="dropdown-item" href="profile.html"><i class="fa-solid fa-gauge me-2 text-primary"></i>User Dashboard</a></li>
              <li><a class="dropdown-item" href="wishlist.html"><i class="fa-solid fa-heart me-2 text-danger"></i>My Wishlist</a></li>
              <li><a class="dropdown-item" href="cart.html"><i class="fa-solid fa-bag-shopping me-2 text-success"></i>My Cart</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="window.logoutUser()"><i class="fa-solid fa-right-from-bracket me-2"></i>Sign Out</a></li>
            </ul>
          </div>
        `;
      } else {
        container.innerHTML = `
          <a href="login.html" class="icon-btn" title="Sign In">
            <i class="fa-regular fa-user"></i>
          </a>
        `;
      }
    });

    // Update mobile bottom nav links if present
    document.querySelectorAll(".mobile-bottom-nav a[href='login.html'], .mobile-bottom-nav a[href='profile.html']").forEach((link) => {
      if (currentUser) {
        link.href = "profile.html";
        const icon = link.querySelector("i");
        if (icon) icon.className = "fa-solid fa-gauge";
        const span = link.querySelector("span");
        if (span) span.textContent = "Dashboard";
      } else {
        link.href = "login.html";
        const icon = link.querySelector("i");
        if (icon) icon.className = "fa-regular fa-user";
        const span = link.querySelector("span");
        if (span) span.textContent = "Sign In";
      }
    });
  }

  window.updateAuthUI = updateAuthUI;

  document.addEventListener("DOMContentLoaded", () => {
    getRegisteredUsers();
    updateAuthUI();
  });
})();
