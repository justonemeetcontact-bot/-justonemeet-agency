document.addEventListener('DOMContentLoaded', () => {
    
    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloadVideo');
    const closePreloaderDirectly = () => {
        if(preloader) {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
        }
    };
    if (video) {
        video.playbackRate = 1.5; 
        video.play().catch(() => {});
        video.addEventListener('ended', () => setTimeout(closePreloaderDirectly, 0));
        setTimeout(closePreloaderDirectly, 25000); 
    } else { closePreloaderDirectly(); }

    // --- MOBILE MENU ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')){
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            }
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
            }
        });
    });

    // --- STICKY HEADER ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(header) {
            if(window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    });

    // --- STATS ANIMATION ---
    const progressSection = document.querySelector('.merged-section');
    const counters = document.querySelectorAll('.circle span'); 
    let isLooping = false;
    let loopInterval = null;

    const runStatsAnimation = () => {
        counters.forEach(counter => {
            const parent = counter.closest('.progress-item');
            const target = parseInt(parent.getAttribute('data-target'));
            const circle = counter.closest('.circle');
            if (!target) return;
            const increment = target / 100; 
            let current = 0;
            circle.style.setProperty('--percent', 0);
            const updateCounter = () => {
                current += increment;
                if(current < target) {
                    counter.innerText = Math.ceil(current) + (target === 100 ? "%" : "+");
                    circle.style.setProperty('--percent', (current / target) * 100);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target + (target === 100 ? "%" : "+");
                    circle.style.setProperty('--percent', 100);
                }
            };
            updateCounter();
        });
    };
    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            if (!isLooping) {
                runStatsAnimation(); 
                loopInterval = setInterval(runStatsAnimation, 5000);
                isLooping = true;
            }
        } else {
            clearInterval(loopInterval);
            isLooping = false;
        }
    }, { threshold: 0.1 });
    if(progressSection) statsObserver.observe(progressSection);

    // --- SERVICES ANIMATION ---
    const wrapper = document.getElementById('servicesWrapper');
    const services = document.querySelectorAll('.service-clean');
    const viewAllBtn = document.getElementById('viewAllBtn');
    let currentIndex = 0;
    let serviceInterval;

    function updateServiceDisplay() {
        services.forEach((s, index) => {
            if (index === currentIndex) s.classList.add('active');
            else s.classList.remove('active');
        });
    }
    function startServiceLoop() {
        if(services.length > 0) {
            updateServiceDisplay();
            serviceInterval = setInterval(() => {
                currentIndex++;
                if (currentIndex >= services.length) currentIndex = 0;
                updateServiceDisplay();
            }, 3000);
        }
    }
    startServiceLoop();
    if(viewAllBtn && wrapper) {
        viewAllBtn.addEventListener('click', () => {
            clearInterval(serviceInterval);
            services.forEach(s => s.classList.remove('active'));
            wrapper.classList.add('show-grid');
            viewAllBtn.style.display = 'none';
        });
    }

    // ======================================================
    // REVIEWS SECTION: AUTO-SCROLL + BUTTONS + LOGIC
    // ======================================================
    const track = document.getElementById('reviewsTrack');
    const container = document.getElementById('reviewsContainer');
    const btnLeft = document.getElementById('slideLeft');
    const btnRight = document.getElementById('slideRight');
    const cards = document.querySelectorAll('.review-card');

    if (track && container) {
        let isPaused = false;
        let scrollSpeed = 1; // Adjust speed (1 = Normal)
        let animationId;

        // 1. AUTO SCROLL FUNCTION
        function autoScroll() {
            if (!isPaused) {
                track.scrollLeft += scrollSpeed;
            }

            // Infinite Loop Logic:
            // We have 3 sets of cards. When we scroll past the width of 1 set (scrollWidth / 3),
            // we immediately snap back to the start (1px) to create the infinite illusion.
            const oneSetWidth = track.scrollWidth / 3;
            
            if (track.scrollLeft >= oneSetWidth) {
                track.scrollLeft = 1; // Snap back to start (1px prevents flicker)
            } else if (track.scrollLeft <= 0) {
                track.scrollLeft = oneSetWidth; // Handle manual left scroll edge case
            }

            animationId = requestAnimationFrame(autoScroll);
        }

        // Start Auto Scroll
        animationId = requestAnimationFrame(autoScroll);

        // 2. STOP ON CLICK (Card)
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent container from hearing this
                isPaused = true; // Stop movement
                // Visual feedback (Tiny shrink)
                card.style.transform = "scale(0.98)";
                setTimeout(() => card.style.transform = "none", 150);
            });
        });

        // 3. RESUME ON CLICK (Background)
        container.addEventListener('click', () => {
            if (isPaused) {
                isPaused = false; // Resume movement
            }
        });

        // 4. MANUAL BUTTONS
        if (btnLeft && btnRight) {
            btnLeft.addEventListener('click', (e) => {
                e.stopPropagation();
                // Move Left by 330px (Card width + Gap)
                track.scrollBy({ left: -330, behavior: 'smooth' });
            });

            btnRight.addEventListener('click', (e) => {
                e.stopPropagation();
                // Move Right by 330px
                track.scrollBy({ left: 330, behavior: 'smooth' });
            });
        }
    }
});