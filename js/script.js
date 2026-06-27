/* ==========================================================================
   NAINA KUMARI PORTFOLIO JAVASCRIPT (2026 Standards)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ════════════════════════════════════════════
  // 1. PRELOADER ANIMATION
  // ════════════════════════════════════════════
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }
      // Initialize skills animations when loaded
      animateSkillBars();
    }, 600); // Small delay to let animations sync up
  });

  // Fallback preloader removal in case load event takes too long
  setTimeout(() => {
    if (loader && loader.style.opacity !== '0') {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
  }, 3000);

  // ════════════════════════════════════════════
  // 2. THEME TOGGLE (DARK / LIGHT MODE)
  // ════════════════════════════════════════════
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.remove('light-theme');
  } else {
    body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const activeTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', activeTheme);
    // Restart particles background with new theme colors
    initParticles();
  });

  // ════════════════════════════════════════════
  // 3. STYLED CUSTOM CURSOR (LERPED POSITIONING)
  // ════════════════════════════════════════════
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;

    // Direct cursor dot tracking
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.opacity = '1';
    }

    if (cursor) {
      cursor.style.opacity = '1';
    }
  });

  // Lerp calculation for fluid outer cursor ring delay
  const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

  const animateCursor = () => {
    if (isMoving && cursor) {
      cursorX = lerp(cursorX, mouseX, 0.12);
      cursorY = lerp(cursorY, mouseY, 0.12);
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Hover states expansion for cursor
  const hoverables = document.querySelectorAll('a, button, .filter-btn, .project-card, .floating-icon, .carousel-control, .test-control, .indicator');
  
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      body.classList.add('cursor-hovered');
    });
    item.addEventListener('mouseleave', () => {
      body.classList.remove('cursor-hovered');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorDot) cursorDot.style.opacity = '0';
  });

  // ════════════════════════════════════════════
  // 4. SCROLL PROGRESS INDICATOR & STICKY NAVBAR
  // ════════════════════════════════════════════
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledPercent = (windowScroll / height) * 100;

    // Update scroll progress bar width
    if (scrollProgress) {
      scrollProgress.style.width = `${scrolledPercent}%`;
    }

    // Sticky navbar backdrop-filter trigger
    if (navbar) {
      if (windowScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Section Link Highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (windowScroll >= sectionTop && windowScroll < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });



  // ════════════════════════════════════════════
  // 5. MOBILE MENU INTERACTION
  // ════════════════════════════════════════════
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('#mobile-nav a');

  const toggleMobileMenu = () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    
    // Toggle aria expanded status
    const expanded = hamburger.classList.contains('open') ? 'true' : 'false';
    hamburger.setAttribute('aria-expanded', expanded);
  };

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu on link click
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Close mobile menu if clicked outside
  document.addEventListener('click', (e) => {
    if (mobileNav && mobileNav.classList.contains('open')) {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ════════════════════════════════════════════
  // 6. CANVAS PARTICLES NETWORK BACKGROUND
  // ════════════════════════════════════════════
  const canvas = document.getElementById('particles-canvas');
  let ctx;
  let particlesArray = [];
  let numberOfParticles;

  const initParticles = () => {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Adjust density based on screen resolution
    numberOfParticles = Math.floor((canvas.width * canvas.height) / 14000);
    if (numberOfParticles > 120) numberOfParticles = 120; // Cap to avoid CPU choke

    particlesArray = [];
    const color = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();

    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;

      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  };

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.15; // Soft opacity
      ctx.fill();
    }

    update() {
      // Check borders bounce or wrap
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  // Draw lines connecting close particles
  const connectParticles = () => {
    let opacityValue = 1;
    const color = getComputedStyle(document.body).getPropertyValue('--primary-color').trim();
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
          + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
        
        // Define connection threshold
        if (distance < (canvas.width / 9) * (canvas.height / 9)) {
          opacityValue = 1 - (distance / 15000);
          if (opacityValue < 0) opacityValue = 0;
          
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = opacityValue * 0.08; // Delicate network lines
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  let animationFrameId;
  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connectParticles();
    animationFrameId = requestAnimationFrame(animateParticles);
  };

  if (canvas) {
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    });
  }

  // ════════════════════════════════════════════
  // 7. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-item');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ════════════════════════════════════════════
  // 8. STATS COUNTER ANIMATION
  // ════════════════════════════════════════════
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds animation
      const startTime = performance.now();

      const count = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease out quadratic for smoother end
        const easeProgress = progress * (2 - progress);
        const currentValue = Math.floor(easeProgress * target);

        stat.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(count);
        } else {
          stat.textContent = target; // Ensure exact final target
        }
      };

      requestAnimationFrame(count);
    });
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ════════════════════════════════════════════
  // 9. SKILLS FILTERING SYSTEM & BAR ANIMATION
  // ════════════════════════════════════════════
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillItems = document.querySelectorAll('.skill-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
          // Restart specific progress bar width animation
          const bar = item.querySelector('.skill-bar');
          if (bar) {
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-width');
            }, 50);
          }
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Function to load all progress bars widths on page load
  const animateSkillBars = () => {
    const bars = document.querySelectorAll('.skill-bar');
    bars.forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  };

  // ════════════════════════════════════════════
  // 10. CERTIFICATIONS CAROUSEL SYSTEM
  // ════════════════════════════════════════════
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.carousel-control.next');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const indicatorsContainer = document.querySelector('.carousel-indicators');

  if (track && slides.length > 0) {
    let currentSlideIndex = 0;
    
    // Create dots indicator
    const createIndicators = () => {
      indicatorsContainer.innerHTML = '';
      const visibleSlidesCount = slides.length;
      
      for (let i = 0; i < visibleSlidesCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('indicator-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        
        dot.addEventListener('click', () => {
          moveToSlide(i);
        });
        
        indicatorsContainer.appendChild(dot);
      }
    };

    const moveToSlide = (index) => {
      currentSlideIndex = index;
      const amountToMove = slides[index].offsetLeft;

      track.style.transform = `translateX(-${amountToMove}px)`;

      // Update dots indicators
      const dots = Array.from(indicatorsContainer.querySelectorAll('.indicator-dot'));
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) {
        dots[index].classList.add('active');
      }

      // Toggle controls disabled statuses
      if (prevBtn && nextBtn) {
        prevBtn.style.opacity = index === 0 ? '0.5' : '1';
        prevBtn.style.pointerEvents = index === 0 ? 'none' : 'auto';
        
        const totalPages = slides.length;
        nextBtn.style.opacity = index === totalPages - 1 ? '0.5' : '1';
        nextBtn.style.pointerEvents = index === totalPages - 1 ? 'none' : 'auto';
      }
    };

    createIndicators();
    moveToSlide(0);

    // Event listeners
    nextBtn.addEventListener('click', () => {
      const totalPages = slides.length;
      if (currentSlideIndex < totalPages - 1) {
        moveToSlide(currentSlideIndex + 1);
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 0) {
        moveToSlide(currentSlideIndex - 1);
      }
    });

    // Handle screen resize to rebuild indicators
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        track.style.transform = 'translateX(0px)';
        createIndicators();
        moveToSlide(0);
      }, 100);
    });

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const totalPages = slides.length;
      
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe Left -> Next
        if (currentSlideIndex < totalPages - 1) moveToSlide(currentSlideIndex + 1);
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe Right -> Prev
        if (currentSlideIndex > 0) moveToSlide(currentSlideIndex - 1);
      }
    };
  }

  // ════════════════════════════════════════════
  // 12. CONTACT FORM SUBMISSION HANDLER
  // ════════════════════════════════════════════
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success');
  const successCloseBtn = document.getElementById('success-close-btn');

  if (contactForm && successOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Block standard redirect

      const submitBtn = contactForm.querySelector('.submit-btn');
      const submitText = submitBtn.querySelector('span');
      const submitIcon = submitBtn.querySelector('i');

      // Change button to sending state
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.8';
      submitText.textContent = 'Sending Message...';
      if (submitIcon) {
        submitIcon.setAttribute('data-lucide', 'loader-2');
        submitIcon.classList.add('animate-spin'); // spin effect handled in CSS or via class
        lucide.createIcons();
      }

      // Simulate network request duration
      setTimeout(() => {
        successOverlay.classList.add('show');
        
        // Open LinkedIn in a new tab
        window.open('https://www.linkedin.com/in/naina-kumari-iitp?utm_source=share_via&utm_content=profile&utm_medium=member_android', '_blank');
        
        // Reset form inputs
        contactForm.reset();
        
        // Reset submit button state
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = '1';
        submitText.textContent = 'Send Message';
        if (submitIcon) {
          submitIcon.setAttribute('data-lucide', 'send');
          submitIcon.classList.remove('animate-spin');
          lucide.createIcons();
        }
      }, 1200);
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', () => {
        successOverlay.classList.remove('show');
      });
    }
  }

  // Magnetic Button Effect helper
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (magneticButtons.length > 0 && window.innerWidth > 1024) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const bounding = btn.getBoundingClientRect();
        const x = e.clientX - bounding.left - bounding.width / 2;
        const y = e.clientY - bounding.top - bounding.height / 2;
        
        // Translate button position relative to cursor
        btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        // Reset translate position
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

});
