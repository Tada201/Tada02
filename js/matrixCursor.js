class MatrixCursor {
    constructor() {
        this.trail = [];
        this.canvas = null;
        this.ctx = null;
        this.isActive = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.maxTrailLength = 20;
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        this.resize();
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (this.isActive) {
                this.updateTrail();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    updateTrail() {
        // Add new character to trail
        this.trail.push({
            x: this.mouseX,
            y: this.mouseY,
            char: String.fromCharCode(0x30A0 + Math.random() * 96),
            opacity: 1
        });

        // Keep trail at maximum length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    start() {
        if (!this.canvas) {
            this.init();
        }
        this.isActive = true;
        this.trail = [];
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.trail = [];
    }

    animate() {
        if (!this.isActive) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '14px monospace';

        // Draw trail
        this.trail.forEach((point, index) => {
            const opacity = 1 - (index / this.maxTrailLength);
            this.ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
            this.ctx.fillText(point.char, point.x, point.y);
        });

        requestAnimationFrame(() => this.animate());
    }
}

const matrixCursor = new MatrixCursor();
window.matrixCursor = matrixCursor;
