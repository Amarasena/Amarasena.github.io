document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contact-form');
    const floatingIslands = document.querySelectorAll('.floating-island');

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Core carousel setup
    const projectsSection = document.querySelector('.projects-section');
    const projectSlides = document.querySelectorAll('.project-slide');
    const radius = window.innerWidth * 0.4;
    const theta = (2 * Math.PI) / projectSlides.length;

    function positionSlide(slide, angle) {
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const scale = (z + radius) / (2 * radius);
        
        gsap.set(slide, {
            x: x,
            z: z,
            scale: 0.6 + scale * 0.4,
            opacity: 0.3 + scale * 0.7,
            rotationY: angle * (180 / Math.PI),
            zIndex: Math.round(scale * 100),
            immediateRender: true
        });
    }

    function rotateCarousel(progress) {
        // Calculate snap points (one for each project)
        const snapPoints = projectSlides.length;
        const snapProgress = Math.floor(progress * snapPoints) / snapPoints;
        const snapThreshold = 0.1; // Threshold for snapping
        
        // Add delay if close to a snap point
        const distanceToSnap = Math.abs(progress - snapProgress);
        if (distanceToSnap < snapThreshold) {
            progress = snapProgress + (progress - snapProgress) * 0.1;
        }

        const rotation = progress * Math.PI * 2;
        requestAnimationFrame(() => {
            projectSlides.forEach((slide, index) => {
                const angle = theta * index + rotation;
                positionSlide(slide, angle);
            });
        });
    }

    // Updated scroll trigger
    ScrollTrigger.create({
        trigger: '.projects-section',
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: {
            duration: 1,
            snap: 1 / (projectSlides.length - 1)
        },
        onUpdate: (self) => rotateCarousel(self.progress)
    });

    // Hover effects
    projectSlides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            if (parseFloat(slide.style.zIndex) > 50) {
                gsap.to(slide, {
                    scale: '+=0.1',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        slide.addEventListener('mouseleave', () => {
            gsap.to(slide, {
                scale: '-=0.1',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Form Validation
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.elements['name'].value;
        const email = contactForm.elements['email'].value;
        const message = contactForm.elements['message'].value;

        if (name && email && message) {
            console.log('Form submitted:', { name, email, message });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Hover Effects for project cards
    projectSlides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            gsap.to(slide, {
                scale: 1.05,
                duration: 0.3
            });
        });

        slide.addEventListener('mouseleave', () => {
            gsap.to(slide, {
                scale: 1,
                duration: 0.3
            });
        });
    });
});

