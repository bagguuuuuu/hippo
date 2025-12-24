const leftEye = document.getElementById('leftEye');
const rightEye = document.getElementById('rightEye');
const heartContainer = document.getElementById('heartContainer');
const particlesContainer = document.getElementById('particlesContainer');
const message = document.getElementById('message');
const colorOptions = document.querySelectorAll('.color-option');
const rootStyle = document.documentElement.style;

let heartCenterX, heartCenterY;
const proximityThreshold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--heart-size')) * 1.2;

const messages = [
    "I ♥ You!",
    "You're Amazing!",
    "Stay Awesome!",
    "Feel the Love!",
    "You're the Best!",
    "Sending Love!",
    "Keep Smiling!"
];

function updateElementPositions() {
    const leftEyeRect = leftEye.getBoundingClientRect();
    leftEye.style.setProperty('--eye-center-x', `${leftEyeRect.left + leftEyeRect.width / 2}px`);
    leftEye.style.setProperty('--eye-center-y', `${leftEyeRect.top + leftEyeRect.height / 2}px`);

    const rightEyeRect = rightEye.getBoundingClientRect();
    rightEye.style.setProperty('--eye-center-x', `${rightEyeRect.left + rightEyeRect.width / 2}px`);
    rightEye.style.setProperty('--eye-center-y', `${rightEyeRect.top + rightEyeRect.height / 2}px`);
    
    const heartRect = heartContainer.getBoundingClientRect();
    heartCenterX = heartRect.left + heartRect.width / 2;
    heartCenterY = heartRect.top + heartRect.height / 2;
    rootStyle.setProperty('--heart-center-x', `${heartCenterX}px`);
    rootStyle.setProperty('--heart-center-y', `${heartCenterY}px`);
}

function createParticles() {
    particlesContainer.innerHTML = '';
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150 + 100;
        const x = heartCenterX + Math.cos(angle) * distance;
        const y = heartCenterY + Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const duration = Math.random() * 3 + 2;
        particle.style.animation = `float-up ${duration}s infinite ease-out`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function getContrastingColor(baseColor) {
    let r = parseInt(baseColor.slice(1, 3), 16);
    let g = parseInt(baseColor.slice(3, 5), 16);
    let b = parseInt(baseColor.slice(5, 7), 16);
    
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    
    const max = Math.max(r, g, b);
    if (max < 200) {
        const factor = 200 / max;
        r = Math.min(255, Math.floor(r * factor));
        g = Math.min(255, Math.floor(g * factor));
        b = Math.min(255, Math.floor(b * factor));
    }
    
    return `rgb(${r}, ${g}, ${b})`;
}

function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'float-heart';
    heart.textContent = '♥';
    heart.style.fontSize = `${Math.random() * 15 + 15}px`;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    
    const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--heart-base-color').trim();
    const contrastColor = getContrastingColor(baseColor);
    heart.style.color = contrastColor;
    
    heart.style.textShadow = `0 0 8px rgba(255, 255, 255, 0.8), 0 0 3px ${contrastColor}`;
    
    heart.style.setProperty('--random-x', (Math.random() * 2 - 1).toString());
    heart.style.setProperty('--random-y', (Math.random() * -1 - 0.5).toString());
    heart.style.setProperty('--random-r', Math.random().toString());
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

function showMessage() {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    message.textContent = randomMessage;
    message.classList.add('show');
    
    setTimeout(() => {
        message.classList.remove('show');
    }, 2000);
}

function changeColorTheme(event) {
    if (!event.target.classList.contains('color-option')) return;
    
    colorOptions.forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const colors = event.target.getAttribute('data-color').split(',');
    
    rootStyle.setProperty('--heart-base-color', colors[0]);
    rootStyle.setProperty('--heart-highlight', colors[1]);
    rootStyle.setProperty('--heart-shadow', colors[2]);
    rootStyle.setProperty('--glow-color', colors[3]);
    
    const bgLight = tintColor(colors[0], 90);
    const bgDark = tintColor(colors[0], 80);
    document.body.style.background = `radial-gradient(circle, ${bgLight}, ${bgDark})`;
}

function tintColor(hex, percent) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r + (255 - r) * (percent/100)}, ${g + (255 - g) * (percent/100)}, ${b + (255 - b) * (percent/100)}, 1)`;
}

window.addEventListener('load', () => {
    updateElementPositions();
    createParticles();
    
    rootStyle.setProperty('--mouse-x', `${window.innerWidth / 2}px`);
    rootStyle.setProperty('--mouse-y', `${window.innerHeight / 2}px`);
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateElementPositions();
        createParticles();
    }, 100);
});

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    rootStyle.setProperty('--mouse-x', `${mouseX}px`);
    rootStyle.setProperty('--mouse-y', `${mouseY}px`);

    if (heartCenterX && heartCenterY) {
        const dxToHeart = mouseX - heartCenterX;
        const dyToHeart = mouseY - heartCenterY;
        const distanceToHeart = Math.sqrt(dxToHeart * dxToHeart + dyToHeart * dyToHeart);

        let proximity = 1 - Math.min(distanceToHeart / proximityThreshold, 1);
        rootStyle.setProperty('--mouse-proximity-to-heart', proximity);

        let dilation = 1 + proximity * 0.8;
        rootStyle.setProperty('--pupil-dilation-factor', dilation);
        
        const rotateX = (mouseY - window.innerHeight / 2) / window.innerHeight * 15;
        const rotateY = (window.innerWidth / 2 - mouseX) / window.innerWidth * 15;
        heartContainer.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});

heartContainer.addEventListener('click', (e) => {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createFloatingHeart(heartCenterX, heartCenterY);
        }, i * 100);
    }
    
    showMessage();
});

document.querySelector('.color-switcher').addEventListener('click', changeColorTheme);

setTimeout(() => {
    updateElementPositions();
    createParticles();
}, 50);