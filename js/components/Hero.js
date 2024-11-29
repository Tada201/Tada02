export class Hero {
    constructor() {
        this.element = document.querySelector('.hero');
        if (this.element) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            this.element.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}
