/**
 * Campfire Sparks Animation
 * Simulates rising sparks connecting to form constellations.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('auth-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    // Mobile: fewer particles, Desktop: more
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;
    const connectionDistance = isMobile ? 100 : 150;
    const mouseDistance = 200;

    // Resize handling
    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor() {
            this.init(true); // true = random start position (for initial fill)
        }

        init(randomStart = false) {
            // Campfire Source: Bottom Center
            const sourceX = width / 2;
            const sourceY = height - 100; // Top of the stand

            if (randomStart) {
                // Initial: Randomly placed in a cone above fire
                this.x = sourceX + (Math.random() - 0.5) * width;
                this.y = Math.random() * sourceY;
                this.life = Math.random();
            } else {
                // Respawn: At the source (fire pit)
                this.x = sourceX + (Math.random() - 0.5) * 20; // Tight cluster at source
                this.y = sourceY + (Math.random() * 20);
                this.life = 1;
            }

            // Upward Cone Velocity
            // Spread increases as they go up (random X velocity)
            this.vx = (Math.random() - 0.5) * 3 + (this.x - sourceX) * 0.02;
            this.vy = -(Math.random() * 3 + 1); // Fast upward

            this.size = Math.random() * 3 + 1;
            this.decay = Math.random() * 0.01 + 0.005;

            // Fire Colors
            const colors = ['255, 165, 0', '255, 215, 0', '255, 69, 0', '255, 140, 0'];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;

            // Wind/Mouse effect
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    const force = (mouseDistance - distance) / mouseDistance;
                    this.vx += (dx / distance) * force * 0.5;
                }
            }

            // Respawn
            if (this.life <= 0 || this.y < -10 || this.x < 0 || this.x > width) {
                this.init(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colorBase}, ${this.life})`;
            ctx.fill();
        }
    }

    // Initialize particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw Campfire Stand
    function drawStand() {
        const cx = width / 2;
        const cy = height; // Bottom of canvas
        const standHeight = 100;
        const standTopWidth = 60;
        const standBottomWidth = 100;

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Faint white/grey lines
        ctx.lineJoin = 'round';

        // Main Stand (Trapezoid / Mesh)
        ctx.beginPath();
        // Left Leg
        ctx.moveTo(cx - standTopWidth, cy - standHeight);
        ctx.lineTo(cx - standBottomWidth, cy);

        // Right Leg
        ctx.moveTo(cx + standTopWidth, cy - standHeight);
        ctx.lineTo(cx + standBottomWidth, cy);

        // Cross bars (mesh pattern)
        ctx.moveTo(cx - standTopWidth, cy - standHeight);
        ctx.lineTo(cx + standBottomWidth, cy);

        ctx.moveTo(cx + standTopWidth, cy - standHeight);
        ctx.lineTo(cx - standBottomWidth, cy);

        // Horizontal Support
        ctx.moveTo(cx - (standTopWidth + 10), cy - standHeight + 40);
        ctx.lineTo(cx + (standTopWidth + 10), cy - standHeight + 40);

        ctx.stroke();

        // Glow at base
        const gradient = ctx.createRadialGradient(cx, cy - standHeight + 20, 10, cx, cy - standHeight, 100);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - 100, cy - 150, 200, 150);
    }

    initParticles();

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Stand first (background)
        drawStand();

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connections
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Only connect if reasonable life left (avoid flickering ghosts)
                    if (particles[i].life > 0.2 && particles[j].life > 0.2) {
                        ctx.beginPath();
                        const opacity = (1 - distance / connectionDistance) * Math.min(particles[i].life, particles[j].life) * 0.5;
                        ctx.strokeStyle = `rgba(255, 180, 50, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
});
