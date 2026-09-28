// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Header shadow on scroll =====
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  siteHeader.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== Before / After Sliders =====
document.querySelectorAll('.ba-slider').forEach(slider => {
  const range = slider.querySelector('.ba-range');
  const before = slider.querySelector('.ba-before');
  const handle = slider.querySelector('.ba-handle');

  const update = (value) => {
    // 'before' is painted on top, so clip it to reveal 'after' underneath
    before.style.clipPath = `inset(0 0 0 ${value}%)`;
    handle.style.left = `${value}%`;
  };

  range.addEventListener('input', (e) => update(e.target.value));
  update(range.value);
});

// ===== Testimonial Carousel =====
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('testimonialDots');
const cards = track.querySelectorAll('.testimonial-card');
let currentSlide = 0;
let autoplayTimer;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('button');

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * track.parentElement.clientWidth}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  resetAutoplay();
}

function nextSlide() {
  goToSlide((currentSlide + 1) % cards.length);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextSlide, 6000);
}

window.addEventListener('resize', () => {
  track.style.transform = `translateX(-${currentSlide * track.parentElement.clientWidth}px)`;
});

resetAutoplay();

// ===== Booking Form Validation =====
const bookingForm = document.getElementById('bookingForm');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  fullName: (value) => value.trim().length >= 2 || 'Please enter your full name.',
  contact: (value) => {
    const phonePattern = /^(\+63|0)9\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleaned = value.trim().replace(/\s+/g, '');
    if (phonePattern.test(cleaned) || emailPattern.test(value.trim())) return true;
    return 'Enter a valid PH phone number or email address.';
  },
  service: (value) => value !== '' || 'Please select a service.',
  propertyType: (value) => value !== '' || 'Please select a property type.',
  preferredDate: (value) => {
    if (!value) return 'Please choose a preferred date.';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(value);
    return selected >= today || 'Please choose a date from today onward.';
  },
  preferredTime: (value) => value !== '' || 'Please select a preferred time.'
};

function showFieldError(field, message) {
  field.classList.add('invalid');
  const errorEl = bookingForm.querySelector(`.form-error[data-error-for="${field.name}"]`);
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(field) {
  field.classList.remove('invalid');
  const errorEl = bookingForm.querySelector(`.form-error[data-error-for="${field.name}"]`);
  if (errorEl) errorEl.textContent = '';
}

function validateField(field) {
  const validator = validators[field.name];
  if (!validator) return true;
  const result = validator(field.value);
  if (result === true) {
    clearFieldError(field);
    return true;
  }
  showFieldError(field, result);
  return false;
}

Object.keys(validators).forEach(name => {
  const field = bookingForm.elements[name];
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('invalid')) validateField(field);
  });
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  Object.keys(validators).forEach(name => {
    const field = bookingForm.elements[name];
    if (!validateField(field)) isValid = false;
  });

  if (!isValid) {
    const firstInvalid = bookingForm.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Simulated submission (no backend). Replace with a real API call when available.
  formSuccess.hidden = false;
  bookingForm.reset();
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => { formSuccess.hidden = true; }, 8000);
});

// Prevent selecting a past date in the date picker
const dateInput = document.getElementById('preferredDate');
dateInput.min = new Date().toISOString().split('T')[0];
