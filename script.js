document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  const modalImg = document.getElementById('modalImg');
  const modalName = document.getElementById('modalName');
  const modalPrice = document.getElementById('modalPrice');
  const closeBtn = document.querySelector('.modal-close');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const contactForm = document.getElementById('contactForm');
  const paymentForm = document.getElementById('paymentForm');
  const paymentInstructions = document.getElementById('paymentInstructions');
  const paymentNotice = document.getElementById('paymentNotice');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const amountInput = paymentForm ? paymentForm.querySelector('input[name="amount"]') : null;
  const productInput = paymentForm ? paymentForm.querySelector('input[name="product"]') : null;
  const paymentMethod = paymentForm ? paymentForm.querySelector('select[name="method"]') : null;

  const currentUser = getCurrentUser();
  renderUserNav(currentUser);

  function updatePaymentInstructions(method) {
    if (!paymentInstructions) return;
    const instructions = {
      mpesa: 'Send the amount to Paybill 123456 and use account STINKK. Save the transaction code and share it via Contact or email.',
      bank: 'Transfer to KCB account 0012345678 in the name STINKK CUSTOMZ. Use the product name as the payment reference.',
      airtel: 'Send the amount to Airtel Money number 0700 000 000. Use the product name in your payment notes.',
      '': 'Choose a payment method to see instructions.'
    };
    paymentInstructions.textContent = instructions[method] || instructions[''];
  }

  function setCheckoutProduct(name, price) {
    if (productInput) productInput.value = name;
    if (amountInput) amountInput.value = price;
    if (paymentNotice) {
      paymentNotice.classList.add('hidden');
      paymentNotice.textContent = '';
    }
    if (paymentForm && paymentForm.querySelector('input[name="payerName"]')) {
      paymentForm.querySelector('input[name="payerName"]').focus();
    }
  }

  if (paymentMethod) {
    paymentMethod.addEventListener('change', () => {
      updatePaymentInstructions(paymentMethod.value);
    });
  }

  if (modal && modalImg && modalName && modalPrice && closeBtn) {
    function openModal(name, price, img) {
      modalImg.src = img;
      modalImg.alt = name;
      modalName.textContent = name;
      modalPrice.textContent = price;
      modal.setAttribute('aria-hidden', 'false');
      if (buyNowBtn) {
        buyNowBtn.dataset.productName = name;
        buyNowBtn.dataset.productPrice = price;
      }
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.card .view').forEach(btn => {
      btn.addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (!card) return;
        openModal(card.dataset.name, card.dataset.price, card.dataset.img);
      });
    });

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', () => {
        const name = buyNowBtn.dataset.productName || modalName.textContent;
        const price = buyNowBtn.dataset.productPrice || modalPrice.textContent;
        setCheckoutProduct(name, price);
        document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const email = (formData.get('email') || '').toString().trim().toLowerCase();
      const password = (formData.get('password') || '').toString();

      if (!email || !password) {
        alert('Please enter your email and password.');
        return;
      }

      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        alert('Invalid credentials. Please check your email and password.');
        return;
      }

      setCurrentUser(user);
      location.href = 'index.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim().toLowerCase();
      const password = (formData.get('password') || '').toString();

      if (!name || !email || !password) {
        alert('Please complete all fields.');
        return;
      }

      const users = getUsers();
      const existing = users.find(u => u.email === email);
      if (existing) {
        alert('An account with this email already exists. Please login instead.');
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);
      setCurrentUser(newUser);
      location.href = 'index.html';
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const message = contactForm.querySelector('textarea[name="message"]').value.trim();
      const greeting = currentUser ? currentUser.name : 'there';
      if (!name || !message) {
        alert('Please fill in your name and message before sending.');
        return;
      }
      alert(`Thanks ${greeting}! Your message has been received. We’ll reply shortly.`);
      contactForm.reset();
    });
  }

  if (paymentForm) {
    paymentForm.addEventListener('submit', e => {
      e.preventDefault();
      const payerName = paymentForm.querySelector('input[name="payerName"]').value.trim();
      const payerEmail = paymentForm.querySelector('input[name="payerEmail"]').value.trim();
      const payerPhone = paymentForm.querySelector('input[name="payerPhone"]').value.trim();
      const method = paymentMethod ? paymentMethod.value : '';
      const product = productInput ? productInput.value.trim() : '';
      const amount = amountInput ? amountInput.value.trim() : '';

      if (!payerName || !payerEmail || !payerPhone || !method) {
        alert('Please complete all payment fields and choose a method.');
        return;
      }
      if (!product || !amount) {
        alert('Select a product first with Buy Now, then submit payment details.');
        return;
      }

      const methodLabel = method === 'mpesa' ? 'Mpesa' : method === 'bank' ? 'Bank Transfer' : 'Airtel Money';
      const instructions = method === 'mpesa'
        ? 'Paybill 123456, Account STINKK. Keep your Mpesa confirmation code.'
        : method === 'bank'
          ? 'KCB Account 0012345678, STINKK CUSTOMZ. Use product name as reference.'
          : 'Airtel Money number 0700 000 000. Use product name in notes.';

      if (paymentNotice) {
        paymentNotice.classList.remove('hidden');
        paymentNotice.textContent = `Payment ready: ${product} for ${amount} via ${methodLabel}. ${instructions} Once you have completed the transfer, send your proof via the Contact section or email.`;
      }
      paymentForm.reset();
      if (productInput) productInput.value = '';
      if (amountInput) amountInput.value = '';
      updatePaymentInstructions('');
    });
  }
});

function getUsers() {
  const stored = localStorage.getItem('stinkkUsers');
  try {
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem('stinkkUsers', JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem('stinkkCurrentUser', JSON.stringify(user));
}

function getCurrentUser() {
  const stored = localStorage.getItem('stinkkCurrentUser');
  try {
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem('stinkkCurrentUser');
  location.href = 'index.html';
}

function formatCurrency(value) {
  return value.toString().trim().startsWith('KSH') ? value : `KSH ${value}`;
}

function renderUserNav(user) {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const loginLink = nav.querySelector('a[href="login.html"]');
  const signupLink = nav.querySelector('a[href="signup.html"]');
  const logoutLink = nav.querySelector('a[href="#logout"]');
  const userLink = nav.querySelector('a[href="#user"]');

  if (loginLink) loginLink.remove();
  if (signupLink) signupLink.remove();
  if (logoutLink) logoutLink.remove();
  if (userLink) userLink.remove();

  if (user) {
    const nameLabel = user.name || user.email.split('@')[0];
    const profileLink = document.createElement('a');
    profileLink.href = '#user';
    profileLink.textContent = `Hi, ${nameLabel}`;
    profileLink.classList.add('auth-added');

    const logout = document.createElement('a');
    logout.href = '#logout';
    logout.textContent = 'Logout';
    logout.classList.add('auth-added');
    logout.addEventListener('click', e => {
      e.preventDefault();
      logoutUser();
    });

    nav.appendChild(profileLink);
    nav.appendChild(logout);
  } else {
    if (!loginLink) {
      const login = document.createElement('a');
      login.href = 'login.html';
      login.textContent = 'Login';
      nav.appendChild(login);
    } else {
      nav.appendChild(loginLink);
    }
    if (!signupLink) {
      const signup = document.createElement('a');
      signup.href = 'signup.html';
      signup.textContent = 'Sign Up';
      nav.appendChild(signup);
    } else {
      nav.appendChild(signupLink);
    }
  }
}

