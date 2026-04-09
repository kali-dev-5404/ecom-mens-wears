const STORAGE_KEYS = {
  cart: 'ecomCartCount',
  wishlist: 'ecomWishlistCount',
  loggedIn: 'ecomLoggedIn',
};

function getStoredCount(key) {
  const val = Number.parseInt(localStorage.getItem(key) || '0', 10);
  return Number.isNaN(val) ? 0 : Math.max(0, val);
}

function setStoredCount(key, count) {
  localStorage.setItem(key, String(Math.max(0, count)));
}

function renderNavCounts() {
  const cartCount = getStoredCount(STORAGE_KEYS.cart);
  const wishlistCount = getStoredCount(STORAGE_KEYS.wishlist);

  document.querySelectorAll('.nav-count[data-type="cart"]').forEach((node) => {
    node.textContent = String(cartCount);
  });

  document.querySelectorAll('.nav-count[data-type="wishlist"]').forEach((node) => {
    node.textContent = String(wishlistCount);
  });
}

function initAccountMenu() {
  const loggedIn = localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true';
  const wraps = document.querySelectorAll('.account-wrap');

  wraps.forEach((wrap) => {
    const trigger = wrap.querySelector('.account-trigger');
    if (!trigger) return;

    if (!loggedIn) {
      wrap.classList.remove('logged-in', 'open');
      trigger.setAttribute('href', 'login.html');
      return;
    }

    wrap.classList.add('logged-in');
    trigger.setAttribute('href', '#');

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      wraps.forEach((node) => {
        if (node !== wrap) node.classList.remove('open');
      });
      wrap.classList.toggle('open');
    });
  });

  document.addEventListener('click', (event) => {
    wraps.forEach((wrap) => {
      if (!wrap.contains(event.target)) {
        wrap.classList.remove('open');
      }
    });
  });

  document.querySelectorAll('[data-action="logout"]').forEach((node) => {
    node.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem(STORAGE_KEYS.loggedIn);
      document.location.href = 'index.html';
    });
  });
}

function bindCountActions() {
  document.addEventListener('click', (event) => {
    const addCartButton = event.target.closest('.add-cart-btn, .qv-cart-btn');
    if (addCartButton) {
      setStoredCount(STORAGE_KEYS.cart, getStoredCount(STORAGE_KEYS.cart) + 1);
      renderNavCounts();
      return;
    }

    const wishlistButton = event.target.closest('.product-actions button');
    if (wishlistButton && wishlistButton.querySelector('.fa-heart')) {
      setStoredCount(STORAGE_KEYS.wishlist, getStoredCount(STORAGE_KEYS.wishlist) + 1);
      renderNavCounts();
      return;
    }

    const linkButton = event.target.closest('a.small-btn');
    if (!linkButton) return;

    const label = linkButton.textContent.trim().toLowerCase();
    if (label === 'move to cart') {
      setStoredCount(STORAGE_KEYS.cart, getStoredCount(STORAGE_KEYS.cart) + 1);
      setStoredCount(STORAGE_KEYS.wishlist, getStoredCount(STORAGE_KEYS.wishlist) - 1);
      renderNavCounts();
      return;
    }

    if (label === 'remove') {
      setStoredCount(STORAGE_KEYS.wishlist, getStoredCount(STORAGE_KEYS.wishlist) - 1);
      renderNavCounts();
    }
  });
}

function initCommonNavbarFeatures() {
  renderNavCounts();
  initAccountMenu();
  bindCountActions();
}

initCommonNavbarFeatures();
