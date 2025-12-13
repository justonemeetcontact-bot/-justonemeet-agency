document.addEventListener('DOMContentLoaded', () => {
    // PRELOADER LOGIC (DIRECT CLOSE)// 
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloadVideo');

    const closePreloaderDirectly = () => {
        preloader.classList.add('loaded');
        document.body.style.overflow = 'auto';
    };

    if (video) {
        video.playbackRate = 1.5; 
        video.play().catch(() => {});
        video.addEventListener('ended', () => {
            setTimeout(closePreloaderDirectly, 0);
        });

        // Safety fallback: Force close after 25 seconds if video fails
        setTimeout(closePreloaderDirectly, 25000); 
    } else {
        // If no video, close immediately
        closePreloaderDirectly();
    }
    // 1. MOBILE MENU//
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')){
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    // 2. STICKY HEADER//
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    // 3. STATS ANIMATION (Animated Circles + Logic)// 
    const progressSection = document.querySelector('.merged-section') || document.querySelector('.progress-section');
    const counters = document.querySelectorAll('.circle span'); 
    let loopInterval = null;
    let isLooping = false;

    const runStatsAnimation = () => {
        counters.forEach(counter => {
            const parent = counter.closest('.progress-item');
            const target = parseInt(parent.getAttribute('data-target'));
            const circle = counter.closest('.circle');
            
            if (!target) return;

            const duration = 2000; 
            const increment = target / (duration / 20); 
            let current = 0;
            
            circle.style.setProperty('--percent', 0);

            const updateCounter = () => {
                current += increment;
                const progressRatio = current / target; 
                const circleFill = progressRatio * 100;

                if(current < target) {
                    if(target === 100) {
                         counter.innerText = Math.ceil(current) + "%";
                    } else {
                         counter.innerText = Math.ceil(current) + "+";
                    }
                    circle.style.setProperty('--percent', circleFill);
                    setTimeout(updateCounter, 20);
                } else {
                    if(target === 100) {
                        counter.innerText = target + "%";
                    } else {
                        counter.innerText = target + "+";
                    }
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

    if(progressSection) {
        statsObserver.observe(progressSection);
    }
    // 4. SERVICES ANIMATION//
    const wrapper = document.getElementById('servicesWrapper');
    const services = document.querySelectorAll('.service-clean');
    const viewAllBtn = document.getElementById('viewAllBtn');
    let currentIndex = 0;
    let serviceInterval;

    function updateServiceDisplay() {
        services.forEach((s, index) => {
            if (index === currentIndex) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    }

    function startServiceLoop() {
        if(services.length > 0) {
            updateServiceDisplay();
            serviceInterval = setInterval(() => {
                currentIndex++;
                if (currentIndex >= services.length) {
                    currentIndex = 0;
                }
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
    // 5. REVIEWS INTERACTION//
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewsContainer = document.querySelector('.reviews-part') || document.getElementById('reviews-section');
    let isPaused = false;

    if (reviewsContainer && reviewsTrack) {
        function toggleScroll(e) {
            e.stopPropagation();
            if (isPaused) {
                reviewsTrack.classList.remove('paused');
                isPaused = false;
            } else {
                reviewsTrack.classList.add('paused');
                isPaused = true;
            }
        }
        reviewsContainer.addEventListener('click', toggleScroll);
    }
});