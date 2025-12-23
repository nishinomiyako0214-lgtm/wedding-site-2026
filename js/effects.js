/**
 * Wedding Site Visual Effects
 * 1. Firefly Cursor (Glowing orb following mouse)
 * 2. Click Sparks (Mini particle explosion on click)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // 1. Firefly Cursor
    // ===========================================
    const firefly = document.createElement('div');
    firefly.classList.add('firefly-cursor');
    document.body.appendChild(firefly);

    let mouseX = 0;
    let mouseY = 0;
    let fireflyX = 0;
    let fireflyY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Show firefly on move (in case it was hidden)
        firefly.style.opacity = '1';
    });

    // Hide when leaving window
    document.addEventListener('mouseout', () => {
        firefly.style.opacity = '0';
    });

    // Smooth follow
    function animateFirefly() {
        // Ease effect
        const speed = 0.15;
        fireflyX += (mouseX - fireflyX) * speed;
        fireflyY += (mouseY - fireflyY) * speed;

        firefly.style.transform = `translate(${fireflyX}px, ${fireflyY}px)`;

        requestAnimationFrame(animateFirefly);
    }
    animateFirefly();


    // ===========================================
    // 2. Click Sparks
    // ===========================================
    document.addEventListener('click', (e) => {
        createSparks(e.clientX, e.clientY);
    });

    function createSparks(x, y) {
        const sparkCount = 8;
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.classList.add('click-spark');
            document.body.appendChild(spark);

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 30 + 10; // Distance
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            // Set initial position
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;

            // Random color from theme
            const colors = ['#C5A065', '#FFFFFF', '#FFD700', '#FF8C00'];
            spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Animate
            const animation = spark.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 400 + Math.random() * 200,
                easing: 'ease-out'
            });

            animation.onfinish = () => {
                spark.remove();
            };
        }
    }

});
