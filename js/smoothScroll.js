document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (!targetSection) return;
            
            // Add active class to current nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Get the target position
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
            
            // Instant scroll with smooth behavior
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Add subtle bounce effect
            setTimeout(() => {
                targetSection.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                targetSection.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    targetSection.style.transform = 'translateY(0)';
                }, 100);
            }, 300);
        });
    });
    
    // Update active nav link on scroll with debouncing
    let scrollTimeout;
    const sections = document.querySelectorAll('section');
    const navHeight = 60;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.pageYOffset + navHeight;
                
                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    });
});
