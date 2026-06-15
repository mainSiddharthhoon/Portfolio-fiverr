let observers = [];
document.addEventListener('DOMContentLoaded', () => {

    // GSAP Performance Config
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ nullTargetWarn: false });
    gsap.ticker.lagSmoothing(0);

    function throttleRAF(fn) {
        let ticking = false;
        return function(e) {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    fn(e);
                    ticking = false;
                });
                ticking = true;
            }
        };
    }
    gsap.config({ nullTargetWarn: false });
    gsap.ticker.lagSmoothing(0);

    emailjs.init("_0BwUj9la325HsMBM");

    const hasHover = window.matchMedia('(hover: hover)').matches;
    const isTouch = !hasHover;

    // Budget mobile Spline removal bypassed to ensure it always loads on mobile as requested

    const loader = document.getElementById('loader');
    const loaderStatus = document.getElementById('loader-status');
    const loaderFill = document.getElementById('loader-bar-fill');
    const loaderWelcome = document.getElementById('loader-welcome');

    // Store observers for cleanup
    const observers = [];

    // =============================================
    // PHASE 1: LOADING SCREEN (Hybrid Real/Artificial)
    // =============================================

    let isPageLoaded = document.readyState === 'complete';
    const loadingText = "Initialising Siddharth's portfolio...";
    let charIndex = 0;
    let statusInterval = null;
    let progressInterval = null;

    if (!isPageLoaded) {
        window.addEventListener('load', () => {
            isPageLoaded = true;
        });
    }

    function typeStatus() {
        return new Promise(resolve => {
            statusInterval = setInterval(() => {
                charIndex++;
                loaderStatus.textContent = loadingText.slice(0, charIndex);
                if (charIndex >= loadingText.length) {
                    clearInterval(statusInterval);
                    setTimeout(resolve, 300);
                }
            }, 35);
        });
    }

    function animateProgress() {
        return new Promise(resolve => {
            const progressData = { value: 0 };
            
            const progressTween = gsap.to(progressData, {
                value: 100,
                duration: 6, 
                ease: "none",
                onUpdate: () => {
                    if (!isPageLoaded && progressData.value >= 92) {
                        progressTween.pause();
                    }
                    
                    const displayVal = Math.floor(progressData.value);
                    loaderFill.style.width = displayVal + '%';
                    loaderStatus.textContent = `Progress: ${displayVal}%`;
                }
            });

            progressInterval = setInterval(() => {
                if (isPageLoaded) {
                    clearInterval(progressInterval);
                    progressTween.kill();
                    
                    gsap.to(progressData, {
                        value: 100,
                        duration: 0.8,
                        ease: "power2.out",
                        onUpdate: () => {
                            const displayVal = Math.floor(progressData.value);
                            loaderFill.style.width = displayVal + '%';
                            loaderStatus.textContent = `Progress: ${displayVal}%`;
                        },
                        onComplete: resolve
                    });
                }
            }, 100);
        });
    }

    function showWelcome() {
        return new Promise(resolve => {
            gsap.to(loaderStatus, { opacity: 0, duration: 0.3 });
            loaderWelcome.textContent = "Welcome to Siddharth's Workspace";
            gsap.to(loaderWelcome, {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                onComplete: () => { setTimeout(resolve, 800); }
            });
        });
    }

    function fadeLoader() {
        return new Promise(resolve => {
            gsap.to(loader, {
                opacity: 0, duration: 0.6, ease: 'power2.inOut',
                onComplete: () => { loader.classList.add('done'); resolve(); }
            });
        });
    }

    // =============================================
    // PHASE 2: HERO & NAVBAR ENTRANCE
    // =============================================

    function playHeroEntrance() {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.to('#glass-nav', { opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' });
        
        if (window.innerWidth <= 768) {
            tl.to('#mobile-header', { opacity: 1, duration: 0.5 }, "-=0.8");
        }

        tl.to('.freelance-badge', { opacity: 1, duration: 0.6 }, '-=0.4');
        tl.to('#hero-greeting', { opacity: 1, duration: 0.7 }, '-=0.3');
        tl.to('#name-siddharth', { opacity: 1, y: 0, duration: 1 }, '-=0.5');
        tl.to('#name-rohit', { opacity: 1, y: 0, duration: 1 }, '-=0.8');

        tl.call(initTypingAnimation, [], '-=0.2');

        tl.to('.hero-ctas', { opacity: 1, duration: 0.8 }, '-=0.5');
        tl.to('#scroll-indicator', { opacity: 1, duration: 1 }, '-=0.3');
    }

    // ============================================
    // TYPING ANIMATION
    // ============================================
    function initTypingAnimation() {
        const textEl = document.getElementById('typing-text');
        const phrases = [
            "Frontend Developer & Visual Designer",
            "I build premium web experiences",
            "Turning ideas into cinematic interfaces",
            "GSAP animations & 3D web specialist",
            "Crafting digital worlds since 2024"
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            if (!textEl) return;
            if (isDeleting) {
                textEl.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                textEl.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 25 : 45;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // ============================================
    // NAVBAR INTERACTIONS
    // ============================================
    let activeBtn = null;
    let isNavHovered = false;

    function moveBlob(btn) {
        const blob = document.getElementById('nav-blob');
        if (!blob || !btn) return;
        const x = btn.offsetLeft;
        const w = btn.offsetWidth;
        gsap.to(blob, { 
            left: x, 
            width: w, 
            opacity: 1, 
            duration: 0.4, 
            ease: "expo.out" 
        });
    }

    function hideBlob() {
        const blob = document.getElementById('nav-blob');
        if (!blob) return;
        gsap.to(blob, { opacity: 0, duration: 0.3, ease: "power2.inOut" });
    }

    function initNavbarInteractions() {
        const navInner = document.getElementById('glass-nav-inner');
        const glassBtns = document.querySelectorAll('.glass-btn');
        const glassNav = document.getElementById('glass-nav');

        if (!navInner) return;

        glassBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (isTouch) return;
                isNavHovered = true;
                moveBlob(btn);
            });
            btn.addEventListener('click', () => {
                btn.classList.remove('ripple');
                void btn.offsetWidth;
                btn.classList.add('ripple');
                setTimeout(() => btn.classList.remove('ripple'), 600);
            });
        });

        navInner.addEventListener('mouseleave', () => {
            if (isTouch) return;
            isNavHovered = false;
            if (activeBtn) {
                moveBlob(activeBtn);
            } else {
                hideBlob();
            }
        });

        if (!isTouch) {
            let rAF_nav = null;
            glassNav.addEventListener('mousemove', throttleRAF((e) => {
                if (rAF_nav) cancelAnimationFrame(rAF_nav);
                rAF_nav = requestAnimationFrame(() => {
                    const rect = glassNav.getBoundingClientRect();
                    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                    gsap.to(navInner, { rotateX: -dy * 6, rotateY: dx * 6, scale: 1.02, duration: 0.5, ease: "power2.out" });
                });
            }));

            glassNav.addEventListener('mouseleave', () => {
                if (rAF_nav) cancelAnimationFrame(rAF_nav);
                gsap.to(navInner, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
            });

            let rAF_proximity = null;
            document.addEventListener('mousemove', (e) => {
                if (rAF_proximity) cancelAnimationFrame(rAF_proximity);
                rAF_proximity = requestAnimationFrame(() => {
                    const rect = glassNav.getBoundingClientRect();
                    const proximity = 80;
                    const isNear = e.clientX > rect.left - proximity && e.clientX < rect.right + proximity &&
                                   e.clientY > rect.top - proximity && e.clientY < rect.bottom + proximity;
                    const isInside = e.clientX > rect.left && e.clientX < rect.right &&
                                     e.clientY > rect.top && e.clientY < rect.bottom;
                    if (isNear && !isInside && !navInner.classList.contains('wobble')) {
                        navInner.classList.add('wobble');
                        setTimeout(() => navInner.classList.remove('wobble'), 600);
                    }
                });
            });
        }
    }

    // ============================================
    // MOBILE MENU LOGIC
    // ============================================
    function initMobileMenu() {
        const openBtn = document.getElementById('hamburger-open');
        const closeBtn = document.getElementById('nav-close');
        const overlay = document.getElementById('nav-overlay');
        const links = document.querySelectorAll('.mobile-link');

        if (!openBtn || !overlay) return;

        let isOpen = false;

        function toggleMenu() {
            if (isOpen) {
                gsap.to(overlay, { y: "-100%", duration: 0.5, ease: "power3.in" });
                isOpen = false;
            } else {
                gsap.to(overlay, { y: 0, duration: 0.5, ease: "power3.out" });
                isOpen = true;
            }
        }

        openBtn.addEventListener('click', toggleMenu);
        if(closeBtn) closeBtn.addEventListener('click', () => { if(isOpen) toggleMenu(); });

        links.forEach(link => {
            link.addEventListener('click', () => {
                if(isOpen) toggleMenu();
            });
        });
    }

    // ============================================
    // HERO CTA INTERACTIONS (Magnetic Liquid Pills)
    // ============================================
    function initHeroInteractions() {
        const ctaBtns = document.querySelectorAll('.cta-btn');
        
        ctaBtns.forEach(btn => {
            const magnetic = btn.hasAttribute('data-magnetic');
            let rAF_cta = null;
            
            btn.addEventListener('mousemove', throttleRAF((e) => {
                if (isTouch) return;
                if (rAF_cta) cancelAnimationFrame(rAF_cta);
                rAF_cta = requestAnimationFrame(() => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const xPerc = (x / rect.width) * 100;
                    const yPerc = (y / rect.height) * 100;
                    btn.style.setProperty('--x', `${xPerc}%`);
                    btn.style.setProperty('--y', `${yPerc}%`);

                    if (magnetic) {
                        const dx = (x - rect.width / 2) / (rect.width / 2);
                        const dy = (y - rect.height / 2) / (rect.height / 2);
                        
                        gsap.to(btn, {
                            x: dx * 18,
                            y: dy * 12,
                            duration: 0.4,
                            ease: "power2.out"
                        });
                    }
                });
            }));

            btn.addEventListener('mouseleave', () => {
                if (isTouch) return;
                if (rAF_cta) cancelAnimationFrame(rAF_cta);
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.6)"
                });
            });
        });
    }

    // ============================================
    // ABOUT SECTION SCROLL ANIMATIONS
    // ============================================
    function initAboutAnimations() {
        console.log('initAboutAnimations: start');
        try {
            const section = document.querySelector('.about-section');
            if (!section) return;

            console.log('initAboutAnimations: before fromTo photo');
            gsap.fromTo('.about-photo-container', 
                { opacity: 0, x: isTouch ? 0 : -60, y: isTouch ? 40 : 0 },
                { 
                    opacity: 1, x: 0, y: 0, duration: 1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.about-section',
                        start: "top 70%",
                        once: true
                    }
                }
            );

            console.log('initAboutAnimations: before timeline');
            const textTl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.about-right',
                    start: "top 75%",
                    once: true
                }
            });

            console.log('initAboutAnimations: before timeline fromTo');
            textTl.fromTo('.section-header', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
                  .fromTo('.about-greeting', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
                  .fromTo('.about-name', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.5")
                  .fromTo('.about-role-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.6")
                  .fromTo('.about-para', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 }, "-=0.5")
                  .fromTo('.stat-pill', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4");
            console.log('initAboutAnimations: end');
        } catch (e) {
            console.error('initAboutAnimations error:', e.message, e.stack);
        }
    }

    // ============================================
    // EXPERTISE SECTION (PREMIUM)
    // ============================================
    function initExpertiseAnimations() {
        const section = document.querySelector('.expertise-section');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.expertise-header-block',
                start: "top 85%",
                once: true
            }
        });

        tl.fromTo('.expertise-label-line', { width: 0 }, { width: 40, duration: 0.8, ease: "power3.out" });
        tl.fromTo('.expertise-label-text', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.6");
        tl.fromTo('.title-word', 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out" },
            "-=0.4"
        );
        tl.fromTo('.expertise-subtext', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

        const expertiseCards = gsap.utils.toArray('.expertise-card');
        gsap.fromTo(expertiseCards, 
            { opacity: 0, y: 80, rotateX: isTouch ? 0 : 8 },
            { 
                opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15, ease: "power3.out",
                onStart: () => { 
                    expertiseCards.forEach(t => t.style.willChange = 'transform, opacity'); 
                },
                onComplete: () => {
                    expertiseCards.forEach(t => t.style.willChange = 'auto');
                },
                scrollTrigger: {
                    trigger: '.expertise-cards',
                    start: "top 85%",
                    once: true
                }
            }
        );

        initExpertiseHover();
    }

    function initExpertiseHover() {
        const cards = document.querySelectorAll('.expertise-card');
        
        cards.forEach(card => {
            let rAF_exp = null;
            card.addEventListener('mousemove', throttleRAF((e) => {
                if (isTouch) return;
                if (rAF_exp) cancelAnimationFrame(rAF_exp);
                rAF_exp = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    card.style.setProperty('--mx', `${x}px`);
                    card.style.setProperty('--my', `${y}px`);
                });
            }));
        });
    }

    // ============================================
    // MY WORKS SECTION
    // ============================================
    function initWorksAnimations() {
        const section = document.querySelector('.works-section');
        if (!section) return;

        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.works-header-block',
                start: "top 85%",
                once: true
            }
        });

        headerTl.fromTo('.works-label-line', { width: 0 }, { width: 40, duration: 0.8, ease: "power3.out" })
                .fromTo('.works-label-text', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.6")
                .fromTo('.works-title-word', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=0.4")
                .fromTo('.works-subtext', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

        const workItems = document.querySelectorAll('.work-item');
        workItems.forEach((item, index) => {
            const isEven = (index + 1) % 2 === 0;
            const imgSide = item.querySelector('.work-image-wrap');
            const textSide = item.querySelector('.work-text');

            const itemTl = gsap.timeline({
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    once: true
                }
            });

            itemTl.fromTo(imgSide, 
                { opacity: 0, x: (isEven && !isTouch) ? 60 : -60 },
                { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" }
            );

            itemTl.fromTo(textSide,
                { opacity: 0, x: (isEven && !isTouch) ? -60 : 60 },
                { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
                "-=0.95"
            );

            const elements = [
                textSide.querySelector('.work-number'),
                textSide.querySelector('.work-name'),
                textSide.querySelector('.work-category'),
                textSide.querySelector('.work-desc'),
                textSide.querySelector('.work-tags'),
                textSide.querySelector('.work-cta')
            ];

            itemTl.fromTo(elements,
                { opacity: 0, y: 30 },
                { opacity: 1, 
                  y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.7"
            );
        });
    }

    // ============================================
    // CONTACT SECTION
    // ============================================
    function initContactAnimations() {
        const section = document.querySelector('.contact-section');
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.contact-section',
                start: "top 85%",
                once: true
            }
        });

        tl.fromTo('.contact-label-line', { width: 0 }, { width: 40, duration: 0.8, ease: "power3.out" })
          .fromTo('.contact-label-text', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, "-=0.6")
          .fromTo('.contact-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.4")
          .fromTo('.contact-subtext', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");

        tl.fromTo('.form-group', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.1 }, "-=0.5");
        tl.fromTo('.submit-btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

        tl.fromTo('.info-heading', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=1");
        tl.fromTo(['.contact-card', '.github-strip'], { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, "-=0.8");

        gsap.fromTo('.footer', { opacity: 0 }, { 
            opacity: 1, duration: 0.8,
            scrollTrigger: {
                trigger: '.footer',
                start: "top 95%",
                once: true
            }
        });
    }

    function initContactForm() {
        const form = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        if (!form || !submitBtn) return;

        const btnText = submitBtn.querySelector('.btn-text');
        const inputs = form.querySelectorAll('input, textarea');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = form.querySelector('input[name="name"]');
            const email = form.querySelector('input[name="email"]');
            const message = form.querySelector('textarea[name="message"]');

            let hasError = false;
            [name, email, message].forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'rgba(255, 50, 50, 0.5)';
                    hasError = true;
                }
            });

            if (hasError) return;

            const originalHtml = btnText.innerHTML;
            const originalBg = submitBtn.style.background;
            const originalBorder = submitBtn.style.border;

            submitBtn.disabled = true;
            btnText.textContent = "Sending...";

            const templateParams = {
                from_name: name.value,
                from_email: email.value,
                message: message.value
            };

            emailjs.send("service_bws3fsb", "template_i95h87m", templateParams)
                .then(() => {
                    btnText.textContent = "Message Sent ✓";
                    submitBtn.style.background = 'rgba(124, 58, 237, 0.3)';
                    submitBtn.style.border = '1px solid #7C3AED';
                    form.reset();

                    setTimeout(() => {
                        btnText.innerHTML = originalHtml;
                        submitBtn.style.background = originalBg;
                        submitBtn.style.border = originalBorder;
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch(() => {
                    btnText.textContent = "Failed — Try Again";
                    submitBtn.style.background = 'rgba(255, 50, 50, 0.15)';
                    submitBtn.style.border = '1px solid rgba(255, 50, 50, 0.3)';

                    setTimeout(() => {
                        btnText.innerHTML = originalHtml;
                        submitBtn.style.background = originalBg;
                        submitBtn.style.border = originalBorder;
                        submitBtn.disabled = false;
                    }, 2000);
                });
        });
    }

    // ============================================
    // ANIMATED FAVICON
    // ============================================
    function initFaviconAnimation() {
        const favicon = document.getElementById('favicon');
        if (!favicon) return;

        let interval = null;
        let isDark = true;

        const startBlinking = () => {
            if (interval) return;
            interval = setInterval(() => {
                isDark = !isDark;
                favicon.href = isDark ? 'favicon-dark.svg' : 'favicon-light.svg';
            }, 600);
        };

        const stopBlinking = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
            favicon.href = 'favicon-dark.svg';
            isDark = true;
        };

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                startBlinking();
            } else {
                stopBlinking();
            }
        });
    }

    // ============================================
    // SCROLL SPY (NAV HIGHLIGHTING)
    // ============================================
    function initScrollSpy() {
        const desktopSectionMap = {
            "about": document.querySelector('.glass-btn[href="#about"]'),
            "expertise": document.querySelector('.glass-btn[href="#expertise"]'),
            "works": document.querySelector('.glass-btn[href="#works"]'),
            "contact": document.querySelector('.glass-btn[href="#contact"]')
        };
        const mobileSectionMap = {
            "about": document.querySelector('.mobile-link[href="#about"]'),
            "expertise": document.querySelector('.mobile-link[href="#expertise"]'),
            "works": document.querySelector('.mobile-link[href="#works"]'),
            "contact": document.querySelector('.mobile-link[href="#contact"]')
        };

        const glassBtns = document.querySelectorAll('.glass-btn');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const desktopTarget = desktopSectionMap[id];
                    const mobileTarget = mobileSectionMap[id];

                    if (desktopTarget && !isTouch) {
                        activeBtn = desktopTarget;
                        glassBtns.forEach(btn => btn.classList.remove('nav-active'));
                        desktopTarget.classList.add('nav-active');
                        if (!isNavHovered) {
                            moveBlob(desktopTarget);
                        }
                    }
                    
                    if (mobileTarget) {
                        mobileLinks.forEach(link => link.classList.remove('mobile-active'));
                        mobileTarget.classList.add('mobile-active');
                    }
                }
            });
        }, observerOptions);
        observers.push(observer);

        observers.push(observer);
        Object.keys(desktopSectionMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    activeBtn = null;
                    if (!isTouch) {
                        glassBtns.forEach(btn => btn.classList.remove('nav-active'));
                        if (!isNavHovered) hideBlob();
                    }
                    
                    const heroMobileTarget = document.querySelector('.mobile-link[href="#hero"]');
                    mobileLinks.forEach(link => link.classList.remove('mobile-active'));
                    if (heroMobileTarget) heroMobileTarget.classList.add('mobile-active');
                }
            }, { rootMargin: "-40% 0px -40% 0px" });
            heroObserver.observe(heroSection);
            observers.push(heroObserver);
            observers.push(heroObserver);
        }
    }

    // ============================================
    // CURSOR GLOW
    // ============================================
    let rAF_glow = null;
    function initCursorGlow() {
        if (isTouch || !window.matchMedia('(min-width: 992px)').matches) return;
        const glow = document.createElement('div');
        glow.id = 'cursor-glow';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.willChange = 'transform';
        document.body.appendChild(glow);
        let mx = window.innerWidth / 2, my = window.innerHeight / 2, gx = mx, gy = my;
        document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
        function anim() {
            gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
            glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
            rAF_glow = requestAnimationFrame(anim);
        }
        anim();

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                if (rAF_glow) cancelAnimationFrame(rAF_glow);
            } else {
                anim();
            }
        });
    }

    // ============================================
    // SPLINE OPTIMIZATION
    // ============================================
    function initSplineOptimization() {
        const isTouchDevice = ('ontouchstart' in window);
        const cores = navigator.hardwareConcurrency || 4;
        const ram = navigator.deviceMemory || 4;
        
        // High end: 6+ cores OR 6GB+ RAM (catches flagship phones even if cores are artificially capped by the browser)
        const isHighEndMobile = isTouchDevice && (cores >= 6 || ram >= 6);
        const isBudgetMobile = isTouchDevice && !isHighEndMobile;

        const splineViewer = document.querySelector('spline-viewer');
        if (splineViewer) {
            if (isHighEndMobile) {
                splineViewer.style.pointerEvents = 'auto';
            } else if (isBudgetMobile) {
                splineViewer.style.pointerEvents = 'none';
            }
        }
    }

    // ============================================
    // RUN INITIALIZATION
    // ============================================
    function forceRevealAll() {
        const revealElements = [
            '#mobile-header', '.freelance-badge', '#hero-greeting', '#name-siddharth', '#name-rohit', 
            '.hero-ctas', '.about-photo-container', '.section-header', '.about-greeting', 
            '.about-name', '.about-role-tag', '.about-para', '.stat-pill', '.expertise-label-text', '.title-word', 
            '.expertise-subtext', '.expertise-card', '.works-label-text', '.works-title-word', '.works-subtext', 
            '.work-image-wrap', '.work-number', '.work-name', '.work-category', '.work-desc', '.work-tags', '.work-cta',
            '.contact-label-text', '.contact-title', '.contact-subtext', '.form-group', '.submit-btn', 
            '.info-heading', '.contact-card', '.github-strip', '.footer'
        ];
        
        gsap.set(revealElements, { opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });
        gsap.set(['#glass-nav', '#scroll-indicator'], { opacity: 1, y: 0 });
        gsap.set(['.expertise-label-line', '.works-label-line', '.contact-label-line'], { width: 40 });
        
        initTypingAnimation();
        initExpertiseHover();
    }

    async function init() {
        document.body.style.overflow = 'hidden';

        initSplineOptimization();

        await typeStatus(); 
        await animateProgress(); 
        await showWelcome();
        await fadeLoader();

        document.body.style.overflow = '';

        initNavbarInteractions();
        initMobileMenu();
        initHeroInteractions();
        initContactForm();
        initFaviconAnimation();
        initScrollSpy();
        initCursorGlow();
        
        setTimeout(() => {
            if (window.scrollY > 150) {
                forceRevealAll();
            } else {
                playHeroEntrance();
                initAboutAnimations();
                initExpertiseAnimations();
                initWorksAnimations();
                initContactAnimations();
            }
            ScrollTrigger.refresh();
        }, 150);
    }

    // Cleanup on unload
    window.addEventListener('beforeunload', () => {
        if (rAF_glow) cancelAnimationFrame(rAF_glow);
        if (statusInterval) clearInterval(statusInterval);
        if (progressInterval) clearInterval(progressInterval);
        observers.forEach(obs => obs.disconnect());
    });

    init();

});