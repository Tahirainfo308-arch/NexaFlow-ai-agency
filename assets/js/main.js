/* ============================================
   NexaFlow AI - Main JavaScript
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     MOUSE GLOW EFFECT
     ========================================== */
  const glow = document.querySelector('.mouse-glow');
  if (glow) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* ==========================================
     NAVBAR
     ========================================== */
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.navbar-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* ==========================================
     SCROLL REVEAL ANIMATIONS
     ========================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  initScrollReveal();

  /* ==========================================
     COUNTER ANIMATION
     ========================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const text = counter.textContent;
          const value = parseFloat(text.replace(/[^0-9.]/g, ''));
          const suffix = text.replace(/[0-9.]/g, '');
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            current = Math.min(increment * step, value);
            if (suffix === '+') {
              counter.textContent = Math.floor(current) + suffix;
            } else if (suffix === 'K+') {
              counter.textContent = Math.floor(current) + 'K+';
            } else if (suffix === '%') {
              counter.textContent = Math.floor(current) + '%';
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }

            if (current >= value) {
              clearInterval(timer);
              counter.textContent = text;
            }
          }, duration / steps);

          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  initCounters();

  /* ==========================================
     TESTIMONIALS SLIDER
     ========================================== */
  function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    function goToSlide(index) {
      if (index < 0) index = totalCards - 1;
      if (index >= totalCards) index = 0;
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    // Auto-play
    let autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);

    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
      sliderContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
      });
    }
  }

  initTestimonialSlider();

  /* ==========================================
     LOGO CAROUSEL (Infinite Scroll)
     ========================================== */
  function initLogoCarousel() {
    const carousel = document.querySelector('.logo-carousel');
    if (!carousel) return;

    const logos = carousel.querySelectorAll('.logo-item');
    if (logos.length === 0) return;

    // Clone logos for seamless scroll effect
    logos.forEach(logo => {
      const clone = logo.cloneNode(true);
      carousel.appendChild(clone);
    });
  }

  initLogoCarousel();

  /* ==========================================
     CASE STUDIES FILTERING
     ========================================== */
  function initCaseFilters() {
    const filters = document.querySelectorAll('.case-filter');
    const cards = document.querySelectorAll('.case-card');

    if (filters.length === 0) return;

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.getAttribute('data-filter');

        cards.forEach(card => {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = '';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  initCaseFilters();

  /* ==========================================
     MODAL
     ========================================== */
  function initModal() {
    const modalOverlay = document.getElementById('caseModal');
    const modalClose = document.querySelector('.modal-close');
    const caseCards = document.querySelectorAll('.case-card');

    if (!modalOverlay || !modalClose) return;

    const caseData = {
      'SaaSFlow': {
        category: 'AI',
        title: 'AI-Powered Customer Support Automation',
        client: 'SaaSFlow Technologies',
        challenge: 'SaaSFlow was handling over 10,000 customer support tickets monthly with a team of 15 agents, leading to long response times and high operational costs.',
        solution: 'We built a custom AI agent using GPT-4 that could handle 80% of common inquiries automatically, with seamless escalation to human agents for complex issues.',
        results: [
          { value: '80%', label: 'Automation Rate' },
          { value: '3x', label: 'Faster Response' },
          { value: '60%', label: 'Cost Reduction' }
        ]
      },
      'EcoShop': {
        category: 'Automation',
        title: 'E-commerce Workflow Automation',
        client: 'EcoShop Marketplace',
        challenge: 'EcoShop was manually processing orders, inventory updates, and customer communications across multiple channels, causing delays and errors.',
        solution: 'We implemented a comprehensive automation system connecting their Shopify store, warehouse management, and email marketing platforms.',
        results: [
          { value: '99.9%', label: 'Order Accuracy' },
          { value: '40hrs', label: 'Saved Weekly' },
          { value: '200%', label: 'Growth Capacity' }
        ]
      },
      'GrowthLab': {
        category: 'Growth',
        title: 'SaaS Growth & Revenue Optimization',
        client: 'GrowthLab Analytics',
        challenge: 'GrowthLab had a great product but struggled with user acquisition, onboarding, and retention. Their manual outreach was inefficient and unscalable.',
        solution: 'We designed automated email sequences, in-app onboarding flows, and AI-driven personalized recommendations that boosted engagement.',
        results: [
          { value: '150%', label: 'Revenue Growth' },
          { value: '4x', label: 'User Retention' },
          { value: '12K', label: 'New Users/Month' }
        ]
      },
      'CloudBase': {
        category: 'SaaS',
        title: 'Custom SaaS Platform Development',
        client: 'CloudBase Technologies',
        challenge: 'CloudBase needed a custom SaaS platform for managing cloud infrastructure but lacked the in-house expertise to build it from scratch.',
        solution: 'We developed a fully-featured SaaS platform with multi-tenancy, subscription billing, real-time monitoring dashboards, and API integrations.',
        results: [
          { value: '$2.5M', label: 'ARR Achieved' },
          { value: '500+', label: 'Enterprise Clients' },
          { value: '99.9%', label: 'Platform Uptime' }
        ]
      },
      'MediCare': {
        category: 'AI',
        title: 'AI-Driven Patient Scheduling System',
        client: 'MediCare Health',
        challenge: 'MediCare was losing patients due to long hold times and complex scheduling processes. Staff spent hours on phone calls and manual coordination.',
        solution: 'We deployed an AI chatbot and intelligent scheduling system that handles appointments, reminders, rescheduling, and FAQs 24/7.',
        results: [
          { value: '70%', label: 'Auto-Scheduled' },
          { value: '24/7', label: 'AI Availability' },
          { value: '50%', label: 'Admin Cost Cut' }
        ]
      },
      'FinSecure': {
        category: 'Automation',
        title: 'Financial Reporting Automation',
        client: 'FinSecure Advisors',
        challenge: 'FinSecure spent 80+ hours per month on manual data consolidation and report generation across multiple financial platforms.',
        solution: 'We built automated data pipelines, custom reporting dashboards, and scheduled distribution workflows using Python and cloud functions.',
        results: [
          { value: '95%', label: 'Time Saved' },
          { value: 'Real-time', label: 'Data Accuracy' },
          { value: '$180K', label: 'Annual Savings' }
        ]
      }
    };

    function openModal(card) {
      const clientName = card.querySelector('.client-name').textContent;
      const data = caseData[clientName];

      if (!data) return;

      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalClient').textContent = data.client;
      document.getElementById('modalChallenge').textContent = data.challenge;
      document.getElementById('modalSolution').textContent = data.solution;

      const resultsContainer = document.getElementById('modalResults');
      resultsContainer.innerHTML = data.results.map(r => `
        <div class="modal-result-item">
          <h5>${r.value}</h5>
          <p>${r.label}</p>
        </div>
      `).join('');

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    caseCards.forEach(card => {
      card.addEventListener('click', () => openModal(card));
    });

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }

  initModal();

  /* ==========================================
     FAQ ACCORDION
     ========================================== */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all FAQs
        faqItems.forEach(faq => faq.classList.remove('active'));

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  initFAQ();

  /* ==========================================
     PRICING TOGGLE
     ========================================== */
  function initPricingToggle() {
    const toggle = document.querySelector('.toggle-switch');
    const labels = document.querySelectorAll('.pricing-toggle label');
    const prices = document.querySelectorAll('.price-amount');

    if (!toggle || prices.length === 0) return;

    const monthlyPrices = ['$499', '$999', 'Custom'];
    const yearlyPrices = ['$4,999', '$9,999', 'Custom'];

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const isYearly = toggle.classList.contains('active');

      labels.forEach(label => {
        label.classList.toggle('active', 
          (isYearly && label.textContent === 'Yearly') ||
          (!isYearly && label.textContent === 'Monthly')
        );
      });

      const priceList = isYearly ? yearlyPrices : monthlyPrices;
      prices.forEach((el, i) => {
        el.textContent = priceList[i];
      });
    });
  }

  initPricingToggle();

  /* ==========================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================
     CONTACT FORM HANDLING
     ========================================== */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #00FFB2, #00E5FF)';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }, 1500);
    });
  }

  /* ==========================================
     CHART ANIMATIONS (Case Studies page)
     ========================================== */
  function initCharts() {
    const bars = document.querySelectorAll('.chart-container .bar');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const bars = container.querySelectorAll('.bar');
          bars.forEach((bar, index) => {
            const height = bar.getAttribute('data-height') || '50%';
            setTimeout(() => {
              bar.style.height = height;
              bar.style.opacity = '1';
            }, index * 100);
          });
          observer.unobserve(container);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.chart-container').forEach(container => {
      container.querySelectorAll('.bar').forEach(bar => {
        const height = bar.getAttribute('data-height');
        if (height) {
          bar.style.height = '0%';
          bar.style.opacity = '0';
          bar.style.transition = 'height 0.6s ease, opacity 0.6s ease';
        }
      });
      observer.observe(container);
    });
  }

  initCharts();

  /* ==========================================
     DOUGHNUT CHART (Canvas-based)
     ========================================== */
  function initDoughnutChart() {
    const canvas = document.getElementById('doughnutCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;
    const lineWidth = 30;

    const segments = [
      { label: 'AI Automation', percent: 45, color: '#00E5FF' },
      { label: 'SaaS', percent: 25, color: '#7C3AED' },
      { label: 'Growth', percent: 20, color: '#00FFB2' },
      { label: 'Other', percent: 10, color: '#94A3B8' }
    ];

    function drawChart() {
      ctx.clearRect(0, 0, width, height);
      let startAngle = -Math.PI / 2;
      const total = segments.reduce((sum, s) => sum + s.percent, 0);

      segments.forEach(seg => {
        const sliceAngle = (seg.percent / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.strokeStyle = seg.color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        startAngle += sliceAngle;
      });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          drawChart();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    // Draw immediately if already visible
    const rect = canvas.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      drawChart();
    } else {
      observer.observe(canvas);
    }
  }

  initDoughnutChart();

  /* ==========================================
     PARALLAX FLOATING ELEMENTS
     ========================================== */
  document.addEventListener('mousemove', (e) => {
    const elements = document.querySelectorAll('.floating-element');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    elements.forEach((el, index) => {
      const speed = (index + 1) * 10;
      const moveX = (x - 0.5) * speed;
      const moveY = (y - 0.5) * speed;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  /* ==========================================
     ACTIVE NAV ON SCROLL (per-page)
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) {
          current = section.getAttribute('id');
        }
      });

      navLinks.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ==========================================
     THEME TOGGLE (Light / Dark)
     ========================================== */
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('nexaflow-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '&#9788;' : '&#9790;';

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nexaflow-theme', next);
      themeToggle.innerHTML = next === 'dark' ? '&#9788;' : '&#9790;';
    });
  }

  /* ==========================================
     PAGE LOAD ANIMATION
     ========================================== */
  document.body.classList.add('loaded');

  // Initial fade-in for hero
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-buttons, .hero-stats, .hero-visual');
  heroElements.forEach(el => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity = '1';
    }, 100);
  });

});
