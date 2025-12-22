/**
 * Campfire Sparks Animation
 * Simulates rising sparks connecting to form constellations.
 * Supports multiple instances with optional "Stand" drawing.
 */

class CampfireSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.particles = [];
        this.showStand = canvas.getAttribute('data-show-stand') === 'true';

        // Configuration
        this.isMobile = window.innerWidth < 768;
        this.particleCount = this.isMobile ? 40 : 80;
        this.connectionDistance = this.isMobile ? 100 : 150;
        this.mouseDistance = 200;

        // Mouse State (Relative to this canvas)
        this.mouse = { x: null, y: null };

        // Bind methods
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);

        // Init
        this.setupEvents();
        this.resize();
        this.initParticles();
        this.animate();
    }

    setupEvents() {
        window.addEventListener('resize', this.resize);
        // Track mouse relative to the specifically focused canvas (or window for simplicity)
        // Using window listener but calculating offset relative to canvas bbox
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseleave', this.handleMouseLeave);
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        // Check if mouse is near/over this canvas (optimization)
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        } else {
            this.mouse.x = null;
            this.mouse.y = null;
        }
    }

    handleMouseLeave() {
        this.mouse.x = null;
        this.mouse.y = null;
    }

    resize() {
        if (this.canvas.offsetParent) {
            this.width = this.canvas.width = this.canvas.parentElement.offsetWidth;
            this.height = this.canvas.height = this.canvas.parentElement.offsetHeight;
        }
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height, this.showStand));
        }
    }

    drawStand() {
        const cx = this.width / 2;
        const cy = this.height; // Bottom of canvas
        const standHeight = 100;
        const standTopWidth = 60;
        const standBottomWidth = 100;

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // Faint white/grey lines
        this.ctx.lineJoin = 'round';

        // Main Stand (Trapezoid / Mesh)
        this.ctx.beginPath();
        // Left Leg
        this.ctx.moveTo(cx - standTopWidth, cy - standHeight);
        this.ctx.lineTo(cx - standBottomWidth, cy);

        // Right Leg
        this.ctx.moveTo(cx + standTopWidth, cy - standHeight);
        this.ctx.lineTo(cx + standBottomWidth, cy);

        // Cross bars (mesh pattern)
        this.ctx.moveTo(cx - standTopWidth, cy - standHeight);
        this.ctx.lineTo(cx + standBottomWidth, cy);

        this.ctx.moveTo(cx + standTopWidth, cy - standHeight);
        this.ctx.lineTo(cx - standBottomWidth, cy);

        // Horizontal Support
        this.ctx.moveTo(cx - (standTopWidth + 10), cy - standHeight + 40);
        this.ctx.lineTo(cx + (standTopWidth + 10), cy - standHeight + 40);

        this.ctx.stroke();

        // Glow at base
        const gradient = this.ctx.createRadialGradient(cx, cy - standHeight + 20, 10, cx, cy - standHeight, 100);
        gradient.addColorStop(0, 'rgba(255, 100, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(cx - 100, cy - 150, 200, 150);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Optional Stand
        if (this.showStand) {
            this.drawStand();
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.width, this.height, this.mouse, this.mouseDistance, this.showStand);
            this.particles[i].draw(this.ctx);

            // Connections
            for (let j = i; j < this.particles.length; j++) {
                let dx = this.particles[i].x - this.particles[j].x;
                let dy = this.particles[i].y - this.particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    if (this.particles[i].life > 0.2 && this.particles[j].life > 0.2) {
                        this.ctx.beginPath();
                        const opacity = (1 - distance / this.connectionDistance) * Math.min(this.particles[i].life, this.particles[j].life) * 0.5;
                        this.ctx.strokeStyle = `rgba(255, 180, 50, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.stroke();
                    }
                }
            }
        }
        requestAnimationFrame(this.animate);
    }
}

// Particle Class
class Particle {
    constructor(width, height, showStand) {
        this.init(width, height, showStand, true);
    }

    init(width, height, showStand, randomStart = false) {
        // Source depends on mode
        let sourceX = width / 2;
        let sourceY = height + 20;

        if (showStand) {
            sourceY = height - 100; // Stand top
            // Constrained to center
            if (randomStart) {
                this.x = sourceX + (Math.random() - 0.5) * width;
                this.y = Math.random() * sourceY;
            } else {
                this.x = sourceX + (Math.random() - 0.5) * 20;
                this.y = sourceY + (Math.random() * 20);
            }
        } else {
            // Full width spawn (Menu Mode)
            if (randomStart) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
            } else {
                this.x = Math.random() * width;
                this.y = height + 10;
            }
        }

        this.life = randomStart ? Math.random() : 1;

        // Upward velocity
        if (showStand) {
            // Cone shape
            this.vx = (Math.random() - 0.5) * 3 + (this.x - sourceX) * 0.02;
            this.vy = -(Math.random() * 3 + 1);
        } else {
            // Gentle drift up
            this.vx = (Math.random() - 0.5) * 1;
            this.vy = -(Math.random() * 2 + 0.5);
        }

        this.size = Math.random() * 3 + 1;
        this.decay = Math.random() * 0.01 + 0.005;

        // Fire Colors
        const colors = ['255, 165, 0', '255, 215, 0', '255, 69, 0', '255, 140, 0'];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update(width, height, mouse, mouseDistance, showStand) {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        // Mouse Interaction
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
            this.init(width, height, showStand, false);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colorBase}, ${this.life})`;
        ctx.fill();
    }
}

// Initialize all canvases with class 'campfire-canvas'
document.addEventListener('DOMContentLoaded', () => {
    // 1. Find explicit auth canvas (legacy ID) and add class if needed
    const oldAuth = document.getElementById('auth-canvas');
    if (oldAuth && !oldAuth.classList.contains('campfire-canvas')) {
        oldAuth.classList.add('campfire-canvas');
        if (!oldAuth.hasAttribute('data-show-stand')) {
            oldAuth.setAttribute('data-show-stand', 'true');
        }
    }

    // 2. Init all
    const canvases = document.querySelectorAll('.campfire-canvas');
    canvases.forEach(canvas => {
        new CampfireSystem(canvas);
    });
});
