document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER (Instant Opening - UPDATED) ---
    const preloader = document.getElementById('preloader');
    const video = document.getElementById('preloadVideo');

    const closePreloaderDirectly = () => {
        if(preloader) {
            preloader.style.display = 'none'; 
            document.body.style.overflow = 'auto';
        }
    };
 if (video) {
        video.playbackRate = 1.0; 
        
        video.play().catch(() => {
            closePreloaderDirectly();
        });
        video.onended = () => {
            closePreloaderDirectly();
        };
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
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');

                icon.style.color = "#ffffff"; 
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.style.color = ""; 
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

const progressSection = document.querySelector('#realisations'); 
const counters = document.querySelectorAll('.count'); 

let isLooping = false;
let loopInterval = null;

const runStatsAnimation = () => {
    counters.forEach(counter => {
        const parent = counter.closest('.progress-item');
        const target = parseInt(parent.getAttribute('data-target'));
        const circle = parent.querySelector('.circle');
        
        if (!target) return;

        let current = 0;
        const duration = 2000; // 2 seconds animation
        const steps = 50;
        const increment = target / steps;
        const stepTime = duration / steps;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                circle.style.setProperty('--percent', (current / target) * 100);
                setTimeout(updateCounter, stepTime);
            } else {
                counter.innerText = target;
                circle.style.setProperty('--percent', 100);
            }
        };
        circle.style.setProperty('--percent', 0);
        updateCounter();
    });
};

// Intersection Observer 
const statsObserver = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        if (!isLooping) {
            runStatsAnimation(); 
            loopInterval = setInterval(runStatsAnimation, 8000);
            isLooping = true;
        }
    } else {
        clearInterval(loopInterval);
        isLooping = false;
    }
}, { threshold: 0.3 });

if(progressSection) {
    statsObserver.observe(progressSection);
}

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
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

if (track) {
    let isPaused = false;
    const scrollAmount = 350; 

   // --- 7. REVIEWS SLIDER (SMOOTH LOOP) ---
    const track = document.getElementById('reviewsTrack');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');

    if (track) {
        let scrollAmount = 0;
        const cardWidth = 350; 
        let isPaused = false;

        // scrolly(Smooth)
        const autoScroll = () => {
            if (!isPaused) {
                track.scrollLeft += 1; 
                if (track.scrollLeft >= (track.scrollWidth - track.clientWidth)) {
                    track.scrollLeft = 0;
                }
            }
        };

        // Animation Loop
        let scrollInterval = setInterval(autoScroll, 20); 

        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);

        rightBtn.addEventListener('click', () => {
            track.scrollTo({
                left: track.scrollLeft + cardWidth,
                behavior: 'smooth'
            });
            isPaused = true; 
        });
        leftBtn.addEventListener('click', () => {
            track.scrollTo({
                left: track.scrollLeft - cardWidth,
                behavior: 'smooth'
            });
            isPaused = true;
        });
    }

    // 2. Auto-play Loop (Animation)
    let autoScroll = setInterval(() => {
        if (!isPaused) scrollRight();
    }, 3000);

    // 3. Stop animation on click or hover
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);
    track.addEventListener('click', () => isPaused = true); 

    // 4. Buttons Click
    if (rightBtn) rightBtn.addEventListener('click', () => {
        scrollRight();
        isPaused = true; 
    });

    if (leftBtn) leftBtn.addEventListener('click', () => {
        scrollLeftFunc();
        isPaused = true;
    });
}
    // --- 8. PROMISES ANIMATION  ---
    const promisesSection = document.getElementById('promesses');
    const promiseCards = document.querySelectorAll('.promise-card');

    if (promisesSection) {
        const promiseObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                promiseCards.forEach(card => card.classList.add('show'));
                promiseObserver.unobserve(promisesSection); // Run once
            }
        }, { threshold: 0.2 });
        promiseObserver.observe(promisesSection);
    }
    // --- 9. PROCESS SECTION ANIMATION ---
    const processSection = document.getElementById('process');
    const stepCards = document.querySelectorAll('.step-card');

    if (processSection && stepCards.length > 0) {
        const processObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                stepCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, index * 200); 
                });
                processObserver.unobserve(processSection);
            }
        }, { threshold: 0.2 });

        processObserver.observe(processSection);
    }

});
