class WorldMap {
    constructor(options = {}) {
        // Configuration with defaults
        this.config = {
            containerId: 'world-map',
            updateInterval: 5000, // ISS update interval in ms
            mapScale: 1,
            enableISSTracking: true,
            enableUserLocation: true,
            enableTimezones: true,
            ...options
        };

        // State management
        this.state = {
            initialized: false,
            issPosition: { lat: 0, lng: 0 },
            userPosition: null,
            mapData: null,
            updateTimer: null,
            error: null
        };

        // DOM elements
        this.elements = {
            container: null,
            svg: null,
            issMarker: null,
            userMarker: null,
            tooltip: null
        };

        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    async init() {
        try {
            await this.initializeDOM();
            await this.loadMapData();
            await this.initializeMap();
            
            if (this.config.enableISSTracking) {
                await this.startISSTracking();
            }
            
            if (this.config.enableUserLocation) {
                await this.getUserLocation();
            }
            
            if (this.config.enableTimezones) {
                await this.initializeTimezones();
            }

            this.state.initialized = true;
            this.addEventListeners();
            
            return true;
        } catch (error) {
            console.error('World map initialization failed:', error);
            this.state.error = error;
            return false;
        }
    }

    async initializeDOM() {
        // Create or get container
        this.elements.container = document.getElementById(this.config.containerId) ||
            this.createContainer();

        // Create tooltip
        this.elements.tooltip = this.createTooltip();
        this.elements.container.appendChild(this.elements.tooltip);
    }

    async loadMapData() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/GitSquared/edex-ui/master/src/assets/worldmap.json');
            this.state.mapData = await response.json();
        } catch (error) {
            throw new Error('Failed to load map data: ' + error.message);
        }
    }

    async initializeMap() {
        // Create SVG element with proper viewBox
        this.elements.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.elements.svg.setAttribute('viewBox', '0 0 360 180');
        this.elements.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Create map features group
        const mapGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mapGroup.classList.add('map-features');

        // Draw map paths
        this.state.mapData.features.forEach(feature => {
            const path = this.createMapPath(feature);
            mapGroup.appendChild(path);
        });

        // Add map group to SVG
        this.elements.svg.appendChild(mapGroup);

        // Create markers
        this.elements.issMarker = this.createMarker('iss-marker');
        this.elements.userMarker = this.createMarker('user-marker');

        this.elements.svg.appendChild(this.elements.issMarker);
        this.elements.svg.appendChild(this.elements.userMarker);

        // Add SVG to container
        this.elements.container.appendChild(this.elements.svg);
    }

    async startISSTracking() {
        const updateISS = async () => {
            try {
                const response = await fetch('http://api.open-notify.org/iss-now.json');
                const data = await response.json();
                
                this.state.issPosition = {
                    lat: parseFloat(data.iss_position.latitude),
                    lng: parseFloat(data.iss_position.longitude)
                };
                
                this.updateISSMarker();
            } catch (error) {
                console.warn('Failed to update ISS position:', error);
            }
        };

        // Initial update
        await updateISS();

        // Start periodic updates
        this.state.updateTimer = setInterval(updateISS, this.config.updateInterval);
    }

    async getUserLocation() {
        if (!navigator.geolocation) return;

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            this.state.userPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.updateUserMarker();
        } catch (error) {
            console.warn('Failed to get user location:', error);
        }
    }

    async initializeTimezones() {
        const timezones = moment.tz.names();
        const timezonesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        timezonesGroup.classList.add('timezones');

        timezones.forEach(tz => {
            const zone = moment.tz.zone(tz);
            if (!zone) return;

            const offset = zone.utcOffset(moment());
            const x = this.longitudeToX(offset / 60 * 15); // 15° per hour
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', 10);
            label.classList.add('timezone-label');
            label.textContent = `UTC${offset >= 0 ? '+' : ''}${offset / 60}`;
            
            timezonesGroup.appendChild(label);
        });

        this.elements.svg.appendChild(timezonesGroup);
    }

    // Helper methods
    createContainer() {
        const container = document.createElement('div');
        container.id = this.config.containerId;
        container.className = 'world-map-container';
        return container;
    }

    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        return tooltip;
    }

    createMapPath(feature) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', this.generatePathFromCoordinates(feature.geometry.coordinates));
        path.setAttribute('class', 'map-path');
        path.setAttribute('data-name', feature.properties.name);
        return path;
    }

    createMarker(className) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        marker.setAttribute('r', '2');
        marker.setAttribute('class', className);
        return marker;
    }

    generatePathFromCoordinates(coordinates) {
        return coordinates.reduce((path, ring) => {
            const ringPath = ring.reduce((p, coord, i) => {
                const x = this.longitudeToX(coord[0]);
                const y = this.latitudeToY(coord[1]);
                return p + `${i === 0 ? 'M' : 'L'}${x},${y}`;
            }, '');
            return path + ringPath + 'Z';
        }, '');
    }

    updateISSMarker() {
        if (!this.elements.issMarker || !this.state.issPosition) return;
        
        const x = this.longitudeToX(this.state.issPosition.lng);
        const y = this.latitudeToY(this.state.issPosition.lat);
        
        this.elements.issMarker.setAttribute('cx', x);
        this.elements.issMarker.setAttribute('cy', y);
    }

    updateUserMarker() {
        if (!this.elements.userMarker || !this.state.userPosition) return;
        
        const x = this.longitudeToX(this.state.userPosition.lng);
        const y = this.latitudeToY(this.state.userPosition.lat);
        
        this.elements.userMarker.setAttribute('cx', x);
        this.elements.userMarker.setAttribute('cy', y);
    }

    longitudeToX(lng) {
        return (lng + 180) * (360 / 360) * this.config.mapScale;
    }

    latitudeToY(lat) {
        return (90 - lat) * (180 / 180) * this.config.mapScale;
    }

    handleResize() {
        // Update map scale based on container size
        const containerRect = this.elements.container.getBoundingClientRect();
        this.config.mapScale = containerRect.width / 360;
        
        // Update marker positions
        this.updateISSMarker();
        this.updateUserMarker();
    }

    handleMouseMove(event) {
        const rect = this.elements.svg.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Convert to map coordinates
        const lng = (x / rect.width * 360) - 180;
        const lat = 90 - (y / rect.height * 180);
        
        // Update tooltip
        this.updateTooltip(lat, lng, event);
    }

    updateTooltip(lat, lng, event) {
        const timezone = moment.tz.zone(moment.tz.guess());
        const localTime = moment().tz(timezone.name).format('HH:mm:ss');
        
        this.elements.tooltip.textContent = `
            Lat: ${lat.toFixed(2)}°
            Lng: ${lng.toFixed(2)}°
            Local Time: ${localTime}
        `;
        
        this.elements.tooltip.style.left = `${event.clientX + 10}px`;
        this.elements.tooltip.style.top = `${event.clientY + 10}px`;
        this.elements.tooltip.classList.add('show');
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize);
        this.elements.svg.addEventListener('mousemove', this.handleMouseMove);
        this.elements.svg.addEventListener('mouseleave', () => {
            this.elements.tooltip.classList.remove('show');
        });
    }

    cleanup() {
        // Clear update timer
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
        }

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        this.elements.svg.removeEventListener('mousemove', this.handleMouseMove);
        
        // Clean up DOM
        if (this.elements.container) {
            this.elements.container.remove();
        }
    }
}

// Export for use in other files
window.WorldMap = WorldMap;
