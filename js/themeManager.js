class ThemeManager {
    constructor() {
        this.currentTheme = 'tron';
        this.themes = {
            tron: {
                primary: '#00f0ff',
                secondary: '#000000',
                accent: '#ff00ff',
                background: '#000000',
                text: '#ffffff'
            },
            matrix: {
                primary: '#00ff00',
                secondary: '#003300',
                accent: '#88ff88',
                background: '#000000',
                text: '#00ff00'
            },
            blade: {
                primary: '#ff0000',
                secondary: '#330000',
                accent: '#ff8888',
                background: '#000000',
                text: '#ffffff'
            }
        };
    }

    init() {
        this.loadTheme(localStorage.getItem('theme') || 'tron');
        this.createThemeSelector();
    }

    loadTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Apply theme colors
        const theme = this.themes[themeName];
        document.documentElement.style.setProperty('--primary-color', theme.primary);
        document.documentElement.style.setProperty('--secondary-color', theme.secondary);
        document.documentElement.style.setProperty('--accent-color', theme.accent);
        document.documentElement.style.setProperty('--background-color', theme.background);
        document.documentElement.style.setProperty('--text-color', theme.text);

        // Save theme preference
        localStorage.setItem('theme', themeName);
    }

    createThemeSelector() {
        const themeSelector = document.createElement('div');
        themeSelector.className = 'theme-selector';
        themeSelector.innerHTML = `
            <div class="theme-selector-toggle">
                <i class="fas fa-palette"></i>
            </div>
            <div class="theme-selector-menu">
                ${Object.keys(this.themes).map(theme => `
                    <div class="theme-option ${theme === this.currentTheme ? 'active' : ''}" 
                         data-theme="${theme}">
                        <div class="theme-preview" style="background: ${this.themes[theme].primary}"></div>
                        <span>${theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(themeSelector);

        // Event listeners
        const toggle = themeSelector.querySelector('.theme-selector-toggle');
        const menu = themeSelector.querySelector('.theme-selector-menu');
        
        toggle.addEventListener('click', () => {
            menu.classList.toggle('show');
        });

        themeSelector.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const themeName = option.dataset.theme;
                this.loadTheme(themeName);
                
                // Update active state
                themeSelector.querySelectorAll('.theme-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                option.classList.add('active');
                
                menu.classList.remove('show');
            });
        });
    }
}

// Export for use in other files
export { ThemeManager };
