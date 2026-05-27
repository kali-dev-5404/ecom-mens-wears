document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');

  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill all required fields correctly.';
      status.classList.add('is-error');
      status.classList.remove('is-success');
      form.reportValidity();
      return;
    }

    status.textContent = 'Thanks! Your message has been sent successfully.';
    status.classList.add('is-success');
    status.classList.remove('is-error');
    form.reset();
  });
});
