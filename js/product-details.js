const products = {
  kurta: {
    title: 'Luxury Silk Kurta',
    image: 'assets/images/product-kurta-main.jpg',
    newPrice: 'Rs. 1,299.00',
    oldPrice: 'Rs. 1,899.00',
    sku: 'LVSHIRT-016',
    stock: 2,
  },
  sherwani: {
    title: 'Banarasi Sherwani',
    image: 'assets/images/product-sherwani-main.jpg',
    newPrice: 'Rs. 3,499.00',
    oldPrice: 'Rs. 5,200.00',
    sku: 'BNSHR-122',
    stock: 3,
  },
  dhoti: {
    title: 'Pure Cotton Dhoti',
    image: 'assets/images/product-dhoti-main.jpg',
    newPrice: 'Rs. 799.00',
    oldPrice: 'Rs. 1,100.00',
    sku: 'PCTD-224',
    stock: 5,
  },
  wedding: {
    title: 'Wedding Kurta Set',
    image: 'assets/images/product-wedding-main.jpg',
    newPrice: 'Rs. 2,499.00',
    oldPrice: 'Rs. 3,800.00',
    sku: 'WDSET-301',
    stock: 2,
  },
};

const params = new URLSearchParams(window.location.search);
const key = params.get('product') || 'kurta';
const product = products[key] || products.kurta;

const titleNode = document.getElementById('pdTitle');
const breadNode = document.getElementById('pdBread');
const imageNode = document.getElementById('pdMainImage');
const newNode = document.getElementById('pdNew');
const oldNode = document.getElementById('pdOld');
const skuNode = document.getElementById('pdSku');
const stockNode = document.getElementById('pdStock');

if (titleNode) titleNode.textContent = product.title;
if (breadNode) breadNode.textContent = product.title;
if (imageNode) {
  imageNode.src = product.image;
  imageNode.alt = product.title;
}
if (newNode) newNode.textContent = product.newPrice;
if (oldNode) oldNode.textContent = product.oldPrice;
if (skuNode) skuNode.textContent = product.sku;
if (stockNode) stockNode.textContent = String(product.stock);

const productAddCartButton = document.querySelector('.pd-actions .add-cart-btn');
if (productAddCartButton) {
  productAddCartButton.dataset.product = key;
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  tempInput.remove();
  return Promise.resolve();
}

async function shareCurrentProduct() {
  const shareData = {
    title: product.title,
    text: `Check out ${product.title} on Ecom`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await copyTextToClipboard(window.location.href);
    const shareBtn = document.getElementById('pdShareBtn');
    if (shareBtn) {
      shareBtn.title = 'Link copied';
      setTimeout(() => {
        shareBtn.title = '';
      }, 1200);
    }
  } catch (error) {
    // User can cancel native share dialog; ignore silently.
  }
}

const wishlistButton = document.getElementById('pdWishlistBtn');
if (wishlistButton) {
  wishlistButton.dataset.product = key;

  if (typeof window.syncWishlistButtons === 'function') {
    window.syncWishlistButtons();
  }
}

const shareButton = document.getElementById('pdShareBtn');
if (shareButton) {
  shareButton.addEventListener('click', () => {
    shareCurrentProduct();
  });
}

document.querySelectorAll('#pdSizes button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#pdSizes button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const txt = document.getElementById('pdSizeText');
    if (txt) txt.textContent = btn.textContent.trim();
  });
});

function openSizeGuide() {
  const modal = document.getElementById('sizeGuideModal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('no-scroll');
  }
}

function closeSizeGuide(event) {
  const modal = document.getElementById('sizeGuideModal');
  if (!event || event.target.id === 'sizeGuideModal') {
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }
}

window.openSizeGuide = openSizeGuide;
window.closeSizeGuide = closeSizeGuide;
