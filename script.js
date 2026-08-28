document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LUCIDE ICONS INITIALIZATION
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 2. CUSTOM CURSOR & SMOOTH FOLLOWER
    // ==========================================
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Track mouse movement across the viewport
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Main inner cursor dot follows cursor instantly
        if (cursor) {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
    });

    // Smooth physics trailing animation loop for outer cursor circle
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        if (follower) {
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        }

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Custom hover scaling for clickable elements
    const hoverables = document.querySelectorAll('a, button, .project-card, .skill-category-card, .cert-card, .philosophy-card, .timeline-content');
    hoverables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (follower) follower.classList.add('cursor-hover');
            if (cursor) cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            if (follower) follower.classList.remove('cursor-hover');
            if (cursor) cursor.classList.remove('cursor-hover');
        });
    });

    // ==========================================
    // 3. SCROLL PROGRESS INDICATOR
    // ==========================================
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });

    // ==========================================
    // 4. HEADER NAVIGATION & MOBILE MENU TOGGLE
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
            }
        });
    });

    // ==========================================
    // 5. ANIMATED NUMERICAL COUNTERS (KPIs)
    // ==========================================
    const counters = document.querySelectorAll('.kpi-num[data-count]');
    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseFloat(target.getAttribute('data-count'));
                const decimals = parseInt(target.getAttribute('data-decimals') || '0');
                const duration = 2000;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    // Exponential ease-out equation
                    const currentValue = (1 - Math.pow(2, -10 * progress)) * endValue;

                    target.textContent = currentValue.toFixed(decimals);

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        target.textContent = endValue.toFixed(decimals);
                    }
                }

                requestAnimationFrame(updateCount);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // 6. HERO SECTION CHART.JS PREVIEW
    // ==========================================
    const heroCtx = document.getElementById('heroChart');
    if (heroCtx && typeof Chart !== 'undefined') {
        new Chart(heroCtx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 (Next)'],
                datasets: [{
                    label: 'Performance Metrics',
                    data: [65, 78, 85, 92, 98],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f8fafc',
                        bodyColor: '#94a3b8',
                        borderColor: '#1e293b',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
                    }
                }
            }
        });
    }

    // ==========================================
    // 7. PROJECT CASE STUDY MODAL DIALOGS
    // ==========================================
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeBtns = document.querySelectorAll('.modal-close');
    const backdrop = document.getElementById('modal-backdrop');

    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal && backdrop) {
                backdrop.classList.add('active');
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (backdrop) backdrop.classList.remove('active');
        document.querySelectorAll('.modal-box').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ==========================================
    // 8. DYNAMIC SVG BACKGROUND CANVAS GENERATOR
    // ==========================================
    const svgCanvas = document.getElementById('data-canvas');
    if (svgCanvas) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        svgCanvas.setAttribute('viewBox', `0 0 ${width} ${height}`);

        let nodesHTML = '';
        const nodeCount = Math.floor(width / 90);
        for (let i = 0; i < nodeCount; i++) {
            const cx = Math.random() * width;
            const cy = Math.random() * height;
            const r = Math.random() * 2 + 1;
            nodesHTML += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(59, 130, 246, 0.15)" />`;
        }
        svgCanvas.innerHTML = nodesHTML;
    }

    // ==========================================
    // 9. AUTOMATIC FOOTER YEAR UPDATER
    // ==========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});