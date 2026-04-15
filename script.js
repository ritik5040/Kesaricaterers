/* ===========================
   KESARI CATERS — SCRIPT.JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateNavbar = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120)
        current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current)
        link.classList.add('active');
    });
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('open');
  });

  // Close on link click
  navLinksContainer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksContainer.classList.remove('open');
    });
  });

  /* ── Scroll-reveal with IntersectionObserver ── */
  const revealTargets = document.querySelectorAll(
    '.why-card, .service-card, .food-card, .testimonial-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), Number(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ── Hero particle effect ── */
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 22;

  function createParticle() {
    const p = document.createElement('div');
    const size = Math.random() * 5 + 2;
    const isGold = Math.random() > 0.5;
    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: isGold
        ? `rgba(212,175,55,${Math.random() * 0.5 + 0.2})`
        : `rgba(232,130,26,${Math.random() * 0.4 + 0.15})`,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + 100 + '%',
      animation: `particleDrift ${Math.random() * 14 + 10}s linear ${Math.random() * 8}s infinite`,
      filter: `blur(${Math.random() > 0.6 ? 1 : 0}px)`,
      pointerEvents: 'none',
    });
    particlesContainer.appendChild(p);
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

  /* ── Animated counter for hero stats ── */
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = 16;
    const increment = target / (duration / step);
    const update = () => {
      start = Math.min(start + increment, target);
      el.textContent = Math.floor(start) + (el.dataset.suffix || '+');
      if (start < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const statValues  = [10, 300, 1000, 100];
  const suffixes    = ['+', '+', '+', '%'];
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach((el, i) => {
        el.dataset.suffix = suffixes[i];
        el.textContent = '0' + suffixes[i];
        animateCounter(el, statValues[i]);
      });
      statsObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 76;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth',
      });
    });
  });

  /* ── Contact form ── */
  const form       = document.getElementById('enquiry-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnLoader  = submitBtn?.querySelector('.btn-loader');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      if (!validateForm(form)) return;

      // Loading state
      btnText.style.display  = 'none';
      btnLoader.style.display = 'inline';
      submitBtn.disabled     = true;

      // Simulate submission (replace with Formspree / EmailJS endpoint)
      await new Promise(r => setTimeout(r, 1500));

      // Success
      btnText.style.display  = 'inline';
      btnLoader.style.display = 'none';
      submitBtn.disabled     = false;
      form.reset();
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => { successMsg.style.display = 'none'; }, 7000);
    });
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#EF4444';
        field.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.12)';
        if (valid) field.focus();
        valid = false;
      } else {
        field.style.borderColor = '';
        field.style.boxShadow   = '';
      }
    });
    return valid;
  }

  // Live validation reset on input
  form?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
    });
  });

  /* ── Navbar link hover micro-animation ── */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-1px)';
    });
    link.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  /* ── Service cards stagger reveal ── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = (i * 80) + 'ms';
  });

  /* ── Food cards stagger ── */
  const foodCards = document.querySelectorAll('.food-card');
  foodCards.forEach((card, i) => {
    card.style.transitionDelay = (i * 60) + 'ms';
  });

  /* ── Testimonial cards stagger ── */
  const testCards = document.querySelectorAll('.testimonial-card');
  testCards.forEach((card, i) => {
    card.style.transitionDelay = (i * 80) + 'ms';
  });

  /* ── Set min date for event date field ── */
  const dateField = document.getElementById('event-date');
  if (dateField) {
    const today = new Date().toISOString().split('T')[0];
    dateField.setAttribute('min', today);
  }

  /* ── Parallax subtle on hero ── */
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
      heroContent.style.opacity   = `${1 - scrolled / 700}`;
    }
  }, { passive: true });

});
