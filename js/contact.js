document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill all required fields correctly.';
      status.style.color = '#f8d0c8';
      form.reportValidity();
      return;
    }

    status.textContent = 'Thanks! Your message has been sent successfully.';
    status.style.color = '#d6f0c4';
    form.reset();
  });
});
