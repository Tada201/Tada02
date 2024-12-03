// TRON Legacy-inspired boot sequence
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        totalBootTime: 5000, // 5 seconds total boot time
        messageInterval: 100,
        cpuUpdateInterval: 500,
        memoryUpdateInterval: 500
    };

    // Get DOM elements
    const bootScreen = document.getElementById('boot_screen');
    const mainContent = document.querySelector('.main-content');

    class BootController {
        constructor() {
            this.bootScreen = document.getElementById('boot_screen');
            this.bootLog = document.getElementById('bootLog');
            this.cpuProgress = document.getElementById('cpuProgress');
            this.memoryProgress = document.getElementById('memoryProgress');
            this.cpuValue = document.getElementById('cpuValue');
            this.memoryValue = document.getElementById('memoryValue');
            this.timer = document.getElementById('timer');
            this.mainContent = document.querySelector('.main-content');
            this.sineWaveCanvas = document.getElementById('sineWaveCanvas');
            
            if (this.sineWaveCanvas) {
                this.ctx = this.sineWaveCanvas.getContext('2d');
            }
            
            this.startTime = Date.now();
            this.bootComplete = false;
            this.sineWaveAngle = 0;
            this.TOTAL_BOOT_TIME = 5000;
            this.themeSound = new Audio('assets/audio/theme.wav');
            this.expandSound = new Audio('assets/audio/expand.wav');
            
            this.setupFullscreenExit();
            if (this.sineWaveCanvas) {
                this.setupSineWave();
            }
            this.generateBiosMessages();
        }

        setupFullscreenExit() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (document.fullscreenElement) {
                        document.exitFullscreen().catch(err => {
                            console.error('Error exiting fullscreen:', err);
                        });
                    }
                }
            });
        }

        setupSineWave() {
            this.sineWaveCanvas.width = this.sineWaveCanvas.offsetWidth;
            this.sineWaveCanvas.height = this.sineWaveCanvas.offsetHeight;
            this.drawSineWave();
        }

        drawSineWave() {
            if (this.bootComplete) return;

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.sineWaveCanvas.width, this.sineWaveCanvas.height);

            this.ctx.beginPath();
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 2;

            for (let x = 0; x < this.sineWaveCanvas.width; x++) {
                const y = this.sineWaveCanvas.height / 2 +
                         Math.sin(x * 0.05 + this.sineWaveAngle) * 20;
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
            this.sineWaveAngle += 0.1;
            requestAnimationFrame(() => this.drawSineWave());
        }

        generateBiosMessages() {
            this.biosMessages = [
                "Initializing boot sequence...",
                "Loading system kernel...",
                "Checking hardware compatibility...",
                "Detecting CPU architecture...",
                "Verifying memory modules...",
                "Loading device drivers...",
                "Initializing network interfaces...",
                "Loading security modules...",
                "Starting system services...",
                "Configuring display adapters...",
                "Loading user interface components...",
                "Initializing neural network...",
                "Optimizing system performance...",
                "Checking system integrity...",
                "Loading resource managers...",
                "Initializing virtual memory...",
                "Starting background services...",
                "Loading configuration files...",
                "Verifying system components...",
                "Initializing security protocols..."
            ];
        }

        async startBoot() {
            this.updateTimer();
            this.updateSystemStats();

            // Set theme sound to play at exactly 3 seconds
            setTimeout(() => {
                this.themeSound.play();
            }, 3000);

            await this.simulateBootSequence();
        }

        async simulateBootSequence() {
            const startTime = Date.now();
            let messageIndex = 0;
            const messagesPerSecond = this.biosMessages.length / (this.TOTAL_BOOT_TIME / 1000);
            const messageDelay = 1000 / messagesPerSecond;

            // Display BIOS messages spread across the full boot time
            while (messageIndex < this.biosMessages.length) {
                this.addLogMessage(this.biosMessages[messageIndex]);
                messageIndex++;
                await this.delay(messageDelay);
            }

            // Add final boot success message
            this.addLogMessage('Boot sequence complete. Initializing main system...');
            await this.delay(500);

            // Complete boot sequence
            this.bootComplete = true;

            // Transition to main content
            if (this.mainContent) {
                // Set display to block first
                this.mainContent.style.display = 'block';
                await this.delay(50);

                // Fade out boot screen
                if (this.bootScreen) {
                    this.bootScreen.style.opacity = '0';
                    await this.delay(1000);
                    this.bootScreen.style.display = 'none';
                }

                // Show main content immediately
                this.mainContent.style.opacity = '1';

                // Play expand sound after 2 seconds
                setTimeout(() => {
                    this.expandSound.play();
                }, 2000);

                // Start animations if available
                if (typeof window.startMainContentAnimations === 'function') {
                    window.startMainContentAnimations();
                }
            }
        }

        addLogMessage(message) {
            if (!this.bootLog) return;
            
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = `[${this.formatTime(Date.now() - this.startTime)}] ${message}`;
            this.bootLog.appendChild(logEntry);
            this.bootLog.scrollTop = this.bootLog.scrollHeight;
        }

        formatTime(ms) {
            const seconds = Math.floor(ms / 1000);
            const milliseconds = ms % 1000;
            return `${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
        }

        updateTimer() {
            if (this.bootComplete) return;
            
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const milliseconds = elapsed % 1000;
            
            if (this.timer) {
                this.timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
            }

            requestAnimationFrame(() => this.updateTimer());
        }

        updateSystemStats() {
            if (this.bootComplete) return;

            const cpuUsage = Math.floor(Math.random() * 81) + 10;
            const memoryUsage = Math.floor(Math.random() * 81) + 10;
            
            if (this.cpuProgress) this.cpuProgress.style.width = `${cpuUsage}%`;
            if (this.memoryProgress) this.memoryProgress.style.width = `${memoryUsage}%`;
            if (this.cpuValue) this.cpuValue.textContent = `${cpuUsage}%`;
            if (this.memoryValue) this.memoryValue.textContent = `${memoryUsage}%`;
            
            if (!this.bootComplete) {
                setTimeout(() => this.updateSystemStats(), 500);
            }
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // Initialize and start boot sequence
    const boot = new BootController();
    boot.startBoot();
});
