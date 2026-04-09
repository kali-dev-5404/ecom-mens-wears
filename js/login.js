function togglePass(id, btn) {
  const inp = document.getElementById(id);
  const icon = btn.querySelector('i');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    inp.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

function setLoginMode(mode) {
  const emailPanel = document.getElementById('emailModePanel');
  const phonePanel = document.getElementById('phoneModePanel');
  const buttons = document.querySelectorAll('.method-btn');

  buttons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  emailPanel.classList.toggle('active', mode === 'email');
  phonePanel.classList.toggle('active', mode === 'phone');
}

function sendOtp() {
  const phoneInput = document.getElementById('loginPhone').value.trim();
  if (phoneInput) {
    alert('OTP sent to +91' + phoneInput);
  }
}

const loginForm = document.querySelector('.login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('ecomLoggedIn', 'true');
    document.location.href = 'index.html';
  });
}

window.togglePass = togglePass;
window.setLoginMode = setLoginMode;
window.sendOtp = sendOtp;
