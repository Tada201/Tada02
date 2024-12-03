class AudioManager {
    constructor() {
        this.initialized = false;
        this.sounds = {};
        this.audioContext = null;
    }

    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Define sound configurations with correct file extensions
            const soundConfigs = {
                theme: { url: './assets/audio/theme.wav', loop: false, volume: 0.5 },
                info: { url: './assets/audio/info.wav', loop: false, volume: 0.3 },
                error: { url: './assets/audio/error.wav', loop: false, volume: 0.3 },
                alarm: { url: './assets/audio/alarm.wav', loop: false, volume: 0.5 },
                denied: { url: './assets/audio/denied.wav', loop: false, volume: 0.5 },
                stdin: { url: './assets/audio/stdin.wav', loop: false, volume: 0.2 },
                stdout: { url: './assets/audio/stdout.wav', loop: false, volume: 0.2 },
                panels: { url: './assets/audio/panels.wav', loop: false, volume: 0.3 },
                expand: { url: './assets/audio/expand.wav', loop: false, volume: 0.5 }
            };

            // Load all sounds
            for (const [name, config] of Object.entries(soundConfigs)) {
                try {
                    await this.loadSound(name, config);
                } catch (error) {
                    console.warn(`Failed to load sound ${name}:`, error);
                    // Continue loading other sounds even if one fails
                }
            }

            this.initialized = true;
            console.log('Audio Manager initialized successfully');
        } catch (error) {
            console.warn('Failed to initialize AudioManager:', error);
            // Don't throw error to allow app to continue without audio
            this.initialized = true;
        }
    }

    async loadSound(name, config) {
        try {
            const audio = new Audio(config.url);
            audio.loop = config.loop;
            audio.volume = config.volume;
            
            // Test if audio can be played
            await audio.load();
            
            this.sounds[name] = audio;
            console.log(`Loaded sound: ${name}`);
        } catch (error) {
            console.warn(`Failed to load sound ${name}:`, error);
            // Don't throw error to allow other sounds to load
        }
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            // Create a new instance for overlapping sounds
            if (['stdin', 'stdout', 'info'].includes(name)) {
                const clone = sound.cloneNode();
                clone.volume = sound.volume;
                clone.play().catch(error => console.warn(`Error playing sound ${name}:`, error));
                // Clean up clone after playing
                clone.addEventListener('ended', () => clone.remove());
            } else {
                // For other sounds, just play/restart them
                sound.currentTime = 0;
                sound.play().catch(error => console.warn(`Error playing sound ${name}:`, error));
            }
        }
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    async typeWithSound(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text[index];
                    this.playSound('stdout');
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }
}

const audioManager = new AudioManager();
window.audioManager = audioManager;
