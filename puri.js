// JERICHO PURI — PORTFOLIO JS

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. CUSTOM CURSOR
    // =========================================================
    const dot = document.querySelector('[data-cursor-dot]');
    const outline = document.querySelector('[data-cursor-outline]');

    if (dot && outline && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        function animateOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.left = `${outlineX}px`;
            outline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateOutline);
        }
        animateOutline();

        document.querySelectorAll('a, button, .filter-btn, .skill-card').forEach(el => {
            el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
            el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
        });
    }

    // =========================================================
    // 2. SCROLL PROGRESS BAR
    // =========================================================
    const pBar = document.getElementById('scrollProgressBar');
    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (pBar) pBar.style.width = (h > 0 ? (top / h) * 100 : 0) + '%';
    }, { passive: true });

    // =========================================================
    // 3. FLOATING NAV (SCROLLSPY + INDICATOR)
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

        window.addEventListener('load', () => moveIndicator(navLinks[0]));
    }

    // Mobile Hamburger
    if (navHamburger && navPill) {
        navHamburger.addEventListener('click', () => {
            navPill.classList.toggle('mobile-open');
        });
    }

    // =========================================================
    // 4. SCROLL REVEAL
    // =========================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                en.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item, .card, .cert-card, .profile-card').forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================================
    // 5. TIMELINE PROGRESS
    // =========================================================
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const prog = document.getElementById('timelineProgress');

        function updateTimeline() {
            const rect = timeline.getBoundingClientRect();
            const start = window.innerHeight / 2;
            const dist = start - rect.top;
            let pct = (dist / rect.height) * 100;
            pct = Math.max(0, Math.min(100, pct));
            if (prog) prog.style.height = `${pct}%`;
        }

        window.addEventListener('scroll', updateTimeline, { passive: true });
        updateTimeline();
    }

    // =========================================================
    // 6. SKILL FILTERS
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
                c.style.display = match ? '' : 'none';
            });
        });
    });

    // =========================================================
    // 7. BACK TO TOP
    // =========================================================
    const btt = document.getElementById('backToTop');
    if (btt) {
        btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 450), { passive: true });
    }

    // =========================================================
    // 8. CONTACT FORM
    // =========================================================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('sendBtn');
            if (btn) {
                btn.innerHTML = '<span>Sent!</span><i class="fa-solid fa-check"></i>';
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
