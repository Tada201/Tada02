// Randomize the navbar outline direction
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const direction = Math.random() < 0.5 ? 'rainbowOutlineClockwise' : 'rainbowOutlineCounterClockwise';
    
    // Set the animation direction as a CSS variable
    document.documentElement.style.setProperty('--outline-direction', direction);
    
    // Add the animation class after boot sequence
    const bootOverlay = document.querySelector('.boot-overlay');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style' && 
                bootOverlay.style.display === 'none') {
                sidebar.classList.add('animate');
                observer.disconnect();
            }
        });
    });
    
    observer.observe(bootOverlay, { attributes: true });
});
