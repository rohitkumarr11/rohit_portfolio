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

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursor) {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        if (follower) {
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        }

        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverables = document.querySelectorAll('a, button, .project-card, .skill-category-card, .cert-card, .philosophy-card');
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
    // 3. ELEGANT BALANCED NETWORK BG (NON-DISTRACTING)
    // ==========================================
    let canvas = document.getElementById('interactive-bg-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'interactive-bg-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numParticles = Math.floor((width * height) / 18000);
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1
        });
    }

    function renderNetwork() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(43, 84, 126, 0.3)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(43, 84, 126, ${0.12 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            let mouseDx = p.x - mouseX;
            let mouseDy = p.y - mouseY;
            let mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

            if (mouseDist < 140) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(43, 84, 126, ${0.25 * (1 - mouseDist / 140)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        requestAnimationFrame(renderNetwork);
    }
    renderNetwork();

    // ==========================================
    // 4. SCROLL PROGRESS INDICATOR & ACTIVE NAV LINK
    // ==========================================
    const progressBar = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinkEls.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 5. HEADER SHADOW & MOBILE MENU TOGGLE
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

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 6. ANIMATED NUMERICAL COUNTERS (KPIs)
    // ==========================================
    const counters = document.querySelectorAll('.kpi-num[data-count]');
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
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // ==========================================
    // 7. CHARTS (HERO & PROJECT PREVIEWS)
    // ==========================================
    const heroCtx = document.getElementById('heroChart');
    if (heroCtx && typeof Chart !== 'undefined') {
        new Chart(heroCtx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 (Next)'],
                datasets: [{
                    label: 'Performance Index',
                    data: [65, 78, 85, 92, 98],
                    borderColor: '#2B547E',
                    backgroundColor: 'rgba(43, 84, 126, 0.08)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2B547E'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(0, 0, 0, 0.04)' }, ticks: { color: '#5A5E66' } },
                    y: { grid: { color: 'rgba(0, 0, 0, 0.04)' }, ticks: { color: '#5A5E66' } }
                }
            }
        });
    }

    const proj1Ctx = document.getElementById('project1Chart');
    if (proj1Ctx && typeof Chart !== 'undefined') {
        new Chart(proj1Ctx, {
            type: 'bar',
            data: {
                labels: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'],
                datasets: [{
                    label: 'Sales Vol (Units)',
                    data: [420, 380, 290, 210, 190],
                    backgroundColor: 'rgba(43, 84, 126, 0.75)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#8C9099', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(0, 0, 0, 0.04)' }, ticks: { color: '#8C9099', font: { size: 10 } } }
                }
            }
        });
    }

    // ==========================================
    // 8. CASE STUDY MODALS
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
    // 9. AUTOMATIC FOOTER YEAR
    // ==========================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 10. DYNAMIC PROJECTS FROM JSON (CMS)
    // ==========================================
    fetch('./data/projects.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const projectContainer = document.querySelector('.project-grid');
            if (!projectContainer) return;

            projectContainer.innerHTML = data.items.map(project => `
                <div class="project-card">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tags">
                        ${project.tech_stack.map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer">View Project</a>
                </div>
            `).join('');
        })
        .catch(err => console.error("Failed to load project JSON:", err));
});