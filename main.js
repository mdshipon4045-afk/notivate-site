/* =========================================================
   main.js — Navbar, Scroll, Hamburger, FAQ, Scroll Reveal
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load
  }

  // ── Active nav link (highlight current page) ──────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Sliding nav pill + magnetic hover ─────────────────
  const navLinks = document.getElementById('nav-links');
  if (navLinks) {
    const links = Array.from(navLinks.querySelectorAll('a'));
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    navLinks.prepend(pill);

    let activeLink = links.find(link => link.classList.contains('active')) || links[0] || null;

    const movePill = target => {
      if (!target) return;
      const navRect = navLinks.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const x = targetRect.left - navRect.left;

      pill.style.width = `${targetRect.width}px`;
      pill.style.transform = `translateX(${x}px)`;
      pill.classList.add('visible');
    };

    const resetMagnetic = link => {
      link.style.transform = 'translate3d(0, 0, 0)';
    };

    links.forEach(link => {
      link.addEventListener('mouseenter', () => movePill(link));

      link.addEventListener('mousemove', e => {
        const rect = link.getBoundingClientRect();
        const strength = 0.18;
        const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
        link.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      link.addEventListener('mouseleave', () => resetMagnetic(link));
      link.addEventListener('focus', () => movePill(link));
    });

    navLinks.addEventListener('mouseleave', () => {
      movePill(activeLink);
      links.forEach(resetMagnetic);
    });

    window.addEventListener('resize', () => movePill(activeLink));
    requestAnimationFrame(() => movePill(activeLink));
  }

  // ── Hamburger menu ────────────────────────────────────
  const burger    = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.setAttribute('aria-expanded', 'false');

    const closeMobileNav = () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    };
    const openMobileNav = () => {
      burger.classList.add('open');
      mobileNav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    };

    burger.addEventListener('click', () => {
      burger.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });

    // Close when a nav link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (mobileNav.classList.contains('open') &&
          !navbar.contains(e.target) &&
          !mobileNav.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileNav();
        burger.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMobileNav();
      }
    });
  }

  // ── Smooth scroll for anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id     = this.getAttribute('href');
      const target = document.querySelector(id);
      if (target && id !== '#') {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
                              .getPropertyValue('--nav-height')) || 70;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── FAQ Accordion ────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item   = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      // Open clicked item if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Scroll Reveal Animation ───────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length > 0) {

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach((el, i) => {
      // Cap stagger at 5 items so it doesn't feel sluggish in large grids
      const stagger = Math.min(i % 6, 5) * 0.09;
      el.style.setProperty('--reveal-delay', `${stagger}s`);
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything immediately
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // ── "New purchase" toast auto-hide ───────────────────
  const toast = document.querySelector('.hero-toast');
  if (toast) {
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      toast.style.opacity    = '0';
      toast.style.transform  = 'translateY(8px)';
    }, 5000);
  }

});
