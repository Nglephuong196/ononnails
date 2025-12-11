// ===== On On Nails Bar - JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== Promo Banner =====
    const promoBanner = document.getElementById('promoBanner');
    if (promoBanner) {
        // Check if banner was previously closed in this session
        const bannerClosed = sessionStorage.getItem('promoBannerClosed');
        if (!bannerClosed) {
            document.body.classList.add('has-promo-banner');
        } else {
            promoBanner.classList.add('hidden');
        }
    }
    
    window.closePromoBanner = function() {
        const banner = document.getElementById('promoBanner');
        if (banner) {
            banner.classList.add('hidden');
            document.body.classList.remove('has-promo-banner');
            sessionStorage.setItem('promoBannerClosed', 'true');
        }
    };
    
    // ===== Language System =====
    let currentLang = 'vi';
    
    function detectBrowserLanguage() {
        const savedLang = localStorage.getItem('onon-lang');
        if (savedLang) return savedLang;
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('vi') ? 'vi' : 'en';
    }
    
    // Toggle language function
    window.toggleLanguage = function() {
        currentLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('onon-lang', currentLang);
        updateLanguage();
        updateLangToggle();
        // Update testimonials for new language
        if (window.updateTestimonialsForLanguage) {
            window.updateTestimonialsForLanguage();
        }
    };
    
    function updateLanguage() {
        document.querySelectorAll('[data-vi][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                // Always update textContent regardless of children
                // This will replace all content including child elements
                el.textContent = text;
            }
        });
        document.documentElement.lang = currentLang;
    }
    
    function updateLangToggle() {
        document.querySelectorAll('.lang-option').forEach(el => {
            const lang = el.getAttribute('data-lang');
            el.classList.toggle('active', lang === currentLang);
        });
    }
    
    currentLang = detectBrowserLanguage();
    updateLanguage();
    updateLangToggle();
    
    // ===== Mobile Menu =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking nav links
        navLinks.querySelectorAll('a:not(.btn)').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ===== Navbar Scroll Effect =====
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.pageYOffset > 30);
    });
    
    // ===== Accordion =====
    window.toggleAccordion = function(button) {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all accordions
        document.querySelectorAll('.accordion-item').forEach(acc => {
            acc.classList.remove('active');
        });
        
        // Open clicked one if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    };
    
    // Open first accordion by default
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) firstAccordion.classList.add('active');
    
    // ===== Gallery Carousel =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    const dotsContainer = document.getElementById('carouselDots');
    
    if (dotsContainer && totalSlides > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    window.moveCarousel = function(direction) {
        currentSlide += direction;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        updateCarousel();
    };
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    function updateCarousel() {
        const track = document.querySelector('.carousel-track');
        if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('#carouselDots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Auto-play carousel
    let carouselInterval = setInterval(() => {
        if (totalSlides > 0) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
    }, 4000);
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselContainer.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(() => {
                if (totalSlides > 0) {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    updateCarousel();
                }
            }, 4000);
        });
    }
    
    // ===== Testimonials (Language-Filtered) =====
    let currentTestimonial = 0;
    const allTestimonials = document.querySelectorAll('.testimonial-card');
    const testimonialDotsContainer = document.getElementById('testimonialDots');
    let filteredTestimonials = [];
    let testimonialInterval;

    function getFilteredTestimonials() {
        return Array.from(allTestimonials).filter(card =>
            card.getAttribute('data-review-lang') === currentLang
        );
    }

    function initTestimonialDots() {
        if (!testimonialDotsContainer) return;
        testimonialDotsContainer.innerHTML = '';
        filteredTestimonials = getFilteredTestimonials();

        for (let i = 0; i < filteredTestimonials.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToTestimonial(i));
            testimonialDotsContainer.appendChild(dot);
        }
    }

    window.updateTestimonialsForLanguage = function() {
        currentTestimonial = 0;
        filteredTestimonials = getFilteredTestimonials();
        initTestimonialDots();
        updateTestimonials();
        restartTestimonialAutoplay();
    };

    window.moveTestimonial = function(direction) {
        filteredTestimonials = getFilteredTestimonials();
        if (filteredTestimonials.length === 0) return;

        currentTestimonial += direction;
        if (currentTestimonial >= filteredTestimonials.length) currentTestimonial = 0;
        if (currentTestimonial < 0) currentTestimonial = filteredTestimonials.length - 1;
        updateTestimonials();
    };

    function goToTestimonial(index) {
        currentTestimonial = index;
        updateTestimonials();
    }

    function updateTestimonials() {
        filteredTestimonials = getFilteredTestimonials();
        // Hide all testimonials first
        allTestimonials.forEach(card => card.classList.remove('active'));
        // Show only the current one from filtered list
        if (filteredTestimonials[currentTestimonial]) {
            filteredTestimonials[currentTestimonial].classList.add('active');
        }
        document.querySelectorAll('#testimonialDots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    function restartTestimonialAutoplay() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(() => {
            filteredTestimonials = getFilteredTestimonials();
            if (filteredTestimonials.length > 0) {
                currentTestimonial = (currentTestimonial + 1) % filteredTestimonials.length;
                updateTestimonials();
            }
        }, 5000);
    }

    // Initialize testimonials
    initTestimonialDots();
    updateTestimonials();
    restartTestimonialAutoplay();

    // Pause on hover
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        testimonialCarousel.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
        testimonialCarousel.addEventListener('mouseleave', () => restartTestimonialAutoplay());
    }
    
    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
    
    // ===== Touch Swipe for Carousels =====
    let touchStartX = 0;
    
    const carouselEl = document.querySelector('.carousel');
    if (carouselEl) {
        carouselEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        carouselEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                window.moveCarousel(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }
    
    const testimonialEl = document.querySelector('.testimonial-track');
    if (testimonialEl) {
        testimonialEl.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        testimonialEl.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                window.moveTestimonial(diff > 0 ? 1 : -1);
            }
        }, { passive: true });
    }
    
    console.log('🌸 OnOn Nails Bar Loaded | Lang:', currentLang.toUpperCase());
});
