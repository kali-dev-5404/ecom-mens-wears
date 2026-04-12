const ORDERS_DATA = [
  {
    id: 'ECO10982',
    date: '08 Apr 2026',
    deliveryDate: '11 Apr 2026',
    status: 'delivered',
    total: '₹4,798',
    eta: 'Delivered on 11 Apr 2026',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Delhivery',
    trackingNo: 'DLV921344210',
    items: [
      { title: 'Luxury Silk Kurta', qty: 1, size: 'M', price: 1299, image: 'assets/images/product-kurta-main.jpg' },
      { title: 'Pure Cotton Dhoti', qty: 2, size: 'L', price: 799, image: 'assets/images/product-dhoti-main.jpg' }
    ]
  },
  {
    id: 'ECO10977',
    date: '06 Apr 2026',
    deliveryDate: '13 Apr 2026',
    status: 'shipped',
    total: '₹3,499',
    eta: 'Expected by 13 Apr 2026',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Blue Dart',
    trackingNo: 'BD948102101',
    items: [
      { title: 'Banarasi Sherwani', qty: 1, size: 'L', price: 3499, image: 'assets/images/product-sherwani-main.jpg' }
    ]
  },
  {
    id: 'ECO10965',
    date: '03 Apr 2026',
    deliveryDate: '15 Apr 2026',
    status: 'processing',
    total: '₹2,499',
    eta: 'Packing in progress',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Yet to assign',
    trackingNo: 'Will be generated soon',
    items: [
      { title: 'Wedding Kurta Set', qty: 1, size: 'M', price: 2499, image: 'assets/images/product-wedding-main.jpg' }
    ]
  },
  {
    id: 'ECO10931',
    date: '28 Mar 2026',
    deliveryDate: 'Cancelled',
    status: 'cancelled',
    total: '₹1,299',
    eta: 'Cancelled and refunded',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Not applicable',
    trackingNo: 'Not applicable',
    items: [
      { title: 'Luxury Silk Kurta', qty: 1, size: 'S', price: 1299, image: 'assets/images/product-kurta-main.jpg' }
    ]
  }
];

function getOrderById(orderId) {
  if (!orderId) return null;
  const key = String(orderId).trim().toUpperCase();
  return ORDERS_DATA.find((order) => order.id.toUpperCase() === key) || null;
}

function getProgressIndex(status) {
  if (status === 'processing') return 0;
  if (status === 'shipped') return 1;
  if (status === 'delivered') return 3;
  return 0;
}

function formatPrice(value) {
  const amount = Number(value) || 0;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function renderOrderListPage() {
  const listRoot = document.getElementById('orderListRoot');
  if (!listRoot) return;

  const emptyNode = document.getElementById('orderEmptyNote');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const searchInput = document.getElementById('orderSearchInput');

  let currentFilter = 'all';
  let searchQuery = '';

  const render = () => {
    const visibleOrders = ORDERS_DATA.filter((order) => {
      const statusMatch = currentFilter === 'all' || order.status === currentFilter;
      const searchMatch = !searchQuery || order.id.toLowerCase().includes(searchQuery);
      return statusMatch && searchMatch;
    });

    listRoot.innerHTML = visibleOrders.map((order) => {
      const itemsHtml = order.items.map((item) => `
        <article class="order-item">
          <img src="${item.image}" alt="${item.title}"/>
          <div>
            <h4>${item.title}</h4>
            <p>Qty: ${item.qty} | Size: ${item.size}</p>
          </div>
        </article>
      `).join('');

      return `
        <article class="order-card" data-status="${order.status}" data-order-id="${order.id}">
          <div class="order-card-head">
            <div>
              <p class="order-id">Order ${order.id}</p>
              <p class="order-meta">Placed on ${order.date}</p>
            </div>
            <span class="order-pill ${order.status}">${order.status}</span>
          </div>
          <div class="order-items">
            ${itemsHtml}
          </div>
          <div class="order-card-foot">
            <p class="order-total">Order Total <strong>${order.total}</strong></p>
            <div class="order-actions">
              <a class="order-btn primary" href="track-order.html?order=${encodeURIComponent(order.id)}">Track Order</a>
              <button class="order-btn" type="button" data-reorder="${order.id}">Reorder</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (emptyNode) {
      emptyNode.hidden = visibleOrders.length > 0;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter || 'all';
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      render();
    });
  }

  listRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-reorder]');
    if (!button) return;

    const orderId = button.getAttribute('data-reorder');
    if (orderId) {
      alert(`Reorder started for ${orderId}`);
    }
  });

  render();
}

function renderTrackPage() {
  const trackPage = document.getElementById('trackOrderPage');
  if (!trackPage) return;

  const statusLine = document.getElementById('statusLine');
  const currentLabel = document.getElementById('progressCurrentLabel');
  const itemsList = document.getElementById('trackItemsList');
  const invoiceButton = document.getElementById('downloadInvoiceBtn');

  const orderIdText = document.getElementById('trackOrderId');
  const orderStatusText = document.getElementById('trackOrderStatus');
  const orderDateText = document.getElementById('trackOrderDate');
  const orderDeliveryDateText = document.getElementById('trackDeliveryDate');
  const orderItemCountText = document.getElementById('trackItemCount');

  const steps = [
    { label: 'Ordered', icon: 'fa-bag-shopping' },
    { label: 'Shipped', icon: 'fa-box-open' },
    { label: 'Out for delivery', icon: 'fa-truck-fast' },
    { label: 'Delivered', icon: 'fa-house' }
  ];

  const renderSteps = (status) => {
    if (!statusLine) return;
    const activeIndex = getProgressIndex(status);
    const progressPercent = status === 'cancelled' ? 0 : activeIndex * 25;

    statusLine.innerHTML = `<div class="status-progress-bar" style="width:${progressPercent}%"></div>${steps.map((step, index) => {
      const isDone = index < activeIndex;
      const isActive = index === activeIndex;
      const stateClass = isDone ? 'done' : (isActive ? 'active' : '');

      return `
        <article class="progress-step ${stateClass}">
          <span class="progress-icon"><i class="fa-solid ${step.icon}"></i></span>
          <span class="progress-dot"></span>
          <span class="progress-label">${step.label}</span>
        </article>
      `;
    }).join('')}`;

    if (currentLabel) {
      if (status === 'cancelled') {
        currentLabel.textContent = 'Cancelled';
      } else {
        currentLabel.textContent = steps[activeIndex]?.label || 'Ordered';
      }
    }
  };

  const renderItems = (order) => {
    if (!itemsList) return;
    itemsList.innerHTML = order.items.map((item) => {
      const lineTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
      return `
        <article class="track-item-row">
          <img src="${item.image}" alt="${item.title}"/>
          <div>
            <h4>${item.title}</h4>
            <p>Size: ${item.size}</p>
          </div>
          <p class="track-item-qty">Qty: ${item.qty}</p>
          <p class="track-item-total">${formatPrice(lineTotal)}</p>
        </article>
      `;
    }).join('');
  };

  const renderOrder = (order) => {
    if (!order) return;
    const totalItems = order.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    orderIdText.textContent = order.id;
    orderStatusText.textContent = order.status;
    orderDateText.textContent = order.date;
    orderDeliveryDateText.textContent = order.deliveryDate || order.eta;
    orderItemCountText.textContent = String(totalItems);
    renderSteps(order.status);
    renderItems(order);
  };

  const params = new URLSearchParams(window.location.search);
  const initialOrderId = params.get('order') || 'ECO10982';
  const activeOrder = getOrderById(initialOrderId) || ORDERS_DATA[0];
  renderOrder(activeOrder);

  if (invoiceButton) {
    invoiceButton.addEventListener('click', (event) => {
      event.preventDefault();
      alert(`Invoice download started for ${activeOrder.id}`);
    });
  }
}

renderOrderListPage();
renderTrackPage();
