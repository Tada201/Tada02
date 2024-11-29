export const initProfileAnimation = () => {
    const profilePic = document.getElementById('profilePic');
    
    profilePic.addEventListener('mouseover', () => {
        profilePic.style.transform = 'scale(1.1) rotate(5deg)';
    });

    profilePic.addEventListener('mouseout', () => {
        profilePic.style.transform = 'scale(1) rotate(0deg)';
    });
};