import audioManager from './audioManager.js';
import { BootSequence } from './BootSequence.js';
import { Terminal } from './terminal.js';

class PortfolioApp {
    constructor() {
        this.components = {
            boot: null,
            terminal: null,
            audioManager: null
        };

        // Initialize immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            // Hide main content during boot
            const container = document.querySelector('.container');
            if (container) container.style.display = 'none';

            // Initialize audio first
            await audioManager.init();
            
            // Initialize boot sequence
            this.components.boot = new BootSequence();
            await this.components.boot.init();

            // Initialize terminal
            this.components.terminal = new Terminal();
            await this.components.terminal.init();

            // Show main content after boot
            if (container) {
                container.style.display = 'block';
                container.style.opacity = '1';
            }

            // Start theme music after everything is initialized
            audioManager.playSound('theme');

        } catch (error) {
            console.error('Portfolio initialization failed:', error);
            // Try to play error sound if audio is working
            audioManager.playSound('error');
            this.handleError(error);
        }
    }

    handleError(error) {
        console.error('Portfolio error:', error);
    }
}

// Initialize the portfolio
const portfolio = new PortfolioApp();
export default portfolio;