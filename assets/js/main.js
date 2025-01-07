'use strict';

// DOM Element Selectors
const selectors = {
  navbar: '#navbar',
  header: '#header',
  topbar: '#topbar',
  backToTop: '.back-to-top',
  heroCarousel: '#heroCarousel',
  menuContainer: '.menu-container',
  mobileNavToggle: '.mobile-nav-toggle'
};

/**
 * Utility function to select DOM elements
 * @param {string} el - The selector string
 * @param {boolean} all - Whether to select all elements or just the first one
 * @returns {Element|NodeList} - The selected element(s)
 */
const select = (el, all = false) => {
  el = el.trim();
  return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
};

/**
 * Attach event listener with optional multiple element support
 * @param {string} type - Event type
 * @param {string} el - Element selector
 * @param {Function} listener - Event listener callback
 * @param {boolean} all - Whether to attach to all matching elements
 */
const on = (type, el, listener, all = false) => {
  const selectEl = select(el, all);
  if (!selectEl) return;

  if (all) {
    selectEl.forEach(e => e.addEventListener(type, listener, { passive: true }));
  } else {
    selectEl.addEventListener(type, listener, { passive: true });
  }
};

/**
 * Handles scrolling to elements with header offset
 * @param {string} el - Element selector to scroll to
 */
const scrollTo = (el) => {
  const header = select('#header');
  const offset = header.offsetHeight;
  const elementPos = select(el).offsetTop;

  window.scrollTo({
    top: elementPos - offset,
    behavior: 'smooth'
  });
};

/**
 * Initialize navbar functionality
 */
const initNavbar = () => {
  // Mobile nav toggle
  on('click', '.mobile-nav-toggle', function (e) {
    select(selectors.navbar).classList.toggle('navbar-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  // Mobile nav dropdowns
  on('click', '.navbar .dropdown > a', function (e) {
    if (select(selectors.navbar).classList.contains('navbar-mobile')) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle('dropdown-active');
    }
  }, true);

  // Handle scroll-to links
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      scrollTo(this.hash);
    }
  }, true);
};

/**
 * Initialize scroll-based functionality
 */
const initScrollFunctions = () => {
  const navbarlinks = select('#navbar .scrollto', true);

  // Navbar links active state on scroll
  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      const section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };

  // Header scroll class
  const headerScrolled = () => {
    const selectHeader = select(selectors.header);
    const selectTopbar = select(selectors.topbar);

    if (window.scrollY > 100) {
      selectHeader?.classList.add('header-scrolled');
      selectTopbar?.classList.add('topbar-scrolled');
    } else {
      selectHeader?.classList.remove('header-scrolled');
      selectTopbar?.classList.remove('topbar-scrolled');
    }
  };

  // Back to top button
  const toggleBacktotop = () => {
    const backtotop = select(selectors.backToTop);
    if (!backtotop) return;

    if (window.scrollY > 100) {
      backtotop.classList.add('active');
    } else {
      backtotop.classList.remove('active');
    }
  };

  // Attach scroll event listeners with passive flag
  window.addEventListener('scroll', navbarlinksActive, { passive: true });
  window.addEventListener('scroll', headerScrolled, { passive: true });
  window.addEventListener('scroll', toggleBacktotop, { passive: true });
};

/**
 * Initialize carousel indicators
 */
const initCarouselIndicators = () => {
  const heroCarouselIndicators = select("#hero-carousel-indicators");
  const heroCarouselItems = select('#heroCarousel .carousel-item', true);

  heroCarouselItems.forEach((item, index) => {
    const indicator = (index === 0)
      ? `<li data-bs-target='#heroCarousel' data-bs-slide-to='${index}' class='active'></li>`
      : `<li data-bs-target='#heroCarousel' data-bs-slide-to='${index}'></li>`;
    heroCarouselIndicators.innerHTML += indicator;
  });
};

/**
 * Initialize menu isotope and filter
 */
const initMenuIsotope = () => {
  const menuContainer = select(selectors.menuContainer);
  if (!menuContainer) return;

  const menuIsotope = new Isotope(menuContainer, {
    itemSelector: '.menu-item',
    layoutMode: 'fitRows'
  });

  const menuFilters = select('#menu-flters li', true);
  on('click', '#menu-flters li', function (e) {
    e.preventDefault();
    menuFilters.forEach(el => el.classList.remove('filter-active'));
    this.classList.add('filter-active');

    menuIsotope.arrange({
      filter: this.getAttribute('data-filter')
    });
  }, true);
};

/**
 * Initialize Swiper sliders
 */
const initSwipers = () => {
  new Swiper('.events-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
};

/**
 * Initialize GLightbox
 */
const initGLightbox = () => {
  const galleryLightbox = GLightbox({
    selector: '.gallery-lightbox'
  });
};

/**
 * Initialize all functions on window load
 */
window.addEventListener('load', () => {
  initNavbar();
  initScrollFunctions();
  initCarouselIndicators();
  initMenuIsotope();
  initSwipers();
  initGLightbox();

  // Handle hash links on load
  if (window.location.hash) {
    if (select(window.location.hash)) {
      scrollTo(window.location.hash);
    }
  }
}, { passive: true });