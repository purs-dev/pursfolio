// JERICHO PURI — DEV HUB CORE GSAP & INTERACTION ENGINE
// Theme: Onyx (#020202) & Candy Blue (#B2D5E5)

document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP plugins if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // =========================================================
    // 1. IN-HOUSE SPLITTEXT ENGINE
    // =========================================================
    function splitTextToChars(element) {
        if (!element) return [];
        const text = element.textContent.trim();
        element.innerHTML = '';
        element.setAttribute('aria-label', text);
        const chars = [];

        const words = text.split(/\s+/);
        words.forEach((word, wIdx) => {
            const wordWrap = document.createElement('span');
            wordWrap.className = 'word-wrap';

            for (let i = 0; i < word.length; i++) {
                const charWrap = document.createElement('span');
                charWrap.className = 'char-wrap';

                const charSpan = document.createElement('span');
                charSpan.className = 'char';
                charSpan.textContent = word[i];

                charWrap.appendChild(charSpan);
                wordWrap.appendChild(charWrap);
                chars.push(charSpan);
            }

            element.appendChild(wordWrap);
            if (wIdx < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
        return chars;
    }

    function splitTextToWords(element) {
        if (!element) return [];
        const text = element.textContent.trim();
        element.innerHTML = '';
        element.setAttribute('aria-label', text);
        const wordSpans = [];

        const words = text.split(/\s+/);
        words.forEach((w, idx) => {
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const wordInner = document.createElement('span');
            wordInner.className = 'char';
            wordInner.textContent = w;
            wrap.appendChild(wordInner);
            element.appendChild(wrap);
            wordSpans.push(wordInner);

            if (idx < words.length - 1) {
                element.appendChild(document.createTextNode(' '));
            }
        });
        return wordSpans;
    }

    // =========================================================
    // 2. PRELOADER SEQUENCE
    // =========================================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const fill = document.getElementById('preloaderSleekFill');
        const counter = document.getElementById('preloaderCounter');
        const particles = document.getElementById('preloaderParticles');

        if (particles) {
            for (let i = 0; i < 50; i++) {
                const p = document.createElement('div');
                p.className = 'preloader-particle';
                p.style.left = `${Math.random() * 100}%`;
                const size = 2 + Math.random() * 3.5;
                p.style.width = `${size}px`;
                p.style.height = `${size}px`;
                p.style.animationDuration = `${2 + Math.random() * 2}s`;
                p.style.animationDelay = `${Math.random() * 1.5}s`;
                particles.appendChild(p);
            }
        }

        const DURATION = 2400;
        const startTime = performance.now();
        let pageLoaded = false;
        let animationDone = false;

        function animatePreloader(now) {
            const elapsed = now - startTime;
            let t = Math.min(elapsed / DURATION, 1);
            let easedT = 1 - Math.pow(1 - t, 3);

            if (pageLoaded && easedT >= 0.8) {
                easedT = Math.min(easedT + (1 - easedT) * 0.1, 1);
            }

            const pct = Math.round(easedT * 100);
            if (fill) fill.style.width = `${pct}%`;
            if (counter) counter.textContent = `${pct}%`;

            if (easedT < 1) {
                requestAnimationFrame(animatePreloader);
            } else {
                animationDone = true;
                tryDismiss();
            }
        }

        function tryDismiss() {
            if (!animationDone || !pageLoaded) return;
            setTimeout(() => {
                preloader.classList.add('loaded');
                document.body.classList.add('page-loaded');
                window.dispatchEvent(new Event('preloaderComplete'));
                initHeroAnimations();
            }, 300);
        }

        requestAnimationFrame(animatePreloader);
        window.addEventListener('load', () => { pageLoaded = true; tryDismiss(); });
        setTimeout(() => { pageLoaded = true; tryDismiss(); }, 5000);
    } else {
        document.body.classList.add('page-loaded');
        initHeroAnimations();
    }

    // =========================================================
    // 3. CUSTOM MAGNETIC CURSOR
    // =========================================================
    const dot = document.querySelector('[data-cursor-dot]');
    const outline = document.querySelector('[data-cursor-outline]');

    if (dot && outline && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;

            if (typeof gsap !== 'undefined') {
                gsap.to(outline, { left: x, top: y, duration: 0.32, ease: "power2.out" });
            } else {
                outline.style.left = `${x}px`;
                outline.style.top = `${y}px`;
            }
        });

        // Hover expansions
        document.querySelectorAll('a, button, .filter-btn, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
        });

        // View mode over experience cards
        document.querySelectorAll('.experience-card').forEach(card => {
            card.addEventListener('mouseenter', () => outline.classList.add('view-mode'));
            card.addEventListener('mouseleave', () => outline.classList.remove('view-mode'));
        });
    }

    // =========================================================
    // 4. MAGNETIC BUTTON PHYSICS
    // =========================================================
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    magneticElements.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.55,
                    ease: "elastic.out(1, 0.4)"
                });
            } else {
                el.style.transform = 'none';
            }
        });
    });

    // =========================================================
    // 5. HERO GSAP SPLITTEXT CHARACTER KINETIC REVEALS
    // =========================================================
    function initHeroAnimations() {
        const titleEl = document.querySelector('[data-split-chars]');
        const manifestoEl = document.querySelector('[data-split-words]');

        if (titleEl && typeof gsap !== 'undefined') {
            const chars = splitTextToChars(titleEl);
            gsap.fromTo(chars,
                { y: 100, rotateX: -80, opacity: 0 },
                {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1.1,
                    stagger: 0.035,
                    ease: "power4.out",
                    delay: 0.15
                }
            );
        }

        if (manifestoEl && typeof gsap !== 'undefined') {
            const words = splitTextToWords(manifestoEl);
            gsap.fromTo(words,
                { y: 25, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.018,
                    ease: "power3.out",
                    delay: 0.5
                }
            );
        }

        initTypewriter();
    }

    // =========================================================
    // 6. DYNAMIC TYPEWRITER
    // =========================================================
    function initTypewriter() {
        const typeEl = document.getElementById('typing-text');
        if (!typeEl) return;

        const words = [
            'A CREATIVE DEVELOPER',
            'A GRAPHICS ARTIST',
            'A VIDEO EDITOR',
            'A UI/UX DESIGNER',
            'A SYSTEMS ARCHITECT'
        ];

        let wi = 0, ci = 0, del = false;

        function type() {
            const word = words[wi];
            typeEl.textContent = del ? word.substring(0, ci - 1) : word.substring(0, ci + 1);
            if (del) ci--; else ci++;

            let speed = del ? 55 : 95;

            if (!del && ci === word.length) {
                speed = 1700;
                del = true;
            } else if (del && ci === 0) {
                del = false;
                wi = (wi + 1) % words.length;
                speed = 450;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, 300);
    }

    // =========================================================
    // 7. 3D PERSPECTIVE SCROLL REVEAL
    // =========================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('expanded');
            } else {
                en.target.classList.remove('expanded');
            }
        });
    }, { threshold: 0.22 });

    document.querySelectorAll('.scroll-reveal, .timeline-item').forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================================
    // 8. SECTION HEADINGS KINETIC SPLITTEXT
    // =========================================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        document.querySelectorAll('.split-heading').forEach((heading) => {
            const chars = splitTextToChars(heading);
            gsap.fromTo(chars,
                { y: 55, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.85,
                    stagger: 0.02,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 88%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }

    // =========================================================
    // 9. TIMELINE PROGRESS TRACKING
    // =========================================================
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const prog = document.getElementById('timelineProgress') || timeline.querySelector('.timeline-progress');
        const dots = timeline.querySelectorAll('.timeline-dot');

        function updateTimeline() {
            const rect = timeline.getBoundingClientRect();
            const start = window.innerHeight / 2;
            const dist = start - rect.top;
            let pct = (dist / rect.height) * 100;
            pct = Math.max(0, Math.min(100, pct));

            if (prog) prog.style.height = `${pct}%`;

            dots.forEach(d => {
                const dotTop = d.getBoundingClientRect().top;
                const bottom = prog.getBoundingClientRect().bottom;
                if (bottom > dotTop) d.classList.add('active');
                else d.classList.remove('active');
            });
        }

        window.addEventListener('scroll', updateTimeline, { passive: true });
        updateTimeline();
    }

    // =========================================================
    // 10. EXPERIENCE CARD MOUSE SPOTLIGHT HALO TRACKING
    // =========================================================
    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        });
    });

    // =========================================================
    // 11. 3D CARD TILT ON MOUSEMOVE
    // =========================================================
    document.querySelectorAll('[data-tilt]').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = ((y - cy) / cy) * -6;
            const ry = ((x - cx) / cx) * 6;

            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    rotationX: rx,
                    rotationY: ry,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: "power1.out"
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
        });
    });

    // =========================================================
    // 12. SKILL FILTERS
    // =========================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            skillCards.forEach(c => {
                const match = f === 'all' || c.dataset.category === f;
                if (match) {
                    c.style.display = '';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(c, { scale: 0.88, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
                    }
                } else {
                    c.style.display = 'none';
                }
            });
        });
    });

    // =========================================================
    // 13. SCROLL PROGRESS BAR
    // =========================================================
    const pBar = document.getElementById('scrollProgressBar');
    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (pBar) pBar.style.width = (h > 0 ? (top / h) * 100 : 0) + '%';
    }, { passive: true });

    // =========================================================
    // 14. FLOATING NAV (SCROLLSPY + SLIDING PILL + MOBILE HAMBURGER)
    // =========================================================
    const nav = document.getElementById('siteNav');
    const indicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const navHamburger = document.getElementById('navHamburger');
    const navPill = document.querySelector('.nav-pill');

    if (nav && navLinks.length) {
        const sections = Array.from(navLinks).map(l => document.getElementById(l.dataset.section)).filter(Boolean);
        let current = 'home';
        let shown = false;

        function moveIndicator(link) {
            if (!link || !indicator || !navPill) return;
            const pillRect = navPill.getBoundingClientRect();
            const linkRect = link.getBoundingClientRect();
            indicator.style.left = `${linkRect.left - pillRect.left}px`;
            indicator.style.width = `${linkRect.width}px`;
        }

        function setActive(id) {
            if (id === current) return;
            current = id;
            navLinks.forEach(l => {
                if (l.dataset.section === id) {
                    l.classList.add('active');
                    moveIndicator(l);
                } else {
                    l.classList.remove('active');
                }
            });
        }

        const spy = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) setActive(en.target.id);
            });
        }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

        sections.forEach(s => spy.observe(s));

        const hero = document.getElementById('home');
        function heroH() { return hero ? hero.offsetHeight : window.innerHeight; }

        function checkNav() {
            const y = window.scrollY;
            if (y > heroH() * 0.45 && !shown) {
                nav.classList.add('nav-visible');
                shown = true;
                requestAnimationFrame(() => moveIndicator(nav.querySelector('.nav-link.active')));
            } else if (y <= heroH() * 0.25 && shown) {
                nav.classList.remove('nav-visible');
                shown = false;
            }
        }

        window.addEventListener('scroll', checkNav, { passive: true });
        window.addEventListener('resize', () => moveIndicator(nav.querySelector('.nav-link.active')));

        navLinks.forEach(l => {
            l.addEventListener('click', (e) => {
                e.preventDefault();
                const t = document.getElementById(l.dataset.section);
                if (t) {
                    t.scrollIntoView({ behavior: 'smooth' });
                    if (navPill) navPill.classList.remove('mobile-open');
                }
            });
        });

        // Initialize indicator position
        window.addEventListener('load', () => moveIndicator(navLinks[0]));
    }

    // Mobile Hamburger Toggle
    if (navHamburger && navPill) {
        navHamburger.addEventListener('click', () => {
            navPill.classList.toggle('mobile-open');
        });
    }

    // =========================================================
    // 15. BACK TO TOP
    // =========================================================
    const btt = document.getElementById('backToTop');
    if (btt) {
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 450), { passive: true });
    }

    // =========================================================
    // 16. CONTACT FORM
    // =========================================================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('sendBtn');
            if (btn) {
                btn.innerHTML = '<span>Message Sent!</span><i class="fa-solid fa-circle-check"></i>';
                btn.classList.add('sent');
                setTimeout(() => {
                    btn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
                    btn.classList.remove('sent');
                }, 3000);
            }
            form.reset();
        });
    }
});
