/* ==========================================================================
   INTERACTIVE LOGIC - ABHINAV GUPTA PORTFOLIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Toggle body scroll to prevent scrolling when menu is open
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close mobile menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 3. Header Scroll Effect
    const header = document.querySelector('.header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check on load
    handleScroll();

    // 4. Active Nav Link on Scroll (Intersection Observer)
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Triggers when section occupies middle area
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => sectionObserver.observe(section));

    // 5. Contact Form Submission Handling (EmailJS Integration)
    const EMAILJS_PUBLIC_KEY = "MBXMa0ifxa2zDSSrT"; 
    const EMAILJS_SERVICE_ID = "service_hb5irhu"; 
    const EMAILJS_TEMPLATE_ID = "template_xi0anxh"; 

    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    // Initialize EmailJS browser client
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,
        });
    }

    if (contactForm && formSuccess && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check if placeholders were replaced
            if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" || EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" || EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
                alert("Please configure your EmailJS credentials (Public Key, Service ID, and Template ID) in script.js to make the contact form functional!");
                return;
            }

            // Set button loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <div class="spinner"></div>
            `;

            // Map template parameters explicitly to match template brackets
            const templateParams = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Submit form to EmailJS using send method
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
                console.log("EmailJS Success Status:", response.status, response.text);
                contactForm.reset();
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            })
            .catch(error => {
                console.error("EmailJS sending failed:", error);
                alert("Submission failed. Error: " + (error.text || error.message || JSON.stringify(error)));
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Send Message</span>
                    <i data-lucide="send" class="icon-sm"></i>
                `;
            });
        });
    }

    // 6. Reveal Animations on Scroll (Fading items in)
    const revealElements = document.querySelectorAll('.skill-card, .timeline-item, .sub-project-card, .service-card, .featured-project-card');
    
    // Add base transition styles dynamically or let CSS handle it.
    // We add a class to trigger fade-in.
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -8% 0px', // triggers slightly before entering viewport
        threshold: 0.15
    };

    const revealObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealObserverCallback, revealObserverOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // 7. Footer - Dynamic Year Updates
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 8. Hero Interactive Neural Network Canvas Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const heroSection = document.getElementById('home');
        
        let width = canvas.width = heroSection.offsetWidth;
        let height = canvas.height = heroSection.offsetHeight;
        
        const particles = [];
        const density = Math.min(Math.floor((width * height) / 14000), 100);
        
        const mouse = {
            x: null,
            y: null,
            radius: 120
        };
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
                ctx.fill();
            }
            
            update() {
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                
                this.x += this.vx;
                this.y += this.vy;
                
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.hypot(dx, dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        
                        this.x += Math.cos(angle) * force * 2;
                        this.y += Math.sin(angle) * force * 2;
                    }
                }
            }
        }
        
        for (let i = 0; i < density; i++) {
            particles.push(new Particle());
        }
        
        window.addEventListener('resize', () => {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        });
        
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        function connect() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.hypot(dx, dy);
                    
                    if (distance < 100) {
                        const alpha = (100 - distance) / 100 * 0.12;
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const distance = Math.hypot(dx, dy);
                    
                    if (distance < mouse.radius) {
                        const alpha = (mouse.radius - distance) / mouse.radius * 0.15;
                        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connect();
            requestAnimationFrame(animate);
        }
        
        animate();
    }
});

// CSS Injection for spinner styling
const style = document.createElement('style');
style.textContent = `
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #ffffff;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
