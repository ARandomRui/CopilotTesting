document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');
    
    if (!name || !email || !message) {
        formMessage.textContent = 'Please fill in all fields.';
        formMessage.className = 'error';
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.className = 'error';
        return;
    }
    
    // Simulate form submission
    console.log('Form submitted:', { name, email, message });
    
    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
    formMessage.className = 'success';
    
    this.reset();
    
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
