/**
 * Sakura (Cherry Blossom) Animation
 * Falling petals with swaying motion.
 */

class SakuraSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.petals = [];

        // Configuration
        this.petalCount = 50;

        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);

        this.resize();
        this.initPetals();
        this.animate();

        window.addEventListener('resize', this.resize);
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    initPetals() {
        this.petals = [];
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push(new Petal(this.width, this.height));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.petals.forEach(petal => {
            petal.update(this.width, this.height);
            petal.draw(this.ctx);
        });

        requestAnimationFrame(this.animate);
    }
}

class Petal {
    constructor(width, height) {
        this.init(width, height, true);
    }

    init(width, height, randomStart = false) {
        this.x = Math.random() * width;
        this.y = randomStart ? Math.random() * height : -10;

        // Size and Shape
        this.size = Math.random() * 5 + 8; // 8-13px
        this.w = this.size;
        this.h = this.size * 0.8;

        // Movement properties
        this.vx = (Math.random() - 0.5) * 1.5; // Slight drift
        this.vy = Math.random() * 1 + 1; // Fall speed

        // Swaying
        this.swayAmplitude = Math.random() * 2;
        this.swaySpeed = Math.random() * 0.05 + 0.01;
        this.swayPhase = Math.random() * Math.PI * 2;

        // Rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;

        // Color (Soft/Vibrant Pinks)
        const colors = [
            '255, 183, 197', // Classic Sakura
            '255, 192, 203', // Pink
            '255, 228, 225'  // Misty Rose (Whiteish)
        ];
        this.colorStr = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update(width, height) {
        this.y += this.vy;
        this.swayPhase += this.swaySpeed;
        this.x += Math.sin(this.swayPhase) * this.swayAmplitude + this.vx;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 10 || this.x < -20 || this.x > width + 20) {
            this.init(width, height, false);
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        // Draw a simple petal shape (ellipse-ish with a point)
        // Using a bezier curve for a more petal-like look
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.w / 2, -this.h / 2, this.w, this.h / 2, 0, this.h);
        ctx.bezierCurveTo(-this.w, this.h / 2, -this.w / 2, -this.h / 2, 0, 0);

        ctx.fillStyle = `rgba(${this.colorStr}, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        new SakuraSystem(canvas);
    }
});
