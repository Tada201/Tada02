class MatrixEffect {
    constructor(options = {}) {
        this.config = {
            containerId: 'matrix-canvas',
            fontSize: 14,
            chars: '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            speed: 50,
            opacity: 0.8,
            colorPrimary: '#0F0',
            colorSecondary: '#040',
            ...options
        };

        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.animationFrame = null;
        this.isRunning = false;

        this.init();
    }

    init() {
        this.createCanvas();
        this.initializeDrops();
        window.addEventListener('resize', () => this.handleResize());
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = this.config.containerId;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = this.config.opacity;
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.handleResize();
    }

    handleResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initializeDrops();
    }

    initializeDrops() {
        const columns = Math.ceil(this.canvas.width / this.config.fontSize);
        this.drops = new Array(columns).fill(1).map(() => ({
            y: Math.random() * -100,
            speed: Math.random() * 2 + 1,
            length: Math.floor(Math.random() * 20) + 10,
            chars: [],
            lastUpdate: 0
        }));
    }

    getRandomChar() {
        return this.config.chars[Math.floor(Math.random() * this.config.chars.length)];
    }

    updateDrop(drop, x, now) {
        // Update characters if enough time has passed
        if (now - drop.lastUpdate > 50) {
            drop.chars = Array(drop.length).fill(0).map(() => this.getRandomChar());
            drop.lastUpdate = now;
        }

        // Draw characters with gradient effect
        drop.chars.forEach((char, i) => {
            const y = Math.floor(drop.y - i * this.config.fontSize);
            if (y < this.canvas.height && y > 0) {
                const alpha = 1 - (i / drop.length);
                this.ctx.fillStyle = i === 0 ? 
                    this.config.colorPrimary : 
                    `rgba(0, 255, 0, ${alpha * 0.5})`;
                this.ctx.fillText(char, x, y);
            }
        });

        // Update position
        drop.y += drop.speed;

        // Reset if off screen
        if (drop.y - (drop.length * this.config.fontSize) > this.canvas.height) {
            drop.y = Math.random() * -100;
            drop.speed = Math.random() * 2 + 1;
            drop.length = Math.floor(Math.random() * 20) + 10;
        }
    }

    draw() {
        if (!this.isRunning) return;

        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Set text properties
        this.ctx.font = `${this.config.fontSize}px monospace`;
        this.ctx.textAlign = 'center';

        const now = Date.now();

        // Update and draw each drop
        this.drops.forEach((drop, x) => {
            this.updateDrop(drop, x * this.config.fontSize, now);
        });

        this.animationFrame = requestAnimationFrame(() => this.draw());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.draw();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    setOpacity(opacity) {
        this.config.opacity = opacity;
        this.canvas.style.opacity = opacity;
    }

    setSpeed(speed) {
        this.config.speed = speed;
    }

    setColor(primary, secondary) {
        this.config.colorPrimary = primary;
        this.config.colorSecondary = secondary;
    }
}

// Export for use in other files
window.MatrixEffect = MatrixEffect;
