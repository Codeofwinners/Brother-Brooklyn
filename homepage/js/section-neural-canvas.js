const canvas = document.getElementById('hero-neural-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;
let animationFrameId;

// Resize handling
function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
}

// Initial resize
resizeCanvas();

// Mouse interaction (relative to canvas)
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 60) * (canvas.width / 60)
}

// Mouse Events
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch Events (Passive to allow scrolling)
canvas.addEventListener('touchmove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - rect.left;
    mouse.y = event.touches[0].clientY - rect.top;
}, { passive: true });

canvas.addEventListener('touchstart', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.touches[0].clientX - rect.left;
    mouse.y = event.touches[0].clientY - rect.top;
}, { passive: true });

canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

// Click "Burst" Effect
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Push particles away strongly
    particlesArray.forEach(p => {
        let dx = x - p.x;
        let dy = y - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius * 3) {
            let angle = Math.atan2(dy, dx);
            p.directionX -= Math.cos(angle) * 5;
            p.directionY -= Math.sin(angle) * 5;
        }
    });

    // Add new particles at click
    for (let i = 0; i < 5; i++) {
        let size = (Math.random() * 3) + 1;
        let color = '#fff'; // White spark
        particlesArray.push(new Particle(x, y, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, size, color));
    }
});

window.addEventListener('resize', () => {
    resizeCanvas();
    mouse.radius = (canvas.height / 60) * (canvas.width / 60);
    init();
});

// Create Particle
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.baseSize = size;
        this.color = color;
        this.angle = Math.random() * Math.PI * 2; // For pulsing
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Pulse size
        this.angle += 0.05;
        this.size = this.baseSize + Math.sin(this.angle) * 0.5;

        // check collision detection - mouse position / particle position
        // Only if mouse is on canvas or touch is active
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 2;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 2;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 2;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 2;
                }
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// create particle array
function init() {
    particlesArray = [];
    // Adjust density: fewer particles for smaller area
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    // Neuro colors: Cyan, Purple, Blue
    const colors = ['#00e5ff', '#bd00ff', '#308ce8'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2.5) + 1; // Slightly larger max size
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);

        // Faster movement for "alive" feel
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;

        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 18000);

                // Use the color of particle A for the line
                ctx.strokeStyle = particlesArray[a].color.replace(')', `, ${opacityValue})`).replace('rgb', 'rgba').replace('#', '');

                // Quick hex to rgba conversion for lines
                const hex = particlesArray[a].color;
                if (hex.startsWith('#')) {
                    const r = parseInt(hex.slice(1, 3), 16);
                    const g = parseInt(hex.slice(3, 5), 16);
                    const b = parseInt(hex.slice(5, 7), 16);
                    ctx.strokeStyle = `rgba(${r},${g},${b},${opacityValue})`;
                }

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Slight additive blending for neon vibe
    // ctx.globalCompositeOperation = 'screen'; 

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// init and animate
init();
animate();
