document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('productModal');
  const modalImg = document.getElementById('modalImg');
  const modalName = document.getElementById('modalName');
  const modalPrice = document.getElementById('modalPrice');
  const closeBtn = document.querySelector('.modal-close');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const contactForm = document.getElementById('contactForm');

  const currentUser = getCurrentUser();
  renderUserNav(currentUser);

  if (modal && modalImg && modalName && modalPrice && closeBtn) {
    function openModal(name, price, img) {
      modalImg.src = img;
      modalImg.alt = name;
      modalName.textContent = name;
      modalPrice.textContent = price;
      modal.setAttribute('aria-hidden', 'false');
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

