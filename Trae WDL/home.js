// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        root.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme === 'light');
    }

    themeToggle.addEventListener('click', () => {
        const isLight = root.getAttribute('data-theme') === 'light';
        const newTheme = isLight ? 'dark' : 'light';

        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(!isLight);
    });

    function updateThemeIcon(isLight) {
        const icon = themeToggle.querySelector('i');
        icon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ✅ Social Popup Show after 5 seconds
    setTimeout(() => {
        document.getElementById('socialPopup')?.classList.add('show');
    }, 5000);

    document.querySelector('.close-popup')?.addEventListener('click', () => {
        document.getElementById('socialPopup')?.classList.remove('show');
    });

    // ✅ AOS and Particles.js Init
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#6366f1' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#6366f1',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            }
        },
        retina_detect: true
    });

    // ✅ Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('show');
        navActions.classList.toggle('show');
    });

    // ✅ Animated Counter
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                clearInterval(timer);
                current = target;
            }
            element.textContent = Math.round(current).toLocaleString();
        }, 20);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.number').forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats').forEach(stats => {
        statsObserver.observe(stats);
    });

    // ✅ Pricing Toggle
    const billingToggle = document.getElementById('billing-toggle');
    const prices = document.querySelectorAll('.price-amount');

    const updatePrices = (isYearly) => {
        prices.forEach(price => {
            price.classList.add('price-change');
            setTimeout(() => {
                price.textContent = isYearly ?
                    price.getAttribute('data-yearly') :
                    price.getAttribute('data-monthly');
                price.classList.remove('price-change');
            }, 200);
        });
    };

    if (billingToggle) {
        billingToggle.addEventListener('change', () => {
            updatePrices(billingToggle.checked);
        });
    }

    // ✅ Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navHeight = document.querySelector('.glass-nav')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ✅ Form Validation
    const validateForm = (form) => {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        return isValid;
    };

    // ✅ Local Storage for Resume Data
    const saveResumeData = (data) => {
        localStorage.setItem('resumeData', JSON.stringify(data));
    };

    const loadResumeData = () => {
        return JSON.parse(localStorage.getItem('resumeData')) || {};
    };

    // ✅ FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) item.classList.remove('active');
            });
            faqItem.classList.toggle('active');
        });
    });

    // ✅ Swiper Testimonials Slider
    const testimonialSlider = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        }
    });

    // Optional: Dynamic Template Loader
    const templates = [
        { name: 'Modern Professional', image: 'template1.jpg', description: 'Clean and contemporary design' }
        // Add more templates here
    ];
});
// Form Handling
document.getElementById('helpForm').addEventListener('submit', handleFormSubmit);
document.getElementById('feedbackForm').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showSuccessModal();
        e.target.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Modal Handling
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'flex';
}

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('successModal').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});