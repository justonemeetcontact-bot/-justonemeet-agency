document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER (Instant Opening - UPDATED) ---
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloadVideo');

    const closePreloaderDirectly = () => {
        if(preloader) {
            // No transition delay, just hide it immediately
            preloader.style.display = 'none'; 
            document.body.style.overflow = 'auto';
        }
    };

    if (video) {
        // Set to high speed as requested
        video.playbackRate = 2.5; 
        
        video.play().catch(() => {
            // If browser blocks autoplay, open site immediately
            closePreloaderDirectly();
        });

        // The MOMENT the video hits the last frame, open the site
        video.onended = () => {
            closePreloaderDirectly();
        };

        // Safety backup: If video fails to load, open after 5s instead of 25s
        setTimeout(closePreloaderDirectly, 5000); 
    } else { 
        closePreloaderDirectly(); 
    }

    // --- 2. HERO VIDEO SPEED ---
    const heroVideos = document.querySelectorAll('.video-bg');
    heroVideos.forEach(v => {
        v.playbackRate = 2; 
    });

    // --- 3. MOBILE MENU ---
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

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times'); 
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- 4. STICKY HEADER ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(header) {
            if(window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    });

    // --- 5. STATS ANIMATION ---
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

    // --- 6. SERVICES ANIMATION ---
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
        clearInterval(serviceInterval); 
        updateServiceDisplay();
        serviceInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex >= services.length) currentIndex = 0;
            updateServiceDisplay();
        }, 3000);
    }

    startServiceLoop();

    if(viewAllBtn && wrapper) {
        viewAllBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            clearInterval(serviceInterval);
            services.forEach(s => s.classList.remove('active'));
            wrapper.classList.add('show-grid');
            viewAllBtn.style.display = 'none';
        });
    }

    const servicesSection = document.getElementById('services');
    if(servicesSection) {
        servicesSection.addEventListener('click', () => {
            if (wrapper && wrapper.classList.contains('show-grid')) {
                wrapper.classList.remove('show-grid');
                if(viewAllBtn) viewAllBtn.style.display = 'inline-block';
                startServiceLoop();
            }
        });
    }
    
    // --- 7. REVIEWS SECTION ---
    const track = document.getElementById('reviewsTrack');
    const container = document.getElementById('reviewsContainer');
    const btnLeft = document.getElementById('slideLeft');
    const btnRight = document.getElementById('slideRight');
    const cards = document.querySelectorAll('.review-card');

    if (track && container) {
        let isPaused = false;
        let scrollSpeed = 1; 
        let animationId;

        function autoScroll() {
            if (!isPaused) {
                track.scrollLeft += scrollSpeed;
            }
            const oneSetWidth = track.scrollWidth / 3;
            if (track.scrollLeft >= oneSetWidth) {
                track.scrollLeft = 1;
            } else if (track.scrollLeft <= 0) {
                track.scrollLeft = oneSetWidth;
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        animationId = requestAnimationFrame(autoScroll);

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                isPaused = true;
                card.style.transform = "scale(0.98)";
                setTimeout(() => card.style.transform = "none", 150);
            });
        });

        container.addEventListener('click', () => {
            if (isPaused) isPaused = false;
        });

        if (btnLeft && btnRight) {
            btnLeft.addEventListener('click', (e) => {
                e.stopPropagation();
                track.scrollBy({ left: -330, behavior: 'smooth' });
            });
            btnRight.addEventListener('click', (e) => {
                e.stopPropagation();
                track.scrollBy({ left: 330, behavior: 'smooth' });
            });
        }
    }
});