class SystemMonitor {
    constructor() {
        this.data = {
            cpu: [],
            memory: [],
            network: []
        };
        
        this.graphs = {
            floating: {},
            embedded: {}
        };
        
        this.maxDataPoints = 50;
        this.updateInterval = 1000;
        this.isRunning = false;
        
        this.cpuInfo = document.getElementById('cpu-info');
        this.memoryInfo = document.getElementById('memory-info');
        this.gpuInfo = document.getElementById('gpu-info');
        this.networkInfo = document.getElementById('network-info');
        
        this.cpuGraph = document.getElementById('cpu-graph');
        this.memoryGraph = document.getElementById('memory-graph');
        this.networkGraph = document.getElementById('network-graph');
        
        this.init();
    }
    
    init() {
        // Initialize floating window
        this.initFloatingMonitor();
        
        // Initialize embedded graphs
        this.initEmbeddedGraphs();
        
        // Start monitoring
        this.startMonitoring();
        
        this.updateSystemInfo();
        setInterval(() => this.updateSystemInfo(), 1000);
    }
    
    initFloatingMonitor() {
        const container = document.createElement('div');
        container.id = 'floating-monitor';
        container.className = 'floating-window';
        container.style.display = 'none';
        
        container.innerHTML = `
            <div class="window-header">
                <span>System Monitor</span>
                <div class="window-controls">
                    <button class="minimize-btn"><i class="fas fa-window-minimize"></i></button>
                    <button class="close-btn"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="window-content">
                <div class="monitor-grid">
                    <div class="monitor-card">
                        <h3>CPU Usage</h3>
                        <canvas id="floating-cpu-graph"></canvas>
                    </div>
                    <div class="monitor-card">
                        <h3>Memory Usage</h3>
                        <canvas id="floating-memory-graph"></canvas>
                    </div>
                    <div class="monitor-card">
                        <h3>Network Activity</h3>
                        <canvas id="floating-network-graph"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Initialize floating graphs
        this.graphs.floating = {
            cpu: this.createGraph('floating-cpu-graph', 'CPU'),
            memory: this.createGraph('floating-memory-graph', 'Memory'),
            network: this.createGraph('floating-network-graph', 'Network')
        };
        
        // Add event listeners
        container.querySelector('.close-btn').addEventListener('click', () => this.hideFloatingMonitor());
        container.querySelector('.minimize-btn').addEventListener('click', () => this.minimizeFloatingMonitor());
        
        // Make window draggable
        this.makeWindowDraggable(container);
    }
    
    initEmbeddedGraphs() {
        // Initialize embedded section graphs
        this.graphs.embedded = {
            cpu: this.createGraph('cpu-graph', 'CPU'),
            memory: this.createGraph('memory-graph', 'Memory'),
            network: this.createGraph('network-graph', 'Network')
        };
        
        // Initialize stats displays
        this.updateSystemStatus();
    }
    
    createGraph(canvasId, label) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        return {
            ctx,
            label,
            data: []
        };
    }
    
    startMonitoring() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const updateStats = () => {
            if (!this.isRunning) return;
            
            // Simulate system stats (replace with real data in production)
            const stats = this.getSystemStats();
            
            // Update data arrays
            Object.keys(this.data).forEach(key => {
                this.data[key].push(stats[key]);
                if (this.data[key].length > this.maxDataPoints) {
                    this.data[key].shift();
                }
            });
            
            // Update both floating and embedded graphs
            this.updateGraphs();
            
            // Update system status display
            this.updateSystemStatus();
            
            setTimeout(updateStats, this.updateInterval);
        };
        
        updateStats();
    }
    
    getSystemStats() {
        // Simulate system stats (replace with real data in production)
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: Math.random() * 100
        };
    }
    
    updateGraphs() {
        ['floating', 'embedded'].forEach(mode => {
            Object.keys(this.graphs[mode]).forEach(key => {
                const graph = this.graphs[mode][key];
                if (graph) {
                    this.drawGraph(graph, this.data[key]);
                }
            });
        });
    }
    
    drawGraph(graph, data) {
        const { ctx } = graph;
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid(ctx, width, height);
        
        // Draw data
        if (data.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = getComputedStyle(document.documentElement)
                .getPropertyValue('--terminal-glow').trim();
            ctx.lineWidth = 2;
            
            const step = width / (this.maxDataPoints - 1);
            
            data.forEach((value, i) => {
                const x = i * step;
                const y = height - (value / 100 * height);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
    }
    
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Draw horizontal lines
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw vertical lines
        for (let i = 0; i < 6; i++) {
            const x = (width / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }
    
    updateSystemStatus() {
        const statusElement = document.getElementById('system-status');
        if (!statusElement) return;
        
        const stats = this.getSystemStats();
        statusElement.innerHTML = `
            <div>
                <span>CPU Load:</span>
                <span>${stats.cpu.toFixed(1)}%</span>
            </div>
            <div>
                <span>Memory Used:</span>
                <span>${stats.memory.toFixed(1)}%</span>
            </div>
            <div>
                <span>Network Activity:</span>
                <span>${stats.network.toFixed(1)}%</span>
            </div>
            <div>
                <span>Uptime:</span>
                <span>${this.getUptime()}</span>
            </div>
        `;
    }
    
    getUptime() {
        const now = new Date();
        const start = window.performance.timing.navigationStart;
        const uptime = Math.floor((now - start) / 1000);
        
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    
    showFloatingMonitor() {
        const monitor = document.getElementById('floating-monitor');
        if (monitor) {
            monitor.style.display = 'block';
        }
    }
    
    hideFloatingMonitor() {
        const monitor = document.getElementById('floating-monitor');
        if (monitor) {
            monitor.style.display = 'none';
        }
    }
    
    minimizeFloatingMonitor() {
        const monitor = document.getElementById('floating-monitor');
        const icon = document.getElementById('monitor-icon') || this.createMonitorIcon();
        
        if (monitor) {
            monitor.style.display = 'none';
            icon.style.display = 'flex';
        }
    }
    
    createMonitorIcon() {
        const icon = document.createElement('div');
        icon.id = 'monitor-icon';
        icon.className = 'monitor-icon';
        icon.innerHTML = '<i class="fas fa-chart-line"></i>';
        
        icon.addEventListener('click', () => {
            const monitor = document.getElementById('floating-monitor');
            if (monitor) {
                monitor.style.display = 'block';
                icon.style.display = 'none';
            }
        });
        
        document.body.appendChild(icon);
        return icon;
    }
    
    makeWindowDraggable(element) {
        const header = element.querySelector('.window-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            element.style.left = `${currentX}px`;
            element.style.top = `${currentY}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    async updateSystemInfo() {
        // Simulate system information (replace with actual system API calls)
        const systemInfo = {
            cpu: {
                model: 'AMD Ryzen 9 5900X',
                cores: 12,
                threads: 24,
                usage: Math.random() * 100
            },
            memory: {
                total: 32,
                used: Math.random() * 32,
                type: 'DDR4'
            },
            gpu: {
                model: 'NVIDIA RTX 3080',
                memory: '10GB GDDR6X',
                driver: '531.41'
            },
            network: {
                download: Math.random() * 100,
                upload: Math.random() * 50,
                interface: 'Ethernet'
            }
        };

        this.updateCPUInfo(systemInfo.cpu);
        this.updateMemoryInfo(systemInfo.memory);
        this.updateGPUInfo(systemInfo.gpu);
        this.updateNetworkInfo(systemInfo.network);
    }

    updateCPUInfo(cpu) {
        this.cpuInfo.innerHTML = `
            <p>Model: ${cpu.model}</p>
            <p>Cores: ${cpu.cores}</p>
            <p>Threads: ${cpu.threads}</p>
            <p>Usage: ${cpu.usage.toFixed(1)}%</p>
        `;
        this.updateGraph(this.cpuGraph, cpu.usage);
    }

    updateMemoryInfo(memory) {
        this.memoryInfo.innerHTML = `
            <p>Total: ${memory.total}GB ${memory.type}</p>
            <p>Used: ${memory.used.toFixed(1)}GB</p>
            <p>Free: ${(memory.total - memory.used).toFixed(1)}GB</p>
        `;
        this.updateGraph(this.memoryGraph, (memory.used / memory.total) * 100);
    }

    updateGPUInfo(gpu) {
        this.gpuInfo.innerHTML = `
            <p>Model: ${gpu.model}</p>
            <p>Memory: ${gpu.memory}</p>
            <p>Driver: ${gpu.driver}</p>
        `;
    }

    updateNetworkInfo(network) {
        this.networkInfo.innerHTML = `
            <p>Interface: ${network.interface}</p>
            <p>Download: ${network.download.toFixed(1)} MB/s</p>
            <p>Upload: ${network.upload.toFixed(1)} MB/s</p>
        `;
        this.updateGraph(this.networkGraph, network.download);
    }

    updateGraph(canvas, value) {
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw graph
        const barWidth = width * (value / 100);
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(1, '#00ff00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, barWidth, height);
        
        // Draw value text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px "Source Code Pro"';
        ctx.textAlign = 'right';
        ctx.fillText(`${value.toFixed(1)}%`, width - 5, height - 5);
    }
}

// Export for use in other files
window.SystemMonitor = SystemMonitor;
