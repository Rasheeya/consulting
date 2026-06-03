document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. RESPONSIVE MOBILE MENU CONTROLLER
       ========================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle menu state on button click
    mobileMenuBtn.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        navbar.classList.toggle('menu-active');
        
        // Prevent background scrolling when overlay menu is open
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu immediately upon selecting any anchor item
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navbar.classList.remove('menu-active');
            document.body.style.overflow = '';
        });
    });

    /* ==========================================
       2. TYPED.JS CONFIGURATION ENGINE
       ========================================== */
    if (window.Typed && document.getElementById('typed')) {
        new Typed('#typed', {
            strings: ['navigate complexity.', 'accelerate scale.', 'secure leadership.'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 2000,
            loop: true
        });
    }


    /* ==========================================
       2B. AUTO-SLIDING HERO BACKGROUND SYSTEM
       ========================================== */
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000); // Cross-fade slide backgrounds every 5 seconds
    }


    /* ==========================================
       3. HIGH-PERFORMANCE INTERSECTION OBSERVER ENGINE
       ========================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before the element fully enters viewport
        threshold: 0.12 // Trigger when 12% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Check if this element is part of a staggered parent grid
                const parentGrid = target.parentElement;
                if (parentGrid && (
                    parentGrid.classList.contains('stats-grid') ||
                    parentGrid.classList.contains('services-grid') ||
                    parentGrid.classList.contains('methodology-grid') ||
                    parentGrid.classList.contains('testimonials-grid') ||
                    parentGrid.classList.contains('sectors-cards-grid') ||
                    parentGrid.classList.contains('advisory-grid')
                )) {
                    // Find all siblings in this grid that are reveal elements
                    const siblings = Array.from(parentGrid.querySelectorAll('.reveal-left, .reveal-right, .reveal-y'));
                    const index = siblings.indexOf(target);
                    if (index !== -1) {
                        // Apply dynamically calculated staggered transition delays (150ms per item)
                        target.style.transitionDelay = `${index * 150}ms`;
                    }
                }
                
                // Initialize Typed.js for section titles
                const typedEls = target.classList.contains('typed-section') ? [target] : target.querySelectorAll('.typed-section');
                typedEls.forEach(typedEl => {
                    if (!typedEl.classList.contains('typed-initialized') && window.Typed) {
                        typedEl.classList.add('typed-initialized');
                        const stringsAttr = typedEl.getAttribute('data-strings');
                        if (stringsAttr) {
                            try {
                                const strings = JSON.parse(stringsAttr);
                                new Typed(typedEl, {
                                    strings: strings,
                                    typeSpeed: 40,
                                    showCursor: true,
                                    cursorChar: '|',
                                    loop: false
                                });
                            } catch (e) {
                                console.error('Error parsing Typed strings', e);
                            }
                        }
                    }
                });
                
                // Initialize Stat Counters
                const statNumbers = target.classList.contains('stat-number') ? [target] : target.querySelectorAll('.stat-number');
                statNumbers.forEach(statEl => {
                    if (!statEl.classList.contains('counter-initialized')) {
                        statEl.classList.add('counter-initialized');
                        const targetNum = parseFloat(statEl.getAttribute('data-target') || 0);
                        const prefix = statEl.getAttribute('data-prefix') || '';
                        const suffix = statEl.getAttribute('data-suffix') || '';
                        const duration = 2000;
                        let startTimestamp = null;
                        
                        const step = (timestamp) => {
                            if (!startTimestamp) startTimestamp = timestamp;
                            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                            const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
                            const currentNum = easeProgress * targetNum;
                            
                            const isFloat = targetNum % 1 !== 0;
                            const displayNum = isFloat ? currentNum.toFixed(1) : Math.floor(currentNum);
                            
                            statEl.textContent = `${prefix}${displayNum}${suffix}`;
                            
                            if (progress < 1) {
                                window.requestAnimationFrame(step);
                            } else {
                                // Final value display to ensure exact match
                                statEl.textContent = `${prefix}${targetNum}${suffix}`;
                            }
                        };
                        window.requestAnimationFrame(step);
                    }
                });

                target.classList.add('revealed');
                // Once revealed, stop observing to optimize scrolling performance
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    // Observe all eligible scroll-reveal target elements
    const revealElements = document.querySelectorAll('.section-reveal, .reveal-left, .reveal-right, .reveal-y');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    /* ==========================================
       4. TESTIMONIALS SLIDING CAROUSEL ENGINE
       ========================================== */
    const carousel = document.getElementById('testimonials-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const dots = document.querySelectorAll('#carousel-dots .dot');
    
    if (carousel && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function updateCarousel(index) {
            // Constraint checks
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentIndex = index;
            // Translate flex row container horizontally
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Set active dot indicators
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Manual triggers
        prevBtn.addEventListener('click', () => {
            updateCarousel(currentIndex - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            updateCarousel(currentIndex + 1);
        });
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
                updateCarousel(targetIndex);
            });
        });
        
        // Autoplay loop (slides every 6 seconds)
        let autoPlayTimer = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 6000);
        
        // Autoplay reset utility to prevent jumping during click intervals
        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            autoPlayTimer = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, 6000);
        }
        
        prevBtn.addEventListener('click', resetAutoPlay);
        nextBtn.addEventListener('click', resetAutoPlay);
        dots.forEach(dot => dot.addEventListener('click', resetAutoPlay));
    }
});