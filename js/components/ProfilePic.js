export class ProfilePic {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (this.element) {
            this.init();
        }
    }

    init() {
        this.element.addEventListener('mouseover', () => {
            this.element.style.transform = 'scale(1.1) rotate(5deg)';
        });

        this.element.addEventListener('mouseout', () => {
            this.element.style.transform = 'scale(1) rotate(0deg)';
        });
    }
}