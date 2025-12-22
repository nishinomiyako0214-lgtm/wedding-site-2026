/*!
* Start: Custom scripts for Wedding Site (Redesign)
*/

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // 1. AOS (Animation) Init
    // ===========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 100,
            duration: 1000,
        });
    }

    // ===========================================
    // 2. Mobile Navigation & Header Scroll
    // ===========================================
    const header = document.querySelector('.site-header');
    const nav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.menu-toggle');
    const body = document.body;

    // Header Scroll Effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    // Mobile Menu Toggle
    if (navToggle && nav) {
        const toggleMenu = () => {
            const isVisible = nav.getAttribute('data-visible') === 'true';

            if (!isVisible) {
                // Open Menu
                nav.setAttribute('data-visible', 'true');
                navToggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden'; // Lock Scroll
            } else {
                // Close Menu
                nav.setAttribute('data-visible', 'false');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = 'auto'; // Unlock Scroll
            }
        };

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (nav.getAttribute('data-visible') === 'true') {
                    toggleMenu();
                }
            });
        });
    }

    // ===========================================
    // 3. Smooth Scroll
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===========================================
    // 4. Back to Top Button (Optional if exists in HTML)
    // ===========================================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTop.classList.remove('d-none');
            } else {
                backToTop.classList.add('d-none');
            }
        };
        window.addEventListener('scroll', toggleBackToTop);
    }

    // ===========================================
    // 5. Countdown Timer
    // ===========================================
    function startCountdown() {
        // Confirm Date: 2026.02.23
        const weddingDate = new Date("February 23, 2026 00:00:00").getTime();
        const countdownElement = document.getElementById("timer-display");

        if (!countdownElement) return;

        const updateTimer = setInterval(function () {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            countdownElement.innerHTML =
                `<span class="timer-unit">${days}</span><span class="timer-label">Days</span>` +
                `<span class="timer-unit">${hours}</span><span class="timer-label">Hours</span>` +
                `<span class="timer-unit">${minutes}</span><span class="timer-label">Mins</span>`;

            if (distance < 0) {
                clearInterval(updateTimer);
                countdownElement.innerHTML = "🎉 TODAY IS THE DAY! 🎉";
            }
        }, 1000);
    }

    startCountdown();

});