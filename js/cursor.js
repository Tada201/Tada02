document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Variables for cursor position
    let cursorPos = { x: 0, y: 0 };
    let cursorDotPos = { x: 0, y: 0 };
    let cursorOutlinePos = { x: 0, y: 0 };

    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;
        
        // Immediate update for dot position
        cursorDot.style.left = cursorPos.x + 'px';
        cursorDot.style.top = cursorPos.y + 'px';
    });

    // Smooth cursor animation for outline
    function animateCursor() {
        // Smooth movement for cursor outline
        const easingOutline = 0.2;
        cursorOutlinePos.x += (cursorPos.x - cursorOutlinePos.x) * easingOutline;
        cursorOutlinePos.y += (cursorPos.y - cursorOutlinePos.y) * easingOutline;

        // Apply position to outline
        cursorOutline.style.left = cursorOutlinePos.x + 'px';
        cursorOutline.style.top = cursorOutlinePos.y + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .logo, .nav-link, .interactive');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-hover');
            cursorOutline.classList.add('cursor-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-hover');
            cursorOutline.classList.remove('cursor-hover');
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        }
    });

    document.addEventListener('mouseover', (e) => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
});
