const STORAGE_KEYS = {
  cart: 'ecomCartCount',
  cartItems: 'ecomCartItems',
  cartQuantities: 'ecomCartQuantities',
  wishlist: 'ecomWishlistCount',
  wishlistItems: 'ecomWishlistItems',
  loggedIn: 'ecomLoggedIn',
};

const PRODUCT_CATALOG = {
  kurta: {
    title: 'Luxury Silk Kurta',
    subtitle: "Men's Ethnic",
    image: 'assets/images/product-kurta-main.jpg',
    priceNew: '₹1,299',
    priceOld: '₹1,899',
    size: 'M',
  },
  sherwani: {
    title: 'Banarasi Sherwani',
    subtitle: 'Festive Wear',
    image: 'assets/images/product-sherwani-main.jpg',
    priceNew: '₹3,499',
    priceOld: '₹5,200',
    size: 'L',
  },
  dhoti: {
    title: 'Pure Cotton Dhoti',
    subtitle: 'Traditional',
    image: 'assets/images/product-dhoti-main.jpg',
    priceNew: '₹799',
    priceOld: '₹1,100',
    size: 'S',
  },
  wedding: {
    title: 'Wedding Kurta Set',
    subtitle: 'Bridal Collection',
    image: 'assets/images/product-wedding-main.jpg',
    priceNew: '₹2,499',
    priceOld: '₹3,800',
    size: 'M',
  },
};

function getCartItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cartItems);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item) => typeof item === 'string' && item.trim()))];
  } catch {
    return [];
  }
}

function getCartQuantities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.cartQuantities);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > 0)
        .map(([itemKey, value]) => [itemKey, Math.max(1, Number(value))])
    );
  } catch {
    return {};
  }
}

function setCartQuantities(quantityMap) {
  const cleaned = Object.fromEntries(
    Object.entries(quantityMap)
      .filter(([itemKey, value]) => typeof itemKey === 'string' && itemKey.trim() && Number.isFinite(Number(value)) && Number(value) > 0)
      .map(([itemKey, value]) => [itemKey, Math.max(1, Number(value))])
  );
  localStorage.setItem(STORAGE_KEYS.cartQuantities, JSON.stringify(cleaned));
}

function setCartItems(items) {
  const uniqueItems = [...new Set(items.filter((item) => typeof item === 'string' && item.trim()))];
  localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(uniqueItems));
  setStoredCount(STORAGE_KEYS.cart, uniqueItems.length);
}

function setCartItemQuantity(itemKey, quantity) {
  const quantities = getCartQuantities();
  if (quantity > 0) {
    quantities[itemKey] = Math.max(1, quantity);
  } else {
    delete quantities[itemKey];
  }
  setCartQuantities(quantities);
}

function getCartItemQuantity(itemKey) {
  const quantities = getCartQuantities();
  return Math.max(1, Number(quantities[itemKey] || 1));
}

function getProductInfo(itemKey) {
  return PRODUCT_CATALOG[itemKey] || {
    title: 'Product',
    subtitle: 'Menswear',
    image: 'assets/images/product-kurta-main.jpg',
    priceNew: '₹0',
    priceOld: '₹0',
    size: 'M',
  };
}

function getCartKeyFromButton(button) {
  const card = button.closest('.product-card');
  if (card?.dataset?.product) return card.dataset.product;
  if (button.dataset?.product) return button.dataset.product;
  const cartItem = button.closest('.cart-item');
  if (cartItem?.dataset?.product) return cartItem.dataset.product;
  return '';
}

function getWishlistItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.wishlistItems);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((item) => typeof item === 'string' && item.trim()))];
  } catch {
    return [];
  }
}

function setWishlistItems(items) {
  const uniqueItems = [...new Set(items.filter((item) => typeof item === 'string' && item.trim()))];
  localStorage.setItem(STORAGE_KEYS.wishlistItems, JSON.stringify(uniqueItems));
  setStoredCount(STORAGE_KEYS.wishlist, uniqueItems.length);
}

function getWishlistKeyFromButton(button) {
  const card = button.closest('.product-card');
  if (card?.dataset?.product) return card.dataset.product;
  if (button.dataset?.product) return button.dataset.product;
  const wishlistItem = button.closest('.wishlist-item');
  if (wishlistItem?.dataset?.product) return wishlistItem.dataset.product;
  return '';
}

function setWishlistButtonState(button, isActive) {
  const icon = button.querySelector('.fa-heart');
  if (!icon) return;

  icon.classList.toggle('fa-solid', isActive);
  icon.classList.toggle('fa-regular', !isActive);
  button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
}

function syncWishlistButtons() {
  const wishlistSet = new Set(getWishlistItems());

  document.querySelectorAll('.product-actions button').forEach((button) => {
    if (!button.querySelector('.fa-heart')) return;
    const key = getWishlistKeyFromButton(button);
    setWishlistButtonState(button, key ? wishlistSet.has(key) : false);
  });

  const topWishlistButton = document.getElementById('pdWishlistBtn');
  if (topWishlistButton) {
    const key = getWishlistKeyFromButton(topWishlistButton);
    setWishlistButtonState(topWishlistButton, key ? wishlistSet.has(key) : false);
  }
}

function getStoredCount(key) {
  const val = Number.parseInt(localStorage.getItem(key) || '0', 10);
  return Number.isNaN(val) ? 0 : Math.max(0, val);
}

function setStoredCount(key, count) {
  localStorage.setItem(key, String(Math.max(0, count)));
}

function renderNavCounts() {
  const cartItems = getCartItems();
  const storedCart = getStoredCount(STORAGE_KEYS.cart);
  const cartCount = cartItems.length;
  const wishlistItems = getWishlistItems();
  const storedWishlist = getStoredCount(STORAGE_KEYS.wishlist);
  const wishlistCount = wishlistItems.length;

  if (cartCount !== storedCart) {
    setStoredCount(STORAGE_KEYS.cart, cartItems.length);
  }

  if (wishlistCount !== storedWishlist) {
    setStoredCount(STORAGE_KEYS.wishlist, wishlistItems.length);
  }

  document.querySelectorAll('.nav-count[data-type="cart"]').forEach((node) => {
    node.textContent = String(cartCount);
  });

  document.querySelectorAll('.nav-count[data-type="wishlist"]').forEach((node) => {
    node.textContent = String(wishlistCount);
  });
}

function syncStorePageItems() {
  const cartContainer = document.querySelector('.cart-grid .panel');
  if (cartContainer) {
    const cartItems = getCartItems();
    const summaryActionRows = Array.from(cartContainer.querySelectorAll('.action-row'));
    const existingSummaryBlock = summaryActionRows[0] || null;
    const itemMarkup = cartItems.map((itemKey) => {
      const product = getProductInfo(itemKey);
      const quantity = getCartItemQuantity(itemKey);
      return `
        <div class="cart-item" data-product="${itemKey}">
          <img class="cart-thumb" src="${product.image}" alt="${product.title}"/>
          <div>
            <h3>${product.title}</h3>
            <p>${product.subtitle} • Size ${product.size}</p>
            <div class="item-price">
              <span class="new">${product.priceNew}</span>
              <span class="old">${product.priceOld}</span>
            </div>
          </div>
          <div class="cart-actions">
            <div class="qty-box">
              <button type="button" aria-label="Decrease quantity">-</button>
              <span class="cart-qty">${quantity}</span>
              <button type="button" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="remove-cart-btn" data-product="${itemKey}" aria-label="Remove from cart">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const emptyMessage = cartContainer.querySelector('.cart-empty-note');
    const actionRow = cartContainer.querySelector('.action-row');
    const heading = cartContainer.querySelector('h2');

    cartContainer.querySelectorAll('.cart-item').forEach((item) => item.remove());
    if (emptyMessage) emptyMessage.hidden = cartItems.length > 0;
    if (actionRow && heading) {
      actionRow.insertAdjacentHTML('beforebegin', itemMarkup || '');
    } else {
      cartContainer.insertAdjacentHTML('beforeend', itemMarkup || '');
    }

    const cartEmpty = document.querySelector('.cart-empty-note');
    const cartRows = document.querySelectorAll('.cart-item');
    if (cartEmpty) {
      cartEmpty.hidden = cartRows.length > 0;
    }
  }

  const wishlistContainer = document.querySelector('.wishlist-grid');
  if (wishlistContainer) {
    const wishlistItems = getWishlistItems();
    wishlistContainer.innerHTML = wishlistItems.map((itemKey) => {
      const product = getProductInfo(itemKey);
      return `
        <div class="wishlist-item" data-product="${itemKey}">
          <img class="wishlist-thumb" src="${product.image}" alt="${product.title}"/>
          <div>
            <h3>${product.title}</h3>
            <p>${product.subtitle}</p>
            <div class="item-price">
              <span class="new">${product.priceNew}</span>
              <span class="old">${product.priceOld}</span>
            </div>
            <div class="action-row">
              <a class="small-btn move-to-cart-btn" data-product="${itemKey}" href="cart.html">Move to Cart</a>
              <button type="button" class="remove-wishlist-btn" data-product="${itemKey}" aria-label="Remove from wishlist">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const wishlistEmpty = document.querySelector('.wishlist-empty-note');
    const wishlistRows = document.querySelectorAll('.wishlist-item');
    if (wishlistEmpty) {
      wishlistEmpty.hidden = wishlistRows.length > 0;
    }
  }
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
    const removeWishlistButton = event.target.closest('.remove-wishlist-btn');
    if (removeWishlistButton) {
      const key = getWishlistKeyFromButton(removeWishlistButton);
      if (key) {
        const items = getWishlistItems().filter((item) => item !== key);
        setWishlistItems(items);
      }

      const wishlistItem = removeWishlistButton.closest('.wishlist-item');
      if (wishlistItem) wishlistItem.remove();

      renderNavCounts();
      syncWishlistButtons();
      syncStorePageItems();
      return;
    }

    const moveToCartButton = event.target.closest('.move-to-cart-btn');
    if (moveToCartButton) {
      event.preventDefault();

      const key = getWishlistKeyFromButton(moveToCartButton);
      if (key) {
        const cartItems = getCartItems();
        if (!cartItems.includes(key)) {
          cartItems.push(key);
          setCartItems(cartItems);
        }

        const wishlistItems = getWishlistItems().filter((item) => item !== key);
        setWishlistItems(wishlistItems);
      }

      const wishlistItem = moveToCartButton.closest('.wishlist-item');
      if (wishlistItem) wishlistItem.remove();

      renderNavCounts();
      syncWishlistButtons();
      syncStorePageItems();
      return;
    }

    const qtyButton = event.target.closest('.qty-box button');
    if (qtyButton) {
      const qtyBox = qtyButton.closest('.qty-box');
      const qtyNode = qtyBox ? qtyBox.querySelector('.cart-qty') : null;
      const cartItem = qtyButton.closest('.cart-item');
      const itemKey = cartItem?.dataset?.product || '';
      if (qtyNode) {
        const currentQty = Number.parseInt(qtyNode.textContent || '1', 10) || 1;
        const isIncrease = qtyButton.textContent.trim() === '+';
        const nextQty = isIncrease ? currentQty + 1 : Math.max(1, currentQty - 1);
        qtyNode.textContent = String(nextQty);
        if (itemKey) {
          setCartItemQuantity(itemKey, nextQty);
        }
      }
      return;
    }

    const removeCartButton = event.target.closest('.remove-cart-btn');
    if (removeCartButton) {
      const key = getCartKeyFromButton(removeCartButton);
      if (key) {
        const items = getCartItems().filter((item) => item !== key);
        setCartItems(items);
      }

      const cartItem = removeCartButton.closest('.cart-item');
      if (cartItem) cartItem.remove();

      renderNavCounts();
      syncStorePageItems();
      return;
    }

    const addCartButton = event.target.closest('.add-cart-btn, .qv-cart-btn');
    if (addCartButton) {
      const key = getCartKeyFromButton(addCartButton);

      if (key) {
        const items = getCartItems();
        if (!items.includes(key)) {
          items.push(key);
          setCartItems(items);
        }
      } else {
        setStoredCount(STORAGE_KEYS.cart, getStoredCount(STORAGE_KEYS.cart) + 1);
      }

      renderNavCounts();
      return;
    }

    const wishlistButton = event.target.closest('.product-actions button, #pdWishlistBtn');
    if (wishlistButton && wishlistButton.querySelector('.fa-heart')) {
      const key = getWishlistKeyFromButton(wishlistButton);
      if (key) {
        const items = getWishlistItems();
        const existingIndex = items.indexOf(key);

        if (existingIndex >= 0) {
          items.splice(existingIndex, 1);
        } else {
          items.push(key);
        }

        setWishlistItems(items);
      }

      renderNavCounts();
      syncWishlistButtons();
      return;
    }

  });
}

function initCommonNavbarFeatures() {
  syncStorePageItems();
  renderNavCounts();
  syncWishlistButtons();
  initAccountMenu();
  bindCountActions();
}

window.syncWishlistButtons = syncWishlistButtons;

initCommonNavbarFeatures();
