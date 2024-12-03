class CLI {
    constructor() {
        this.initializeElements();
        this.debugMode = false;
        this.canvasMode = false;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.lastFpsUpdate = this.lastFrameTime;

        this.commands = {
            help: () => this.showHelp(),
            time: () => this.showTime(),
            clear: () => this.clearOutput(),
            info: () => this.showInfo(),
            debug: () => this.toggleDebugMode(),
            canvas: () => this.toggleCanvasMode(),
        };

        if (this.elementsExist()) {
            this.setupEventListeners();
            this.updateTime();
            this.initializeFpsCounter();
        }
    }

    initializeElements() {
        this.container = document.querySelector('.cli-container');
        this.output = document.querySelector('.cli-output');
        this.input = document.querySelector('.cli-input');
        this.timeSpan = document.querySelector('.cli-controls .time');
        this.fpsSpan = document.querySelector('.cli-controls .fps');
    }

    elementsExist() {
        if (!this.container || !this.output || !this.input) {
            console.error('CLI: Required DOM elements not found');
            return false;
        }
        return true;
    }

    setupEventListeners() {
        if (!this.input) return;
        
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(this.input.value.trim());
                this.input.value = '';
            }
        });

        if (this.debugMode) {
            document.addEventListener('mousemove', this.showCoordinates.bind(this));
        }
    }

    executeCommand(cmd) {
        const command = cmd.toLowerCase();
        this.printOutput(`> ${cmd}`, 'input');

        if (this.commands[command]) {
            this.commands[command]();
        } else {
            this.printOutput('Command not found. Type "help" for available commands.', 'error');
        }
    }

    printOutput(text, type = '') {
        if (!this.output) return;
        const line = document.createElement('div');
        line.textContent = text;
        if (type) line.classList.add(type);
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    showHelp() {
        const commands = [
            'Available Commands:',
            'help    - Show this help message',
            'time    - Show current time',
            'clear   - Clear terminal output',
            'info    - Show site information',
            'debug   - Toggle debug mode (FPS & touch coordinates)',
            'canvas  - Toggle canvas mode (change color palette)',
        ];
        commands.forEach(cmd => this.printOutput(cmd, 'info'));
    }

    showTime() {
        if (!this.timeSpan) return;
        const now = new Date();
        this.timeSpan.textContent = now.toLocaleTimeString();
    }

    clearOutput() {
        if (!this.output) return;
        this.output.innerHTML = '';
    }

    showInfo() {
        const info = [
            'Site Information:',
            '----------------',
            'Framework: Custom HTML/CSS/JS',
            'Theme: Cyberpunk/Terminal',
            'Debug Mode: ' + (this.debugMode ? 'Enabled' : 'Disabled'),
            'Canvas Mode: ' + (this.canvasMode ? 'Enabled' : 'Disabled'),
        ];
        info.forEach(line => this.printOutput(line, 'info'));
    }

    updateTime() {
        if (!this.timeSpan) return;
        const updateClock = () => {
            const now = new Date();
            this.timeSpan.textContent = now.toLocaleTimeString();
        };
        updateClock();
        setInterval(updateClock, 1000);
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        document.body.classList.toggle('debug-mode');
        if (this.fpsSpan) {
            this.fpsSpan.style.display = this.debugMode ? 'inline' : 'none';
        }
        this.printOutput(`Debug mode ${this.debugMode ? 'enabled' : 'disabled'}`, 'success');
        
        if (this.debugMode) {
            this.initializeDebugTools();
        } else {
            this.removeDebugTools();
        }
    }

    toggleCanvasMode() {
        this.canvasMode = !this.canvasMode;
        const popup = document.querySelector('.color-picker-popup');
        
        if (this.canvasMode) {
            document.body.classList.add('color-picker-active');
            if (popup) popup.style.display = 'block';
            this.setupColorPicker();
        } else {
            document.body.classList.remove('color-picker-active');
            if (popup) popup.style.display = 'none';
            this.resetColors();
        }
        
        this.printOutput(`Canvas mode ${this.canvasMode ? 'enabled' : 'disabled'}`, 'success');
    }

    setupColorPicker() {
        const popup = document.querySelector('.color-picker-popup');
        if (!popup) return;
        const closeBtn = popup.querySelector('.close-popup');
        const colorInputs = popup.querySelectorAll('input[type="color"]');

        // Store original colors
        if (!this.originalColors) {
            this.originalColors = {};
            colorInputs.forEach(input => {
                const varName = input.dataset.var;
                this.originalColors[varName] = getComputedStyle(document.documentElement)
                    .getPropertyValue(varName);
            });
        }

        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleCanvasMode();
            });
        }

        // Color input events
        colorInputs.forEach(input => {
            const varName = input.dataset.var;
            // Set initial color
            input.value = getComputedStyle(document.documentElement)
                .getPropertyValue(varName).trim();
            
            // Update color on change
            input.addEventListener('input', () => {
                document.documentElement.style.setProperty(varName, input.value);
            });
        });
    }

    resetColors() {
        if (this.originalColors) {
            Object.entries(this.originalColors).forEach(([varName, value]) => {
                document.documentElement.style.setProperty(varName, value);
            });
        }
    }

    initializeFpsCounter() {
        if (!this.fpsSpan) return;
        const updateFps = () => {
            const now = performance.now();
            const delta = now - this.lastFrameTime;
            this.frameCount++;

            if (now - this.lastFpsUpdate >= 1000) {
                const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
                this.fpsSpan.textContent = `FPS: ${fps}`;
                this.frameCount = 0;
                this.lastFpsUpdate = now;
            }

            this.lastFrameTime = now;
            requestAnimationFrame(updateFps);
        };

        requestAnimationFrame(updateFps);
    }

    initializeDebugTools() {
        const touchIndicator = document.createElement('div');
        touchIndicator.classList.add('touch-indicator');
        document.body.appendChild(touchIndicator);

        document.addEventListener('mousemove', (e) => {
            touchIndicator.style.left = e.clientX + 'px';
            touchIndicator.style.top = e.clientY + 'px';
            this.showCoordinates(e);
        });
    }

    removeDebugTools() {
        const touchIndicator = document.querySelector('.touch-indicator');
        if (touchIndicator) {
            touchIndicator.remove();
        }
    }

    showCoordinates(e) {
        if (!this.fpsSpan) return;
        const coords = `X: ${e.clientX}, Y: ${e.clientY}`;
        this.fpsSpan.textContent = `FPS: ${Math.round(this.frameCount)} | ${coords}`;
    }
}

export { CLI };
