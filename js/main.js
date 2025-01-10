// Three.js background setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: '#0984e3',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

// Create mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;

    // Hero content parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `
            translateX(${-mouseX * 2}px) 
            translateY(${-mouseY * 2}px)
            rotateX(${mouseY / 2}deg) 
            rotateY(${-mouseX / 2}deg)
        `;
    }

    // Profile image tilt effect
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        const rect = profileContainer.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        
        profileContainer.style.transform = `
            perspective(1000px)
            rotateX(${y / 30}deg)
            rotateY(${-x / 30}deg)
            translateZ(50px)
        `;
    }
});

// Reset transforms on mouse leave
document.addEventListener('mouseleave', () => {
    const heroContent = document.querySelector('.hero-content');
    const profileContainer = document.querySelector('.profile-container');

    if (heroContent) {
        heroContent.style.transform = 'translateX(0) translateY(0) rotateX(0) rotateY(0)';
    }
    if (profileContainer) {
        profileContainer.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(50px)';
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += mouseY * 0.0001;
    particlesMesh.rotation.y += mouseX * 0.0001;

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .skill-category, .experience-card, .project-card').forEach(element => {
    observer.observe(element);
});

// Skills Filter
const filterPills = document.querySelectorAll('.filter-pill');
const skillCategories = document.querySelectorAll('.skill-category');

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        // Remove active class from all pills
        filterPills.forEach(p => p.classList.remove('active'));
        // Add active class to clicked pill
        pill.classList.add('active');

        const selectedCategory = pill.getAttribute('data-category');

        skillCategories.forEach(category => {
            if (selectedCategory === 'all') {
                category.style.display = 'block';
                setTimeout(() => {
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';
                }, 50);
            } else {
                if (category.getAttribute('data-type') === selectedCategory) {
                    category.style.display = 'block';
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    category.style.opacity = '0';
                    category.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        category.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});
