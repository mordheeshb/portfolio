// ============================================================
// MORDHEESHVARA PORTFOLIO — FIRE MODE
// Complete Animation Engine
// ============================================================

// ── 1. Register GSAP Plugins FIRST ───────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── 2. Lenis Smooth Scroll (window-based — most reliable) ─
const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 0.9,
    touchMultiplier: 2,
    infinite: false,
});

// Connect Lenis to GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Connect Lenis scroll events to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// ScrollTrigger uses window by default — no proxy needed

// ── 3. Custom Cursor ──────────────────────────────────────
const cursor   = document.getElementById('custom-cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
    let curX = 0, curY = 0, folX = 0, folY = 0;

    document.addEventListener('mousemove', (e) => {
        curX = e.clientX; curY = e.clientY;
        gsap.to(cursor, { x: curX, y: curY, duration: 0.1, ease: 'none' });
    });

    // Follower lags behind for elegance
    function followCursor() {
        folX += (curX - folX) * 0.1;
        folY += (curY - folY) * 0.1;
        gsap.set(follower, { x: folX, y: folY });
        requestAnimationFrame(followCursor);
    }
    followCursor();

    // Hover effects
    document.querySelectorAll('a, button, .btn, input, textarea, .service-card, .project-row').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// ── 4. Preloader ──────────────────────────────────────────
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');

    gsap.to('.loading-fill', {
        width: '100%',
        duration: 1.8,
        ease: 'power2.inOut',
        onComplete: () => {
            const tl = gsap.timeline();

            tl.to('.loader-ring-outer', { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
              .to('.loader-ring-inner', { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' }, '-=0.2')
              .to('.loader-logo',   { opacity: 0, y: -20, duration: 0.3 }, '-=0.1')
              .to('.loading-text',  { opacity: 0, duration: 0.2 }, '-=0.1')
              .to('.loading-bar',   { opacity: 0, duration: 0.2 }, '-=0.2')
              .to(preloader, {
                    yPercent: -100,
                    duration: 1,
                    ease: 'expo.inOut',
                    onComplete: () => {
                        preloader.style.display = 'none';
                        runHeroAnimations();
                        ScrollTrigger.refresh();
                    }
                });
        }
    });
});

// ── 5. Hero Animations ────────────────────────────────────
function runHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('#hero-eyebrow',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.hero-title .char-wrap',
        { y: '110%' },
        { y: '0%', duration: 1.2, stagger: 0.12, ease: 'expo.out' },
        '-=0.4'
    )
    .fromTo('#hero-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.5'
    )
    .fromTo('#hero-actions',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
    );
}

// ── 6. Navbar — scroll effect ─────────────────────────────
const navbar = document.getElementById('navbar');

lenis.on('scroll', ({ scroll }) => {
    if (scroll > 60) navbar.classList.add('scrolled');
    else             navbar.classList.remove('scrolled');
});

// Active nav link tracker
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link[data-section]');

function updateActiveLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    sections.forEach((section) => {
        const offsetTop    = section.getBoundingClientRect().top + scrollY - 120;
        const offsetBottom = offsetTop + section.offsetHeight;

        if (scrollY >= offsetTop && scrollY < offsetBottom) {
            navLinks.forEach((link) => link.classList.remove('active'));
            const active = document.querySelector(`.nav-link[data-section="${section.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}

lenis.on('scroll', updateActiveLink);

// ── 7. Smooth Anchor Links ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;

        lenis.scrollTo(target, {
            offset: -80,
            duration: 1.6,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        // Close mobile menu if open
        if (document.getElementById('nav-links').classList.contains('open')) {
            toggleMobileMenu(false);
        }
    });
});

// ── 8. Mobile Menu ────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const navLinkList = document.getElementById('nav-links');
const overlay     = document.getElementById('mobile-overlay');

function toggleMobileMenu(force) {
    const isOpen = force !== undefined ? force : !hamburger.classList.contains('active');

    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('open', isOpen);

    if (isOpen) {
        // Inject links into overlay
        if (!overlay.querySelector('.mobile-nav-links')) {
            const mobileLinks = document.createElement('div');
            mobileLinks.className = 'mobile-nav-links';
            mobileLinks.innerHTML = `
                <a href="#about"    class="mobile-nav-link">About</a>
                <a href="#services" class="mobile-nav-link">Services</a>
                <a href="#projects" class="mobile-nav-link">Works</a>
                <a href="#contact"  class="mobile-nav-link">Contact</a>
                <a href="#contact"  class="btn btn-primary" style="margin-top:20px;justify-content:center;">HIRE ME</a>
            `;
            overlay.appendChild(mobileLinks);

            // Style mobile links
            const style = document.createElement('style');
            style.textContent = `
                .mobile-nav-links {
                    display: flex; flex-direction: column;
                    align-items: center; gap: 40px; text-align: center;
                }
                .mobile-nav-link {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem; font-weight: 700;
                    color: var(--text-primary); letter-spacing: 2px;
                    transition: color 0.3s;
                }
                .mobile-nav-link:hover { color: var(--primary-blue); }
            `;
            document.head.appendChild(style);

            overlay.querySelectorAll('a').forEach((a) => {
                a.addEventListener('click', () => toggleMobileMenu(false));
            });
        }

        gsap.fromTo(overlay.querySelector('.mobile-nav-links').children,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
        );
    }
}

if (hamburger) {
    hamburger.addEventListener('click', () => toggleMobileMenu());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleMobileMenu(false);
    });
}

// ── 9. Stats Counter Animation ────────────────────────────
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);

        ScrollTrigger.create({
            trigger: '.stats-bar',
            start: 'top 80%',
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2.2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        counter.textContent = Math.round(this.targets()[0].val);
                    },
                });
            },
            once: true,
        });
    });
}

animateCounters();

// ── 10. Vanilla Tilt (3D tilt on service cards) ───────────
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.service-card[data-tilt]'), {
        max: 10,
        speed: 600,
        glare: true,
        'max-glare': 0.12,
        perspective: 1000,
        scale: 1.02,
        gyroscope: false,
    });
}

// ── 11. Section Reveal Animations ─────────────────────────

// Stats bar
gsap.fromTo('.stats-bar',
    { opacity: 0 },
    {
        scrollTrigger: { trigger: '.stats-bar', start: 'top 85%' },
        opacity: 1, duration: 1, ease: 'power2.out',
    }
);

// About
const aboutTl = gsap.timeline({
    scrollTrigger: { trigger: '.section-about', start: 'top 75%' }
});
aboutTl
    .fromTo('.about-left .section-eyebrow', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 })
    .fromTo('.about-left .section-title',   { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, '-=0.4')
    .fromTo('.about-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 }, '-=0.5')
    .fromTo('.btn-secondary', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
    .fromTo('.skill-pill',
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.04, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.5'
    )
    .fromTo('.badge', { x: -20, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, '-=0.2');

// Services
gsap.fromTo('.section-services .section-eyebrow, .section-services .section-title',
    { y: 40, opacity: 0 },
    {
        scrollTrigger: { trigger: '.section-services', start: 'top 80%' },
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    }
);

gsap.fromTo('.service-card',
    { y: 60, opacity: 0 },
    {
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
        y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out',
    }
);

// Projects
gsap.fromTo('.section-projects .section-eyebrow, .section-projects .section-title',
    { y: 40, opacity: 0 },
    {
        scrollTrigger: { trigger: '.section-projects', start: 'top 80%' },
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    }
);

['#proj-1', '#proj-2', '#proj-3'].forEach((id) => {
    gsap.fromTo(id,
        { y: 80, opacity: 0 },
        {
            scrollTrigger: { trigger: id, start: 'top 82%' },
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        }
    );
});

// Testimonials
gsap.fromTo('.section-testimonials .section-eyebrow, .section-testimonials .section-title',
    { y: 40, opacity: 0 },
    {
        scrollTrigger: { trigger: '.section-testimonials', start: 'top 80%' },
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out',
    }
);

gsap.fromTo('.testimonial-card',
    { y: 60, opacity: 0 },
    {
        scrollTrigger: { trigger: '.testimonials-grid', start: 'top 82%' },
        y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out',
    }
);

// Contact
const contactTl = gsap.timeline({
    scrollTrigger: { trigger: '.section-contact', start: 'top 80%' }
});
contactTl
    .fromTo('.contact-left .section-eyebrow, .contact-left .section-title',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out' }
    )
    .fromTo('.contact-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
    .fromTo('.contact-detail-item', { x: -30, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.7 }, '-=0.4')
    .fromTo('.availability-badge', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')
    .fromTo('.contact-right',
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '<'
    );

// ── 12. Magnetic Button Effect ────────────────────────────
document.querySelectorAll('.btn-primary, .btn-outline, .btn-nav-cta').forEach((btn) => {
    btn.addEventListener('mousemove', function (e) {
        const rect  = this.getBoundingClientRect();
        const cx    = rect.left + rect.width / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) * 0.25;
        const dy    = (e.clientY - cy) * 0.25;
        gsap.to(this, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
        gsap.to(this, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
});

// ── 13. Parallax Hero Text on Scroll ─────────────────────
gsap.to('.hero-content', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
    },
    y: -120,
    opacity: 0.4,
});

// ── 14. Expanding Cards Gallery (Services) ────────────────
const expandCards = document.querySelectorAll('.expand-card');
if (expandCards.length > 0) {
    expandCards.forEach((card, idx) => {
        card.addEventListener('mouseenter', () => {
            expandCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });
}

// ── 15. ScrollTrigger Refresh ─────────────────────────────
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

ScrollTrigger.refresh();

