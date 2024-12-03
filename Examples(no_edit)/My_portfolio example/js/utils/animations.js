export const smoothScroll = (target) => {
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};

export const createObserver = (options, callback) => {
    return new IntersectionObserver(callback, options);
};

export const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
};
