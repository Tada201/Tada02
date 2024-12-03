import audioManager from './audioManager.js';
import { matrixCursor } from './matrixCursor.js';

export class Terminal {
    constructor() {
        // Update selectors to match HTML structure
        this.terminal = document.querySelector('#terminal-output');
        this.input = document.querySelector('#terminal-input');
        this.clock = document.querySelector('#terminal-clock');
        this.history = [];
        this.historyIndex = -1;
        this.matrixActive = false;
        this.isFirstCommand = true;
        this.init();
    }

    init() {
        if (!this.terminal || !this.input || !this.clock) {
            console.error('Terminal elements not found');
            return;
        }
        this.setupEventListeners();
        this.startClock();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        if (!this.input) return;
        
        this.input.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Enter':
                    const command = this.input.value.trim();
                    if (command) {
                        this.history.push(command);
                        this.historyIndex = this.history.length;
                        this.executeCommand(command);
                        this.input.value = '';
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (this.historyIndex > 0) {
                        this.historyIndex--;
                        this.input.value = this.history[this.historyIndex];
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.historyIndex < this.history.length - 1) {
                        this.historyIndex++;
                        this.input.value = this.history[this.historyIndex];
                    } else {
                        this.historyIndex = this.history.length;
                        this.input.value = '';
                    }
                    break;
            }
        });
    }

    startClock() {
        if (!this.clock) return;
        
        const updateClock = () => {
            const now = new Date();
            this.clock.textContent = now.toLocaleTimeString();
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    showWelcomeMessage() {
        if (!this.terminal) return;
        
        const messages = [
            'Welcome to the Aperture Science Terminal Interface',
            'Type "help" for a list of available commands',
            '-------------------------------------------'
        ];
        
        messages.forEach(msg => this.printOutput(msg, 'info'));
    }

    executeCommand(command) {
        if (!this.terminal) return;
        
        const cmd = command.toLowerCase();
        this.printOutput(`> ${command}`, 'input');

        switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'matrix':
                this.toggleMatrix();
                break;
            case 'time':
                this.showTime();
                break;
            default:
                this.printOutput('Command not recognized. Type "help" for available commands.', 'error');
        }

        // Play sound effect
        audioManager.playSound('stdout');
    }

    printOutput(text, type = '') {
        if (!this.terminal) return;
        
        const line = document.createElement('div');
        line.textContent = text;
        if (type) line.classList.add(type);
        this.terminal.appendChild(line);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    showHelp() {
        const commands = [
            'Available commands:',
            '  help    - Show this help message',
            '  clear   - Clear the terminal',
            '  matrix  - Toggle matrix effect',
            '  time    - Show current time'
        ];
        commands.forEach(cmd => this.printOutput(cmd, 'info'));
    }

    clearTerminal() {
        if (this.terminal) {
            this.terminal.innerHTML = '';
            this.showWelcomeMessage();
        }
    }

    toggleMatrix() {
        this.matrixActive = !this.matrixActive;
        if (this.matrixActive) {
            matrixCursor.start();
            this.printOutput('Matrix mode activated', 'success');
        } else {
            matrixCursor.stop();
            this.printOutput('Matrix mode deactivated', 'info');
        }
    }

    showTime() {
        const now = new Date();
        this.printOutput(`Current time: ${now.toLocaleString()}`, 'info');
    }
}

// Initialize terminal
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

export default Terminal;
