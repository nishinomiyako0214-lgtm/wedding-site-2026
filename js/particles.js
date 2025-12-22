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
            this.init(true); // true = random start position
        }

        init(randomY = false) {
            this.x = Math.random() * width;
            // randomY: start anywhere (init), otherwise start at bottom (respawn)
            this.y = randomY ? Math.random() * height : height + 10;

            // Upward velocity (rising sparks)
            this.vx = (Math.random() - 0.5) * 1; // Slight drift
            this.vy = -(Math.random() * 2 + 0.5); // Upward speed

            this.size = Math.random() * 3 + 1;
            this.life = 1; // Alpha/Life
            this.decay = Math.random() * 0.005 + 0.002;

            // Fire Colors: Orange, Gold, Red-ish
            const colors = ['255, 165, 0', '255, 215, 0', '255, 69, 0', '255, 140, 0'];
            this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life -= this.decay;

            // Mouse Interaction (push away or attract? Attract feels like "connecting")
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    // Attract gently
                    this.vx += forceDirectionX * force * 0.05;
                    this.vy += forceDirectionY * force * 0.05;
                }
            }

            // Respawn if off screen or dead
            if (this.y < -10 || this.life <= 0 || this.x < 0 || this.x > width) {
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

    initParticles();

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Draw connections
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Connect only if close enough
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    // Color is mix of both or gold
                    // Alpha based on distance AND lowest life of the pair
                    const opacity = (1 - distance / connectionDistance) * Math.min(particles[i].life, particles[j].life);
                    ctx.strokeStyle = `rgba(255, 200, 100, ${opacity})`; // Warm Gold Lines
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
});
