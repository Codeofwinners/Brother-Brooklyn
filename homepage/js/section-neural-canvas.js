const canvas = document.getElementById('hero-neural-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
let animationFrameId;

function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
}

resizeCanvas();

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 60) * (canvas.width / 60)
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < 6; i++) {
        // Burst with colorful sparks
        const sparkColors = ['#7c3aed', '#d97706', '#0891b2'];
        let color = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        particlesArray.push(new Particle(x, y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, Math.random() * 3 + 2, color));
    }
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.baseSize = size;
        this.color = color;
        this.angle = Math.random() * 6.2;
        this.blinkSpeed = 0.005 + Math.random() * 0.01;
        this.friction = 0.98;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();

        ctx.globalAlpha = 0.6 + Math.sin(this.angle) * 0.4;
        ctx.fillStyle = this.color;

        ctx.fill();
        ctx.globalAlpha = 1;
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        if (Math.abs(this.directionX) > 0.5) this.directionX *= 0.96;
        if (Math.abs(this.directionY) > 0.5) this.directionY *= 0.96;

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                const push = force * 2;
                this.x -= Math.cos(angle) * push;
                this.y -= Math.sin(angle) * push;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.angle += this.blinkSpeed;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 6000;

    // VIBRANT DEEP COLORS for Cream Background
    // Deep Violet, Teal, Royal Blue, Amber/Gold
    const colors = ['#7c3aed', '#0891b2', '#2563eb', '#d97706'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2.5) + 1.5; // Slightly larger to POP
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < 10000) {
                let opacity = 1 - (distance / 10000);

                // Light Grey Lines (Black with low opacity)
                ctx.strokeStyle = "rgba(0, 0, 0," + (opacity * 0.08) + ")";

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();
