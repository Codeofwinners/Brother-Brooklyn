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

// Click "Burst"
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < 8; i++) {
        particlesArray.push(new Particle(x, y, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, Math.random() * 3 + 2, '#ffffff'));
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
        this.blinkSpeed = 0.02 + Math.random() * 0.05;
        this.opacity = Math.random();
    }

    draw() {
        ctx.beginPath();
        // Star/Diamond shape for "Award Winning" look instead of plain circle
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();

        ctx.globalAlpha = 0.6 + Math.sin(this.angle) * 0.4; // Twinkle
        ctx.fillStyle = this.color;

        // localized glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                const push = force * 5;
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
    const colors = ['#00e5ff', '#bd00ff', '#308ce8', '#facc15']; // Cyan, Purple, Blue, Gold

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    // Triangulation (Plexus)
    // Connecting closest 3 neighbors
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = dx * dx + dy * dy;

            // Connection distance squared (faster) ~100px
            if (distance < 10000) {
                // Opacity based on distance
                let opacity = 1 - (distance / 10000);

                // Line
                ctx.strokeStyle = particlesArray[a].color.replace(')', `, ${opacity * 0.5})`).replace('rgb', 'rgba').replace('#', '');

                // Hex conversion fallback
                if (particlesArray[a].color.startsWith('#')) {
                    ctx.strokeStyle = "rgba(255,255,255," + (opacity * 0.2) + ")"; // clean white lines for slickness
                }

                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();

                // Triangulation: Check C
                // Only checking a subset relative to B to save perf? 
                // Actually this O(N^3) loop is dangerous.
                // We rely on standard lines for connections.
                // But let's fill triangles if VERY close.
                /* 
                for (let c = b; c < particlesArray.length; c++) {
                    let dx2 = particlesArray[b].x - particlesArray[c].x;
                    let dy2 = particlesArray[b].y - particlesArray[c].y;
                    let dist2 = dx2*dx2 + dy2*dy2;
                    
                    if (dist2 < 5000) {
                        // A is close to B, B is close to C. Check A to C
                        let dx3 = particlesArray[a].x - particlesArray[c].x;
                        let dy3 = particlesArray[a].y - particlesArray[c].y;
                        let dist3 = dx3*dx3 + dy3*dy3;
                        
                        if(dist3 < 5000) {
                            // Draw TRIANGLE
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                            ctx.lineTo(particlesArray[c].x, particlesArray[c].y);
                            ctx.closePath();
                            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.03})`;
                            ctx.fill();
                        }
                    }
                }
                */
            }
        }
    }
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Slight additive blending
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

init();
animate();
