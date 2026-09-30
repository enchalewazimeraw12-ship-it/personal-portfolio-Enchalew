// Contact Form Handler - Submit via the Node API
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Sending...';
            }

            try {
                const apiUrl = '/api/contact';
                const formData = Object.fromEntries(new FormData(contactForm));
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (formMessage) {
                    formMessage.style.display = 'block';
                    if (data.success) {
                        formMessage.className = 'alert alert-success';
                        formMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + data.message;
                        contactForm.reset();
                    } else {
                        formMessage.className = 'alert alert-danger';
                        formMessage.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>' + data.message;
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.className = 'alert alert-danger';
                    formMessage.innerHTML = '<i class="bi bi-exclamation-circle me-2"></i>Error: ' + error.message;
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.originalText || submitBtn.innerHTML;
                }
            }
        });
    }

    loadProjects();
    loadProfile();
});

async function loadProfile() {
    const profileContent = document.getElementById('profileContent');
    if (!profileContent) return;

    try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const profile = await response.json();
        document.querySelector('[data-profile="name"]').textContent = profile.name;
        document.querySelector('[data-profile="photo"]').src = profile.photo;
        document.querySelector('[data-profile="photo"]').alt = profile.name;
        document.querySelector('[data-profile="shortBio"]').textContent = profile.shortBio;
        document.querySelector('[data-profile="story"]').textContent = profile.story;

        const highlights = document.querySelector('[data-profile="highlights"]');
        highlights.innerHTML = profile.highlights.map(item => `
            <li class="mb-2"><i class="bi ${item.icon} text-primary me-2"></i>${item.text}</li>
        `).join('');
    } catch (error) {
        console.error('Failed to load profile:', error);
        profileContent.innerHTML = '<p class="text-danger">Unable to load profile information.</p>';
    }
}

async function loadProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const projects = data.projects || [];

        container.innerHTML = projects.map(project => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm">
                    <img src="${project.image}" class="card-img-top" alt="${project.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${project.title}</h5>
                        <p class="card-text text-muted">${project.description}</p>
                        ${project.technologies ? `<p class="small text-secondary mb-2">${project.technologies.join(' • ')}</p>` : ''}
                        <div class="mt-auto">
                            <a href="${project.github}" class="btn btn-primary btn-sm me-2" target="_blank" rel="noopener">GitHub</a>
                            ${project.live ? `<a href="${project.live}" class="btn btn-outline-secondary btn-sm" target="_blank" rel="noopener">Live</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load projects:', error);
        container.innerHTML = '<div class="col-12"><p class="text-danger">Unable to load projects at this time.</p></div>';
    }
}
