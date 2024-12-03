import audioManager from './audioManager.js';

export class BootSequence {
    constructor() {
        this.initialized = false;
        this.sections = [
            { name: 'Core Systems', element: null, progress: 0 },
            { name: 'Quantum Tunneling', element: null, progress: 0 },
            { name: 'Test Chamber Systems', element: null, progress: 0 }
        ];
        this.bootLog = document.querySelector('.boot-log');
        this.bootOverlay = document.querySelector('.boot-overlay');
        this.initializeElements();
    }

    initializeElements() {
        const loadingSections = document.querySelectorAll('.loading-section');
        loadingSections.forEach((section, index) => {
            if (index < this.sections.length) {
                this.sections[index].element = section;
                this.sections[index].progressBar = section.querySelector('.boot-progress');
                this.sections[index].percentage = section.querySelector('.loading-percentage');
            }
        });
    }

    async init() {
        try {
            // Reset progress
            this.sections.forEach(section => {
                if (section.progressBar) {
                    section.progressBar.style.width = '0%';
                }
                if (section.percentage) {
                    section.percentage.textContent = '0%';
                }
            });

            // Initialize each section
            for (const section of this.sections) {
                await this.initializeSection(section);
            }

            // Boot complete
            if (this.bootOverlay) {
                this.bootOverlay.style.opacity = '0';
                setTimeout(() => {
                    this.bootOverlay.style.display = 'none';
                    // Show main content
                    document.querySelector('.main-content').style.display = 'block';
                }, 1000);
            }

            this.initialized = true;
            return true;

        } catch (error) {
            console.error('Boot sequence failed:', error);
            this.log('ERROR: Boot sequence failed');
            throw error;
        }
    }

    async initializeSection(section) {
        this.log(`Initializing ${section.name}...`);
        
        for (let progress = 0; progress <= 100; progress += 5) {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (section.progressBar) {
                section.progressBar.style.width = `${progress}%`;
            }
            if (section.percentage) {
                section.percentage.textContent = `${progress}%`;
            }
            
            // Try to play sound but don't fail if it doesn't work
            if (progress % 25 === 0) {
                try {
                    audioManager.playSound('info');
                } catch (error) {
                    console.warn('Failed to play info sound:', error);
                }
            }
        }
        
        this.log(`${section.name} initialized successfully`);
    }

    log(message) {
        if (this.bootLog) {
            const logEntry = document.createElement('div');
            logEntry.textContent = `[SYSTEM] ${message}`;
            this.bootLog.appendChild(logEntry);
            this.bootLog.scrollTop = this.bootLog.scrollHeight;
        }
    }
}
