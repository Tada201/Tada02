// Wait for boot screen to complete
document.addEventListener('DOMContentLoaded', () => {
    // Initialize timeline
    const mainTimeline = gsap.timeline();
    
    // Hide all main content initially
    gsap.set('.main-content', { visibility: 'visible', opacity: 0 });
    gsap.set('.sidebar', { x: -240 });
    gsap.set('.profile-pic', { scale: 0 });
    gsap.set('.navbar', { opacity: 0, y: -20 });
    gsap.set('.hero-content', { opacity: 0 });
    gsap.set('.section', { opacity: 0, y: 50 });
    
    // Function to start main content animations
    window.startMainContentAnimations = () => {
        // Create audio context and sounds
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Function to play sound effect
        const playSound = (frequency, duration) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            oscillator.stop(audioContext.currentTime + duration);
        };

        // Main animation sequence
        mainTimeline
            // Fade in main content container
            .to('.main-content', {
                opacity: 1,
                duration: 0.5
            })
            
            // Animate in sidebar
            .to('.sidebar', {
                x: 0,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => playSound(440, 0.3)
            })
            
            // Animate in navbar
            .to('.navbar', {
                opacity: 1,
                y: 0,
                duration: 0.5,
                onStart: () => playSound(660, 0.2)
            })
            
            // Animate in profile picture
            .to('.profile-pic', {
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                onStart: () => playSound(880, 0.2)
            })
            
            // Initialize and start typing animation
            .add(() => {
                new Typed('.typing-text', {
                    strings: ['Web design test by selected AI'],
                    typeSpeed: 50,
                    showCursor: true,
                    cursorChar: '_',
                    onStringTyped: () => playSound(440, 0.1)
                });
            })
            
            // Fade in hero content
            .to('.hero-content', {
                opacity: 1,
                duration: 1,
                onStart: () => playSound(550, 0.2)
            })
            
            // Animate in sections one by one
            .to('.section', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.3,
                ease: 'power2.out',
                onStart: () => playSound(660, 0.2)
            });
    };

    // Initialize intersection observers for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                playSound(440, 0.1);
            }
        });
    }, observerOptions);

    // Apply scroll animations to portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(item);
    });

    // Glitch effect for main heading
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        setInterval(() => {
            if (Math.random() < 0.1) {
                glitchText.style.textShadow = `
                    ${Math.random() * 10}px ${Math.random() * 10}px #0ff,
                    ${-Math.random() * 10}px ${-Math.random() * 10}px #f0f
                `;
                setTimeout(() => {
                    glitchText.style.textShadow = '2px 2px var(--primary-color)';
                }, 50);
            }
        }, 500);
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Profile picture interaction
const profilePic = document.getElementById('profilePic');
if (profilePic) {
    profilePic.addEventListener('mouseover', () => {
        profilePic.style.transform = 'scale(1.1) rotate(5deg)';
    });

    profilePic.addEventListener('mouseout', () => {
        profilePic.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(item);
});

// Typing animation for the subtitle
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing animation when the element is in view
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriter();
                typingObserver.unobserve(entry.target);
            }
        });
    });

    typingObserver.observe(typingText);
}

// Parallax effect for hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// Add active state to navigation links
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Color Picker Popup Logic
const colorPickerPopup = document.querySelector('.color-picker-popup');
const openPopupButton = document.querySelector('.open-color-picker');
const closePopupButton = document.querySelector('.close-popup');

// Open the color picker popup
if (openPopupButton && colorPickerPopup) {
    openPopupButton.addEventListener('click', () => {
        colorPickerPopup.style.display = 'block';
    });
}

// Close the color picker popup
if (closePopupButton && colorPickerPopup) {
    closePopupButton.addEventListener('click', () => {
        colorPickerPopup.style.display = 'none';
    });
}

// Apply color changes
const colorInputs = document.querySelectorAll('.color-controls input[type="color"]');
colorInputs.forEach(input => {
    input.addEventListener('input', (event) => {
        const variable = event.target.dataset.var;
        const value = event.target.value;
        document.documentElement.style.setProperty(variable, value);
    });
});

// Reset colors on reload
window.addEventListener('beforeunload', () => {
    colorInputs.forEach(input => {
        const variable = input.dataset.var;
        const defaultValue = input.defaultValue;
        document.documentElement.style.setProperty(variable, defaultValue);
    });
});