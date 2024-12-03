// Transition sequence manager
class TransitionManager {
    constructor() {
        // Initialize GSAP timeline
        this.mainTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: "power2.out" }
        });

        // Initialize Typed.js instance
        this.typed = null;

        // Cache DOM elements
        this.elements = {
            bootScreen: document.getElementById('boot_screen'),
            navbar: document.querySelector('.navbar'),
            profilePic: document.getElementById('profilePic'),
            welcomeText: document.querySelector('.glitch-text'),
            typingText: document.querySelector('.typing-text'),
            heroContent: document.querySelector('.hero-content'),
            aboutSection: document.getElementById('about'),
            portfolioSection: document.getElementById('portfolio'),
            contactSection: document.getElementById('contact'),
            portfolioItems: document.querySelectorAll('.portfolio-item'),
            contactInfo: document.querySelector('.contact-info')
        };

        // Sound effects
        this.sounds = {
            transition: new Audio('assets/sounds/transition.mp3'),
            type: new Audio('assets/sounds/type.mp3'),
            reveal: new Audio('assets/sounds/reveal.mp3')
        };

        // Initialize animations
        this.setupAnimations();
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(() => {});
        }
    }

    setupAnimations() {
        // Initial states
        gsap.set([
            this.elements.navbar,
            this.elements.profilePic,
            this.elements.heroContent,
            this.elements.aboutSection,
            this.elements.portfolioSection,
            this.elements.contactSection
        ], { autoAlpha: 0 });

        // Build the animation sequence
        this.mainTimeline
            // Navbar animation
            .to(this.elements.navbar, {
                duration: 0.5,
                autoAlpha: 1,
                y: 0,
                onStart: () => this.playSound('transition')
            })

            // Profile image and text
            .to(this.elements.profilePic, {
                duration: 0.5,
                autoAlpha: 1,
                x: 0,
                scale: 1,
                onStart: () => this.playSound('reveal')
            }, "+=0.2")

            // Welcome text typing effect
            .add(() => {
                this.typed = new Typed(this.elements.typingText, {
                    strings: ['Web design test by selected AI'],
                    typeSpeed: 30,
                    onStringTyped: () => this.playSound('type')
                });
            }, "+=0.2")

            // Hero content
            .to(this.elements.heroContent, {
                duration: 0.5,
                autoAlpha: 1,
                y: 0,
                onStart: () => this.playSound('reveal')
            }, "+=0.2")

            // About section
            .to(this.elements.aboutSection, {
                duration: 0.5,
                autoAlpha: 1,
                y: 0,
                onStart: () => this.playSound('reveal')
            }, "+=0.5")

            // Portfolio section with staggered items
            .to(this.elements.portfolioSection, {
                duration: 0.5,
                autoAlpha: 1,
                onStart: () => this.playSound('reveal')
            }, "+=0.3")
            .to(this.elements.portfolioItems, {
                duration: 0.3,
                autoAlpha: 1,
                y: 0,
                stagger: 0.1
            }, "-=0.3")

            // Contact section
            .to(this.elements.contactSection, {
                duration: 0.5,
                autoAlpha: 1,
                y: 0,
                onStart: () => this.playSound('reveal')
            }, "+=0.3");
    }

    startTransition() {
        // Add initial boot screen fade out
        gsap.to(this.elements.bootScreen, {
            duration: 0.8,
            autoAlpha: 0,
            onComplete: () => {
                this.elements.bootScreen.style.display = 'none';
                this.mainTimeline.play();
            }
        });
    }
}

// Initialize transition manager when boot sequence is complete
document.addEventListener('bootComplete', () => {
    const transitionManager = new TransitionManager();
    transitionManager.startTransition();
});
