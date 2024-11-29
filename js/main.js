import { initSmoothScroll, initActiveNavTracking } from './animations/scroll.js';
import { initProfileAnimation } from './animations/profile.js';

// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initActiveNavTracking();
    initProfileAnimation();
});