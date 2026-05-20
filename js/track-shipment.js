document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trackForm');
  const input = document.getElementById('trackInput');

  if (!form || !input) return;

  const updatePlaceholder = () => {
    const searchBy = form.querySelector('input[name="searchBy"]:checked')?.value || 'order';
    input.placeholder = searchBy === 'order' ? 'Enter Order ID to search' : 'Enter AWB to search';
  };

  // initialize placeholder and bind change handlers to radios
  updatePlaceholder();
  form.querySelectorAll('input[name="searchBy"]').forEach(r => r.addEventListener('change', updatePlaceholder));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    const searchBy = form.querySelector('input[name="searchBy"]:checked')?.value || 'order';

    if (!val) {
      alert('Please enter Order ID or AWB to search');
      input.focus();
      return;
    }

    // Redirect to the existing track page using order query param if searchBy is order
    if (searchBy === 'order') {
      const url = `track-order.html?order=${encodeURIComponent(val)}`;
      window.location.href = url;
      return;
    }

    // AWB: attempt lookup by scanning ORDERS_DATA (if available)
    if (window.ORDERS_DATA) {
      const match = ORDERS_DATA.find(o => (o.trackingNo || '').toLowerCase() === val.toLowerCase());
      if (match) {
        window.location.href = `track-order.html?order=${encodeURIComponent(match.id)}`;
        return;
      }
    }

    alert('No matching shipment found.');
  });
});