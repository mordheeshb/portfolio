// ============================================================
// MORDHEESHVARA PORTFOLIO — FIRE MODE
// Complete Animation Engine
// ============================================================

// ── 1. Register GSAP Plugins FIRST ───────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── 2. Lenis Smooth Scroll (window-based — most reliable) ─
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 0.8,
    touchMultiplier: 2,
    infinite: false,
});

// Connect Lenis to GSAP ticker
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Connect Lenis scroll events to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// ── 3. Custom Cursor Follower ───────────────────────────────
const customCursor = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (customCursor && cursorFollower) {
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let folX = curX;
    let folY = curY;
    
    // Follower needs centering, customCursor is tip-aligned
    gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

    document.addEventListener('mousemove', (e) => {
        curX = e.clientX; 
        curY = e.clientY;
        gsap.set(customCursor, { x: curX, y: curY });
    });

    function followCursor() {
        folX += (curX - folX) * 0.15; // Smooth trailing
        folY += (curY - folY) * 0.15;
        gsap.set(cursorFollower, { x: folX, y: folY });
        requestAnimationFrame(followCursor);
    }
    followCursor();

    document.querySelectorAll('a, button, .btn, input, textarea, .project-row, [data-cursor-text]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
            customCursor.classList.add('hover');
            cursorFollower.classList.add('hover');
            const text = el.getAttribute('data-cursor-text');
            if (text) {
                cursorFollower.classList.add('has-text');
                cursorFollower.setAttribute('data-text', text);
            }
        });
        el.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
            cursorFollower.classList.remove('has-text');
            cursorFollower.removeAttribute('data-text');
        });
    });

    // Magnetic Buttons Logic
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.6,
                ease: "power3.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// ── 4. Preloader ──────────────────────────────────────────
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader || preloader.dataset.loaded) return;
    preloader.dataset.loaded = 'true';

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
}

window.addEventListener('load', hidePreloader);
// Fallback in case 'load' event doesn't fire (e.g., due to a failed external asset)
setTimeout(hidePreloader, 3000);

// ── 5. Hero Animations ────────────────────────────────────
function runHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // BlurText effect integration
    tl.fromTo('#hero-eyebrow',
        { opacity: 0, y: 24, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }
    )
    .fromTo('.hero-title .char-wrap',
        { y: '120%', opacity: 0, filter: 'blur(15px)', rotateX: -90, transformOrigin: 'top center' },
        { y: '0%', opacity: 1, filter: 'blur(0px)', rotateX: 0, duration: 1.6, stagger: 0.08, ease: 'expo.out' },
        '-=0.6'
    )
    .fromTo('#hero-desc',
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        '-=1.0'
    )
    .fromTo('#hero-actions',
        { opacity: 0, y: 20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.8'
    )
    .fromTo('.hero-profile-wrapper',
        { opacity: 0, scale: 0.9, filter: 'blur(20px)', rotateY: -15 },
        { opacity: 1, scale: 1, filter: 'blur(0px)', rotateY: 0, duration: 1.5, ease: 'expo.out' },
        '-=1.2'
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

// ── 10. GSAP Section Reveals & Parallax ───────────────────
// Fade up and scale sections
document.querySelectorAll('section').forEach((section) => {
    // Skip hero since it has its own reveal
    if (section.classList.contains('hero')) return;
    
    gsap.fromTo(section, 
        { opacity: 0, y: 60, scale: 0.98 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                once: true
            }
        }
    );
});

// Image Parallax Effect
document.querySelectorAll('.project-img-wrap img').forEach((img) => {
    gsap.to(img, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
});
// ── 10. Vanilla Tilt (3D tilt on service cards) ───────────
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.expand-card[data-tilt]'), {
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

gsap.fromTo('.expand-card',
    { y: 60, opacity: 0 },
    {
        scrollTrigger: { trigger: '.services-expand-container', start: 'top 80%' },
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

// ── 16. i18n — EN / FR Language Switcher ──────────────────
(function() {
    const translations = {
        en: {
            // Nav
            nav_home: 'Home',
            nav_about: 'About',
            nav_works: 'Works',
            nav_contact: 'Contact',
            nav_hire: 'RESUME',

            // Hero
            hero_eyebrow: '<span class="eyebrow-line"></span>SOFTWARE ENGINEER | AI & DATA SCIENCE<span class="eyebrow-line"></span>',
            hero_title_1: 'I BUILD',
            hero_title_2: 'SCALABLE',
            hero_title_3: 'SYSTEMS',
            hero_desc: 'From intelligent AI-driven platforms to robust full-stack web applications — I engineer <strong>performant, scalable, and secure</strong> solutions with modern technologies.',
            hero_view_work: 'VIEW MY WORK',
            hero_hire_me: 'RESUME',

            // About
            about_eyebrow: 'WHO I AM',
            about_title_1: "THE STORY",
            about_title_2: 'Behind the Code',
            about_desc_1: "I'm <strong>Mordheeshvara</strong> — a final-year B.Tech student in Artificial Intelligence & Data Science, Smart India Hackathon (SIH) <strong>national finalist</strong>, and a passionate Software Engineer.",
            about_desc_2: 'I specialise in engineering <strong>full-stack AI-powered platforms</strong> and scalable cloud architectures. Currently seeking full-time opportunities where I can apply my deep technical stack to solve complex, real-world problems.',
            about_dossier: 'DOWNLOAD DOSSIER',

            // Badges
            badge_sih: 'SIH National Finalist',
            badge_aws: 'AWS Certified',
            badge_global: 'Global Reach',

            // Projects
            projects_eyebrow: 'PORTFOLIO',
            projects_title_1: 'SELECTED',
            projects_title_2: 'WORKS',
            projects_p1_title: 'AI-Powered Cloud Security Platform',
            projects_p1_desc: 'Enterprise-grade platform using FastAPI and Next.js enabling read-only security analysis via AWS STS AssumeRole. Audit logging mapped to CIS, ISO 27001, and SOC 2 frameworks with real-time compliance scoring.',
            projects_p1_link: 'DISCUSS THIS PROJECT',
            projects_p2_title: 'Buylo — Premium E-Commerce Platform',
            projects_p2_desc: 'A luxury-inspired e-commerce platform built with Next.js and Framer Motion. Engineered real-time inventory workflows, optimised core web vitals to 98+ Lighthouse score, and integrated a seamless multi-step checkout.',
            projects_p2_link: 'DISCUSS THIS PROJECT',
            projects_p3_title: 'AI Analytics & Prediction Dashboard',
            projects_p3_desc: 'Predictive modelling dashboard with real-time anomaly detection, data forecasting visualisations and an integrated generative AI assistant. Deployed on AWS Lambda with FastAPI backend and React frontend.',
            projects_p3_link: 'DISCUSS THIS PROJECT',

            // Le Noyau (Design Philosophy)
            noyau_eyebrow: 'THE CORE',
            noyau_title_1: 'DESIGN',
            noyau_title_2: 'PHILOSOPHY',
            noyau_h1: 'Precision Over Decoration',
            noyau_p1: 'Every line of code is a deliberate decision. I don\'t decorate \u2014 I engineer. Clean architecture, optimised performance, and invisible complexity.',
            noyau_h2: 'Elegance in Logic',
            noyau_p2: 'The best interfaces feel inevitable \u2014 as if they couldn\'t exist any other way. That simplicity is the result of relentless iteration and deep systems thinking.',
            noyau_h3: 'Future-Native Engineering',
            noyau_p3: 'I build for what\'s next \u2014 AI orchestration, edge computing, serverless-first. Every project is designed to evolve, not just to launch.',
            noyau_tagline: '"Code is not just logic; it is poetry."',

            // Contact
            contact_eyebrow: 'GET IN TOUCH',
            contact_title_1: 'LET\'S',
            contact_title_2: 'Connect',
            contact_desc: "Looking for a passionate Software Engineer? Let's talk about how I can add value to your engineering team.",
            contact_availability: 'Open to Full-Time Roles',
            contact_label_name: 'Your Name',
            contact_label_email: 'Email Address',
            contact_label_message: 'Message',
            contact_btn_send: 'SEND MESSAGE',
            contact_success: "Message sent! I'll get back to you within 24 hours.",

            // Footer
            footer_desc: 'Software Engineer & AI Enthusiast<br>building scalable digital experiences.',
            footer_bottom: '© 2026 Mordheeshvara. All rights reserved.',
        },

        fr: {
            // Nav
            nav_home: 'Accueil',
            nav_about: 'À Propos',
            nav_works: 'Projets',
            nav_contact: 'Contact',
            nav_hire: 'CV',

            // Hero
            hero_eyebrow: '<span class="eyebrow-line"></span>INGÉNIEUR LOGICIEL | IA & DATA SCIENCE<span class="eyebrow-line"></span>',
            hero_title_1: 'JE CRÉE',
            hero_title_2: 'DES SYSTÈMES',
            hero_title_3: 'ÉVOLUTIFS',
            hero_desc: 'Des plateformes intelligentes basées sur l\'IA aux applications web robustes — je conçois des solutions <strong>performantes, évolutives et sécurisées</strong> avec des technologies modernes.',
            hero_view_work: 'VOIR MES PROJETS',
            hero_hire_me: 'CV',

            // About
            about_eyebrow: 'QUI SUIS-JE',
            about_title_1: "L'HISTOIRE",
            about_title_2: 'Derrière le Code',
            about_desc_1: "Je suis <strong>Mordheeshvara</strong> — étudiant en dernière année de B.Tech en Intelligence Artificielle & Data Science, <strong>finaliste national</strong> du Smart India Hackathon (SIH), et Ingénieur Logiciel passionné.",
            about_desc_2: "Je me spécialise dans la création de <strong>plateformes full-stack propulsées par l'IA</strong> et d'architectures cloud évolutives. Actuellement à la recherche d'opportunités à temps plein où je peux appliquer mes compétences techniques pour résoudre des problèmes complexes.",
            about_dossier: 'TÉLÉCHARGER LE DOSSIER',

            // Badges
            badge_sih: 'Finaliste National SIH',
            badge_aws: 'Certifié AWS',
            badge_global: 'Portée Mondiale',

            // Projects
            projects_eyebrow: 'PORTFOLIO',
            projects_title_1: 'PROJETS',
            projects_title_2: 'SÉLECTIONNÉS',
            projects_p1_title: 'Plateforme IA de Sécurité Cloud',
            projects_p1_desc: 'Plateforme de niveau entreprise utilisant FastAPI et Next.js permettant une analyse de sécurité en lecture seule via AWS STS AssumeRole. Journalisation d\'audit conforme aux référentiels CIS, ISO 27001 et SOC 2 avec scoring de conformité en temps réel.',
            projects_p1_link: 'DISCUTER DE CE PROJET',
            projects_p2_title: 'Buylo — Plateforme E-Commerce Premium',
            projects_p2_desc: 'Plateforme e-commerce d\'inspiration luxe construite avec Next.js et Framer Motion. Workflows d\'inventaire en temps réel, core web vitals optimisés à 98+ Lighthouse, et checkout multi-étapes intégré.',
            projects_p2_link: 'DISCUTER DE CE PROJET',
            projects_p3_title: 'Tableau de Bord IA & Prédiction',
            projects_p3_desc: 'Tableau de bord de modélisation prédictive avec détection d\'anomalies en temps réel, visualisations de prévisions et assistant IA génératif intégré. Déployé sur AWS Lambda avec backend FastAPI et frontend React.',
            projects_p3_link: 'DISCUTER DE CE PROJET',

            // Le Noyau (Design Philosophy)
            noyau_eyebrow: 'LE NOYAU',
            noyau_title_1: 'PHILOSOPHIE',
            noyau_title_2: 'DE DESIGN',
            noyau_h1: 'La Précision Avant la Décoration',
            noyau_p1: 'Chaque ligne de code est une décision délibérée. Je ne décore pas \u2014 j\'ingénierie. Architecture propre, performance optimisée, et complexité invisible.',
            noyau_h2: 'L\'Élégance dans la Logique',
            noyau_p2: 'Les meilleures interfaces semblent inévitables \u2014 comme si elles ne pouvaient exister autrement. Cette simplicité est le fruit d\'itérations acharnées et d\'une pensée systémique profonde.',
            noyau_h3: 'Ingénierie Native du Futur',
            noyau_p3: 'Je construis pour ce qui vient \u2014 orchestration IA, edge computing, serverless-first. Chaque projet est conçu pour évoluer, pas seulement pour être lancé.',
            noyau_tagline: '« Le code n\'est pas seulement de la logique ; c\'est de la poésie. »',

            // Contact
            contact_eyebrow: 'CONTACTEZ-MOI',
            contact_title_1: 'CONNECTONS',
            contact_title_2: 'Nous',
            contact_desc: 'À la recherche d\'un Ingénieur Logiciel passionné ? Discutons de la manière dont je peux apporter de la valeur à votre équipe.',
            contact_availability: 'Ouvert aux rôles à temps plein',
            contact_label_name: 'Votre Nom',
            contact_label_email: 'Adresse E-mail',
            contact_label_message: 'Message',
            contact_btn_send: 'ENVOYER LE MESSAGE',
            contact_success: 'Message envoyé ! Je vous répondrai dans les 24 heures.',

            // Footer
            footer_desc: 'Ingénieur Logiciel & Passionné d\'IA<br>créateur de systèmes évolutifs.',
            footer_bottom: '© 2026 Mordheeshvara. Tous droits réservés.',
        }
    };

    let currentLang = localStorage.getItem('portfolio-lang') || 'en';

    function applyTranslations(lang) {
        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                // Animate: fade out, swap, fade in
                el.style.transition = 'opacity 0.25s ease';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.innerHTML = dict[key];
                    el.style.opacity = '1';
                }, 250);
            }
        });

        // Update <html> lang attribute
        document.documentElement.lang = lang;

        // Update active button state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Persist choice
        localStorage.setItem('portfolio-lang', lang);
        currentLang = lang;
    }

    // Bind click events
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang === currentLang) return;
            applyTranslations(lang);
        });
    });

    // Apply saved language on load (skip if English — it's the default HTML)
    if (currentLang !== 'en') {
        applyTranslations(currentLang);
    }
})();

// ── 16.5 Theme Switcher ───────────────────────────────────────
(function() {
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    let isLightMode = savedTheme === 'light' || (!savedTheme && systemPrefersLight);
    
    function applyTheme() {
        if (isLightMode) {
            document.documentElement.setAttribute('data-theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        localStorage.setItem('portfolio-theme', isLightMode ? 'light' : 'dark');
    }
    
    applyTheme(); // Run on load
    
    themeBtn.addEventListener('click', () => {
        isLightMode = !isLightMode;
        applyTheme();
    });
})();

// ══════════════════════════════════════════════════════════════
// FUTURISTIC EFFECTS — Cyberpunk Layer
// ══════════════════════════════════════════════════════════════

// ── 17. Text Scramble Effect (on section eyebrows in view) ──
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#ﾊﾐﾋ01';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const len = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < len; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20);
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            const { from, to, start, end } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                const r = this.chars[Math.floor(Math.random() * this.chars.length)];
                output += `<span style="opacity:0.4;color:var(--primary-blue)">${r}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply scramble to section eyebrows when they enter view
const eyebrows = document.querySelectorAll('.section-eyebrow');
eyebrows.forEach(el => {
    const originalText = el.textContent.trim();
    const scrambler = new TextScramble(el);
    let triggered = false;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !triggered) {
                triggered = true;
                // Small delay before scramble
                setTimeout(() => {
                    scrambler.setText(originalText);
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    obs.observe(el);
});

// ── 18. Periodic Glitch Flicker on Hero Highlight ──────────
const heroHighlight = document.querySelector('.hero-title .highlight-text');
if (heroHighlight) {
    setInterval(() => {
        // Random glitch trigger every 4-10 seconds
        const delay = Math.random() * 6000 + 4000;
        setTimeout(() => {
            heroHighlight.style.animation = 'none';
            // Force reflow
            void heroHighlight.offsetHeight;
            heroHighlight.style.animation = '';
        }, delay);
    }, 10000);
}

// ── 19. Matrix Rain — REMOVED for 60fps performance ─────────
// (Canvas redraws at 16fps were consuming GPU/CPU)


// ── 20. HUD Corner Bracket Inject on Cards ─────────────────
document.querySelectorAll('.project-row, .testimonial-card.featured').forEach(el => {
    // Wrap in a hud-frame div for styled corners
    el.classList.add('hud-frame');
});

// ── 21. Click spark (lightweight — only 3 particles) ────────
document.addEventListener('click', (e) => {
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        const angle = (120 * i) + Math.random() * 40;
        const dist = 20 + Math.random() * 15;
        const rad = (angle * Math.PI) / 180;

        dot.style.cssText = `
            position:fixed; left:${e.clientX}px; top:${e.clientY}px;
            width:3px; height:3px; border-radius:50%;
            background:var(--primary-blue); pointer-events:none;
            z-index:99999; opacity:1;
            transform:translate(-50%,-50%);
            transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s ease;
        `;
        document.body.appendChild(dot);
        requestAnimationFrame(() => {
            dot.style.transform = `translate(calc(-50% + ${Math.cos(rad)*dist}px), calc(-50% + ${Math.sin(rad)*dist}px))`;
            dot.style.opacity = '0';
        });
        setTimeout(() => dot.remove(), 450);
    }
});

// ── 22. 3D Tilt — Only on HUD card (lightweight) ───────────
document.querySelectorAll('.noyau-hud-card').forEach(el => {
    el.classList.add('tilt-card');
    let glare = el.querySelector('.tilt-glare');
    if (!glare) {
        glare = document.createElement('div');
        glare.classList.add('tilt-glare');
        el.appendChild(glare);
    }

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((e.clientY - rect.top - centerY) / centerY) * -6;
        const tiltY = ((e.clientX - rect.left - centerX) / centerX) * 6;
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01,1.01,1.01)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    });
});

// ── 23. Chromatic Aberration — REMOVED for performance ──────
// (Applying filter to body triggers full-page repaint = lag)

// ── 24. Video Modal Logic (Global & Cinematic) ─────────────────
window.openVideoModal = (videoUrl) => {
    const videoModal = document.getElementById('video-modal');
    const projectVideo = document.getElementById('project-video');
    if (!videoModal) return;

    if (projectVideo && videoUrl) {
        projectVideo.src = videoUrl;
    }

    videoModal.classList.add('active');
    
    // Cinematic Reveal
    gsap.fromTo('.video-modal-content', 
        { scale: 0.8, y: 60, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)' }
    );
    
    gsap.fromTo('.video-modal-close',
        { scale: 0, rotate: -90 },
        { scale: 1, rotate: 0, duration: 0.6, delay: 0.4, ease: 'back.out(2)' }
    );

    if (projectVideo && typeof projectVideo.play === 'function') projectVideo.play();
};

window.closeVideoModal = () => {
    const videoModal = document.getElementById('video-modal');
    const projectVideo = document.getElementById('project-video');
    if (!videoModal) return;

    // Cinematic Exit
    gsap.to('.video-modal-content', {
        scale: 0.9, y: 40, opacity: 0, duration: 0.4, ease: 'power2.in'
    });
    
    setTimeout(() => {
        videoModal.classList.remove('active');
        if (projectVideo) {
            const currentSrc = projectVideo.src;
            projectVideo.src = currentSrc.replace('&autoplay=1', '');
            if (typeof projectVideo.pause === 'function') {
                projectVideo.pause();
                projectVideo.currentTime = 0;
            }
        }
    }, 400); // match duration
};
