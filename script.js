document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. STICKY HEADER & SCROLL TO TOP
     ========================================================================== */
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     2. MOBILE MENU TOGGLE
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active');
    
    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => span.style.transform = 'none');
      spans[1].style.opacity = '1';
    });
  });

  /* ==========================================================================
     3. ACTIVE NAVIGATION LINK ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. SERVICES CATEGORY FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Hide card first with transform scale out
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(10px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || filterValue === cardCategory) {
            card.style.display = 'flex';
            // Trigger redraw/reflow
            card.offsetHeight; 
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const timelineItems = document.querySelectorAll('.timeline-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Timeline-specific observer for incremental trigger
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.25
  });

  timelineItems.forEach(item => timelineObserver.observe(item));

  /* ==========================================================================
     6. STATS COUNTER ANIMATION
     ========================================================================== */
  const statsSection = document.getElementById('statistics');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1500; // 1.5 seconds duration
    const stepTime = Math.abs(Math.floor(duration / target));
    let current = 0;
    
    // Adjust increments for larger numbers to run smoothly
    const increment = target > 1000 ? Math.ceil(target / 100) : 1;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + (target === 100 ? '%' : '+');
        clearInterval(timer);
      } else {
        el.textContent = current + '+';
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        statNumbers.forEach(num => countUp(num));
        animated = true; // Trigger only once
        statsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     7. CUSTOMER TESTIMONIALS SLIDER
     ========================================================================== */
  const track = document.getElementById('testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  const dotsContainer = document.getElementById('testimonial-dots');
  
  let currentSlideIndex = 0;
  let autoplayTimer;

  // Create indicator dots dynamically
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

  const updateDots = (index) => {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  };

  const goToSlide = (index) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    track.style.transform = `translateX(-${index * 100}%)`;
    currentSlideIndex = index;
    updateDots(index);
  };

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlideIndex - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlideIndex + 1);
    resetAutoplay();
  });

  // Autoplay function
  const startAutoplay = () => {
    autoplayTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 5000); // changes every 5 seconds
  };

  const resetAutoplay = () => {
    clearInterval(autoplayTimer);
    startAutoplay();
  };

  if (track) {
    startAutoplay();
    
    // Pause autoplay on mouse hover
    track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    track.addEventListener('mouseleave', startAutoplay);
  }

  /* ==========================================================================
     8. FAQ ACCORDION
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      const isActive = faqItem.classList.contains('active');

      // Close all other FAQ items first
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        faqItem.classList.add('active');
        // set max-height to scrollHeight to animate opening
        faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     9. PICKUP BOOKING FORM SUBMISSION (Simulated)
     ========================================================================== */
  const pickupForm = document.getElementById('pickup-booking-form');
  const formFeedback = document.getElementById('form-feedback');

  if (pickupForm) {
    pickupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = pickupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Visual feedback loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Request...';
      
      // Simulate API Network call
      setTimeout(() => {
        const name = document.getElementById('full-name').value;
        const phone = document.getElementById('phone-number').value;
        const location = document.getElementById('location').value;
        const material = document.getElementById('material-type').value;

        // Perform basic verification
        if (name.trim() === '' || phone.trim() === '' || location.trim() === '' || !material) {
          formFeedback.className = 'form-message error';
          formFeedback.textContent = '❌ Please fill in all required fields.';
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          return;
        }

        // Show premium success alert
        formFeedback.className = 'form-message success';
        formFeedback.innerHTML = `🎉 <strong>Success!</strong> Thank you, ${name}. Your doorstep pickup request has been received. Our team will contact you at <strong>${phone}</strong> shortly to finalize the pickup details.`;
        
        // Reset form
        pickupForm.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Scroll slightly down to focus the success message
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide success message after 10 seconds
        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 10000);

      }, 1500); // 1.5s delay simulation
    });
  }

});
