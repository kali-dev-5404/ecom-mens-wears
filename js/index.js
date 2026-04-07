let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dots .dot');

function showSlide(n) {
  slides.forEach((slide) => slide.classList.remove('active'));
  dots.forEach((dot) => dot.classList.remove('active'));

  slides[n].classList.add('active');
  dots[n].classList.add('active');
  currentSlide = n;
}

function nextSlide() {
  const n = (currentSlide + 1) % slides.length;
  showSlide(n);
}

function prevSlide() {
  const n = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(n);
}

function goToSlide(n) {
  showSlide(n);
}

setInterval(nextSlide, 10000);

const promoHours = document.getElementById('promoHours');
const promoMins = document.getElementById('promoMins');
const promoSecs = document.getElementById('promoSecs');
const promoTarget = Date.now() + ((8 * 60 * 60) + (34 * 60) + 52) * 1000;

function updatePromoCountdown() {
  const now = Date.now();
  let diff = Math.max(0, promoTarget - now);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * 1000 * 60;
  const secs = Math.floor(diff / 1000);

  promoHours.textContent = String(hours).padStart(2, '0');
  promoMins.textContent = String(mins).padStart(2, '0');
  promoSecs.textContent = String(secs).padStart(2, '0');
}

updatePromoCountdown();
setInterval(updatePromoCountdown, 1000);

const quickViewState = {
  images: [],
  index: 0,
  qty: 1,
};

document.querySelectorAll('.product-placeholder img[data-hover-src]').forEach((img) => {
  const card = img.closest('.product-card');
  img.dataset.mainSrc = img.src;

  card.addEventListener('mouseenter', () => {
    img.src = img.dataset.hoverSrc;
  });

  card.addEventListener('mouseleave', () => {
    img.src = img.dataset.mainSrc;
  });
});

function openQuickView(btn) {
  const card = btn.closest('.product-card');
  const img = card.querySelector('.product-placeholder img');
  const title = card.querySelector('.product-info h4')?.textContent?.trim() || 'Product';
  const type = card.querySelector('.product-sub')?.textContent?.trim() || 'Menswear';
  const priceNew = card.querySelector('.price-new')?.textContent?.trim() || 'Rs. 0';
  const priceOld = card.querySelector('.price-old')?.textContent?.trim() || '';
  const badge = card.querySelector('.product-badge')?.textContent?.trim() || 'SALE';

  quickViewState.images = [img.dataset.mainSrc || img.src, img.dataset.hoverSrc || img.src];
  quickViewState.index = 0;
  quickViewState.qty = 1;

  document.getElementById('quickViewImage').src = quickViewState.images[0];
  document.getElementById('quickViewTitle').textContent = title;
  document.getElementById('quickViewType').textContent = `Product Type - ${type}  Brand - Ecom  Fabric - Cotton Blend  Pattern - Checked`;
  document.getElementById('quickViewPriceNew').textContent = priceNew;
  document.getElementById('quickViewPriceOld').textContent = priceOld;
  document.getElementById('quickViewBadge').textContent = badge.toUpperCase();
  document.getElementById('quickViewQty').textContent = '1';

  document.getElementById('quickViewOverlay').classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeQuickView(event) {
  const overlay = document.getElementById('quickViewOverlay');
  if (!event || event.target.id === 'quickViewOverlay') {
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
}

function swapQuickViewImage(direction) {
  if (!quickViewState.images.length) return;
  if (direction === 'next') {
    quickViewState.index = (quickViewState.index + 1) % quickViewState.images.length;
  } else {
    quickViewState.index = (quickViewState.index - 1 + quickViewState.images.length) % quickViewState.images.length;
  }
  document.getElementById('quickViewImage').src = quickViewState.images[quickViewState.index];
}

function changeQuickQty(delta) {
  quickViewState.qty = Math.max(1, quickViewState.qty + delta);
  document.getElementById('quickViewQty').textContent = String(quickViewState.qty);
}

window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.swapQuickViewImage = swapQuickViewImage;
window.changeQuickQty = changeQuickQty;
