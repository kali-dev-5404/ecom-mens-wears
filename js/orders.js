const ORDERS_DATA = [
  {
    id: 'ECO10982',
    customer: 'Arun Kumar',
    date: '08 Apr 2026',
    deliveryDate: '11 Apr 2026',
    status: 'delivered',
    total: '₹4,798',
    eta: 'Delivered on 11 Apr 2026',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Delhivery',
    trackingNo: 'DLV921344210',
    timeline: [
      { label: 'Ordered', time: '08 Apr 2026 • 09:05 AM' },
      { label: 'Shipped', time: '09 Apr 2026 • 11:20 AM' },
      { label: 'Out for delivery', time: '11 Apr 2026 • 08:40 AM' },
      { label: 'Delivered', time: '11 Apr 2026 • 06:15 PM' }
    ],
    items: [
      { title: 'Luxury Silk Kurta', qty: 1, size: 'M', price: 1299, image: 'assets/images/product-kurta-main.jpg' },
      { title: 'Pure Cotton Dhoti', qty: 2, size: 'L', price: 799, image: 'assets/images/product-dhoti-main.jpg' }
    ]
  },
  {
    id: 'ECO10977',
    customer: 'Naveen Raj',
    date: '06 Apr 2026',
    deliveryDate: '13 Apr 2026',
    status: 'shipped',
    total: '₹3,499',
    eta: 'Expected by 13 Apr 2026',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Blue Dart',
    trackingNo: 'BD948102101',
    timeline: [
      { label: 'Ordered', time: '06 Apr 2026 • 10:00 AM' },
      { label: 'Shipped', time: '08 Apr 2026 • 04:30 PM' },
      { label: 'Out for delivery', time: '13 Apr 2026 • 09:15 AM' },
      { label: 'Delivered', time: '13 Apr 2026 • 05:45 PM' }
    ],
    items: [
      { title: 'Banarasi Sherwani', qty: 1, size: 'L', price: 3499, image: 'assets/images/product-sherwani-main.jpg' }
    ]
  },
  {
    id: 'ECO10965',
    customer: 'Pradeep M',
    date: '03 Apr 2026',
    deliveryDate: '15 Apr 2026',
    status: 'processing',
    total: '₹2,499',
    eta: 'Packing in progress',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Yet to assign',
    trackingNo: 'Will be generated soon',
    timeline: [
      { label: 'Ordered', time: '03 Apr 2026 • 09:10 AM' },
      { label: 'Shipped', time: '05 Apr 2026 • 12:00 PM' },
      { label: 'Out for delivery', time: '15 Apr 2026 • 09:30 AM' },
      { label: 'Delivered', time: '15 Apr 2026 • 05:30 PM' }
    ],
    items: [
      { title: 'Wedding Kurta Set', qty: 1, size: 'M', price: 2499, image: 'assets/images/product-wedding-main.jpg' }
    ]
  },
  {
    id: 'ECO10931',
    customer: 'Vignesh S',
    date: '28 Mar 2026',
    deliveryDate: 'Cancelled',
    status: 'cancelled',
    total: '₹1,299',
    eta: 'Cancelled and refunded',
    address: '14, South Masi Street, Madurai, Tamil Nadu - 625001',
    courier: 'Not applicable',
    trackingNo: 'Not applicable',
    timeline: [
      { label: 'Ordered', time: '28 Mar 2026 • 11:00 AM' },
      { label: 'Shipped', time: '29 Mar 2026 • 03:30 PM' },
      { label: 'Out for delivery', time: '31 Mar 2026 • 10:00 AM' },
      { label: 'Delivered', time: '31 Mar 2026 • 06:00 PM' }
    ],
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

  const renderSteps = (order) => {
    if (!statusLine) return;
    const activeIndex = getProgressIndex(order.status);
    const progressPercent = order.status === 'cancelled' ? 0 : activeIndex * 25;
    const timeline = Array.isArray(order.timeline) && order.timeline.length === steps.length
      ? order.timeline
      : steps.map((step, index) => {
        const defaultTimes = [
          `${order.date} • 09:00 AM`,
          `${order.date} • 11:30 AM`,
          `${order.deliveryDate || order.eta} • 08:30 AM`,
          `${order.deliveryDate || order.eta} • 06:00 PM`
        ];

        return {
          label: step.label,
          time: defaultTimes[index]
        };
      });

    statusLine.innerHTML = `<div class="status-progress-bar" style="width:${progressPercent}%"></div>${steps.map((step, index) => {
      const isDone = index < activeIndex;
      const isActive = index === activeIndex;
      const stateClass = isDone ? 'done' : (isActive ? 'active' : '');

      return `
        <article class="progress-step ${stateClass}">
          <span class="progress-icon"><i class="fa-solid ${step.icon}"></i></span>
          <span class="progress-dot"></span>
          <span class="progress-label">${step.label}</span>
          <span class="progress-meta">${timeline[index]?.time || ''}</span>
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
    renderSteps(order);
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

function renderAdminOrderListPage() {
  const tableRoot = document.getElementById('adminOrdersRoot');
  if (!tableRoot) return;

  const statusButtons = Array.from(document.querySelectorAll('[data-admin-status]'));
  const searchInput = document.getElementById('adminOrderSearch');
  const paginationRoot = document.getElementById('adminPagination');
  const totalCountNode = document.getElementById('adminStatTotal');
  const deliveredCountNode = document.getElementById('adminStatDelivered');
  const shippedCountNode = document.getElementById('adminStatShipped');
  const pendingCountNode = document.getElementById('adminStatPending');
  const grossRevenueNode = document.getElementById('adminRevenueGross');
  const deliveredRevenueNode = document.getElementById('adminRevenueDelivered');
  const barDelivered = document.getElementById('revBarDelivered');
  const barShipped = document.getElementById('revBarShipped');
  const barProcessing = document.getElementById('revBarProcessing');
  const barCancelled = document.getElementById('revBarCancelled');

  let activeStatus = 'all';
  let query = '';
  let currentPage = 1;
  const pageSize = 4;

  const getFilteredOrders = () => ORDERS_DATA.filter((order) => {
    const statusMatch = activeStatus === 'all' || order.status === activeStatus;
    const queryMatch = !query
      || order.id.toLowerCase().includes(query)
      || (order.customer || '').toLowerCase().includes(query)
      || (order.courier || '').toLowerCase().includes(query)
      || order.status.toLowerCase().includes(query);
    return statusMatch && queryMatch;
  });

  const syncStats = () => {
    const statusTotals = {
      delivered: 0,
      shipped: 0,
      processing: 0,
      cancelled: 0
    };

    ORDERS_DATA.forEach((order) => {
      const value = Number(String(order.total).replace(/[^\d.]/g, '')) || 0;
      if (Object.prototype.hasOwnProperty.call(statusTotals, order.status)) {
        statusTotals[order.status] += value;
      }
    });

    const grossRevenue = statusTotals.delivered + statusTotals.shipped + statusTotals.processing;
    const highestBucket = Math.max(
      statusTotals.delivered,
      statusTotals.shipped,
      statusTotals.processing,
      statusTotals.cancelled,
      1
    );

    if (totalCountNode) totalCountNode.textContent = String(ORDERS_DATA.length);
    if (deliveredCountNode) deliveredCountNode.textContent = String(ORDERS_DATA.filter((order) => order.status === 'delivered').length);
    if (shippedCountNode) shippedCountNode.textContent = String(ORDERS_DATA.filter((order) => order.status === 'shipped').length);
    if (pendingCountNode) pendingCountNode.textContent = String(ORDERS_DATA.filter((order) => order.status === 'processing').length);

    if (grossRevenueNode) grossRevenueNode.textContent = formatPrice(grossRevenue);
    if (deliveredRevenueNode) deliveredRevenueNode.textContent = formatPrice(statusTotals.delivered);

    if (barDelivered) barDelivered.style.width = `${(statusTotals.delivered / highestBucket) * 100}%`;
    if (barShipped) barShipped.style.width = `${(statusTotals.shipped / highestBucket) * 100}%`;
    if (barProcessing) barProcessing.style.width = `${(statusTotals.processing / highestBucket) * 100}%`;
    if (barCancelled) barCancelled.style.width = `${(statusTotals.cancelled / highestBucket) * 100}%`;
  };

  const renderPagination = (totalItems) => {
    if (!paginationRoot) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const pageButtons = Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return `<button type="button" class="admin-page-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
    }).join('');

    paginationRoot.innerHTML = `
      <button type="button" class="admin-page-btn" data-page-nav="prev" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
      ${pageButtons}
      <button type="button" class="admin-page-btn" data-page-nav="next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
    `;
  };

  const render = () => {
    const visibleOrders = getFilteredOrders();
    const totalPages = Math.max(1, Math.ceil(visibleOrders.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * pageSize;
    const pagedOrders = visibleOrders.slice(startIndex, startIndex + pageSize);

    if (visibleOrders.length === 0) {
      tableRoot.innerHTML = `
        <tr>
          <td class="admin-empty" colspan="8">No orders found for the selected filters.</td>
        </tr>
      `;
      renderPagination(0);
      return;
    }

    const rowHtml = pagedOrders.map((order) => {
      const itemCount = order.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

      return `
        <tr>
          <td><strong>${order.id}</strong></td>
          <td>${order.customer || 'Customer'}</td>
          <td>${order.date}</td>
          <td>${order.deliveryDate || order.eta}</td>
          <td>${itemCount}</td>
          <td><span class="admin-badge ${order.status}">${order.status}</span></td>
          <td>${order.total}</td>
          <td><a class="admin-link" href="track-order.html?order=${encodeURIComponent(order.id)}">Track</a></td>
        </tr>
      `;
    }).join('');

    const fillerCount = Math.max(0, pageSize - pagedOrders.length);
    const fillerRows = Array.from({ length: fillerCount }, () => `
      <tr class="admin-row-placeholder" aria-hidden="true">
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    `).join('');

    tableRoot.innerHTML = `${rowHtml}${fillerRows}`;
    renderPagination(visibleOrders.length);
  };

  statusButtons.forEach((button) => {
    button.addEventListener('click', () => {
      statusButtons.forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      activeStatus = button.dataset.adminStatus || 'all';
      currentPage = 1;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      query = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      render();
    });
  }

  if (paginationRoot) {
    paginationRoot.addEventListener('click', (event) => {
      const navButton = event.target.closest('[data-page-nav]');
      const pageButton = event.target.closest('[data-page]');
      const totalPages = Math.max(1, Math.ceil(getFilteredOrders().length / pageSize));

      if (navButton) {
        const direction = navButton.getAttribute('data-page-nav');
        if (direction === 'prev' && currentPage > 1) currentPage -= 1;
        if (direction === 'next' && currentPage < totalPages) currentPage += 1;
        render();
        return;
      }

      if (pageButton) {
        const nextPage = Number(pageButton.getAttribute('data-page')) || 1;
        currentPage = Math.min(Math.max(nextPage, 1), totalPages);
        render();
      }
    });
  }

  syncStats();
  render();
}

renderOrderListPage();
renderTrackPage();
renderAdminOrderListPage();
