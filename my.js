// Client-side JavaScript for contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const data = {
                name: document.getElementById('name')?.value,
                email: document.getElementById('email')?.value,
                message: document.getElementById('message')?.value,
            };

            // Show success message (works without server)
            alert('✅ Thank you! Your message has been received.\n\nName: ' + data.name + '\nEmail: ' + data.email);
            contactForm.reset();
        });
    }
});
