document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 0;
    const sections = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    showSection(currentStep);

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showSection(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateSection(currentStep)) {
            if (currentStep < sections.length - 1) {
                currentStep++;
                showSection(currentStep);
            } else {
                updatePreview(); // Final preview update before generating PDF
                generateResume();
                setTimeout(showThankYouPage, 2000);
            }
        }
    });

    document.getElementById('addExperience').addEventListener('click', () => {
        const container = document.getElementById('experienceItems');
        const newExp = createExperienceItem();
        container.appendChild(newExp);
        updatePreview();
    });

    document.getElementById('addEducation').addEventListener('click', () => {
        const container = document.getElementById('educationItems');
        const newEdu = createEducationItem();
        container.appendChild(newEdu);
        updatePreview();
    });

    document.getElementById('addSkill').addEventListener('click', () => {
        const skillInput = document.getElementById('skillInput');
        const skillLevel = document.getElementById('skillLevel');

        if (skillInput.value.trim()) {
            const skillsContainer = document.getElementById('skillsList');
            const skillItem = document.createElement('div');
            skillItem.className = 'skill-item';
            skillItem.innerHTML = `
                <span>${skillInput.value} - ${skillLevel.value}</span>
                <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updatePreview();">×</button>
            `;
            skillsContainer.appendChild(skillItem);
            skillInput.value = '';
            updatePreview();
        }
    });

    function showSection(stepIndex) {
        sections.forEach((section, index) => {
            section.style.display = index === stepIndex ? 'block' : 'none';
        });

        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= stepIndex);
        });

        prevBtn.style.display = stepIndex === 0 ? 'none' : 'block';
        nextBtn.textContent = stepIndex === sections.length - 1 ? 'Generate Resume' : 'Next';

        updatePreview();
    }

    function validateSection(sectionIndex) {
        const currentSection = sections[sectionIndex];
        const requiredFields = currentSection.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    function createExperienceItem() {
        const div = document.createElement('div');
        div.className = 'experience-item animate__animated animate__fadeIn';
        div.innerHTML = `
            <input type="text" placeholder="Company Name" required>
            <input type="text" placeholder="Position" required>
            <div class="date-group">
                <input type="date" placeholder="Start Date" required>
                <input type="date" placeholder="End Date">
            </div>
            <textarea placeholder="Job Description" required></textarea>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        return div;
    }

    function createEducationItem() {
        const div = document.createElement('div');
        div.className = 'education-item animate__animated animate__fadeIn';
        div.innerHTML = `
            <input type="text" placeholder="Degree/Certificate" required>
            <input type="text" placeholder="Institution" required>
            <div class="date-group">
                <input type="date" placeholder="Start Date" required>
                <input type="date" placeholder="End Date">
            </div>
            <textarea placeholder="Description"></textarea>
            <button type="button" class="remove-btn" onclick="this.parentElement.remove(); updatePreview();">Remove</button>
        `;
        return div;
    }

    function updatePreview() {
        const preview = document.getElementById('resumePreview');
        const formData = collectFormData();
        preview.innerHTML = generateResumeHTML(formData);
        preview.classList.add('animate__animated', 'animate__fadeIn');
    }

    function collectFormData() {
        return {
            personal: {
                name: document.getElementById('fullName')?.value || '',
                title: document.getElementById('jobTitle')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                location: document.getElementById('location')?.value || '',
                summary: document.getElementById('summary')?.value || ''
            },
            experience: Array.from(document.querySelectorAll('.experience-item')).map(exp => ({
                company: exp.querySelector('input[placeholder="Company Name"]').value,
                position: exp.querySelector('input[placeholder="Position"]').value,
                startDate: exp.querySelectorAll('input[type="date"]')[0].value,
                endDate: exp.querySelectorAll('input[type="date"]')[1].value,
                description: exp.querySelector('textarea').value
            })),
            education: Array.from(document.querySelectorAll('.education-item')).map(edu => ({
                degree: edu.querySelector('input[placeholder="Degree/Certificate"]').value,
                institution: edu.querySelector('input[placeholder="Institution"]').value,
                startDate: edu.querySelectorAll('input[type="date"]')[0].value,
                endDate: edu.querySelectorAll('input[type="date"]')[1].value,
                description: edu.querySelector('textarea').value
            })),
            skills: Array.from(document.querySelectorAll('.skill-item')).map(skill =>
                skill.querySelector('span').textContent
            )
        };
    }

    function generateResumeHTML(data) {
        return `
            <div class="resume-header">
                <h1>${data.personal.name || 'Your Name'}</h1>
                <p class="title">${data.personal.title || 'Your Title'}</p>
                <div class="contact-info">
                    ${data.personal.email ? `<p><i class="fas fa-envelope"></i> ${data.personal.email}</p>` : ''}
                    ${data.personal.phone ? `<p><i class="fas fa-phone"></i> ${data.personal.phone}</p>` : ''}
                    ${data.personal.location ? `<p><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</p>` : ''}
                </div>
            </div>
            ${data.personal.summary ? `<div class="resume-section"><h2>Summary</h2><p>${data.personal.summary}</p></div>` : ''}
            ${data.experience.length ? `
                <div class="resume-section">
                    <h2>Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-entry">
                            <h3>${exp.position} at ${exp.company}</h3>
                            <p class="date">${exp.startDate} - ${exp.endDate}</p>
                            <p>${exp.description}</p>
                        </div>`).join('')}
                </div>
            ` : ''}
            ${data.education.length ? `
                <div class="resume-section">
                    <h2>Education</h2>
                    ${data.education.map(edu => `
                        <div class="education-entry">
                            <h3>${edu.degree} at ${edu.institution}</h3>
                            <p class="date">${edu.startDate} - ${edu.endDate}</p>
                            <p>${edu.description}</p>
                        </div>`).join('')}
                </div>
            ` : ''}
            ${data.skills.length ? `
                <div class="resume-section">
                    <h2>Skills</h2>
                    <ul>${data.skills.map(skill => `<li>${skill}</li>`).join('')}</ul>
                </div>
            ` : ''}
        `;
    }

    function generateResume() {
        const element = document.getElementById('resumePreview');
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'my_resume.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = 'Generating PDF...';
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.padding = '20px';
        loadingDiv.style.background = 'rgba(0,0,0,0.7)';
        loadingDiv.style.color = 'white';
        loadingDiv.style.borderRadius = '5px';
        document.body.appendChild(loadingDiv);

        html2pdf().set(opt)
            .from(element)
            .save()
            .then(() => {
                document.body.removeChild(loadingDiv);
            })
            .catch(err => {
                console.error('PDF generation failed:', err);
                alert('Failed to generate PDF. Please try again.');
                document.body.removeChild(loadingDiv);
            });
    }

    function showThankYouPage() {
        const mainContent = document.querySelector('.container');
        mainContent.innerHTML = `
            <div class="thank-you-container animate__animated animate__fadeIn">
                <div class="logo-container animate__animated animate__bounceIn">
                    <img src="resume-logo.png" alt="Resume Builder Logo" class="resume-logo">
                    <h1>Thank You!</h1>
                </div>
                <div class="quote-container animate__animated animate__fadeInUp animate__delay-1s">
                    <p class="quote">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
                    <p class="quote-author">- Winston Churchill</p>
                </div>
                <div class="feedback-section animate__animated animate__fadeInUp animate__delay-2s">
                    <h2>How was your experience?</h2>
                    <div class="rating-container">
                        <div class="star-rating">
                            ${Array(5).fill().map((_, i) => `<span class="star" data-rating="${i + 1}">★</span>`).join('')}
                        </div>
                    </div>
                    <textarea placeholder="Share your feedback (optional)" class="feedback-text"></textarea>
                    <button class="submit-feedback-btn">Submit Feedback</button>
                </div>
                <div class="action-buttons animate__animated animate__fadeInUp animate__delay-3s">
                    <button class="new-resume-btn">Create New Resume</button>
                    <button class="logout-btn">Logout</button>
                </div>
            </div>
        `;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = star.dataset.rating;
                stars.forEach(s => s.classList.toggle('hover', s.dataset.rating <= rating));
            });
            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
            star.addEventListener('click', () => {
                stars.forEach(s => s.classList.remove('selected'));
                const rating = star.dataset.rating;
                stars.forEach(s => {
                    if (s.dataset.rating <= rating) s.classList.add('selected');
                });
            });
        });

        document.querySelector('.submit-feedback-btn').addEventListener('click', () => {
            const rating = document.querySelectorAll('.star.selected').length;
            const feedback = document.querySelector('.feedback-text').value;
            showSuccessMessage('Thank you for your feedback!');
            console.log('Rating:', rating, 'Feedback:', feedback);
        });

        document.querySelector('.new-resume-btn').addEventListener('click', () => {
            window.location.href = 'home.html';
        });

        document.querySelector('.logout-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    function showSuccessMessage(msg) {
        alert(msg);
    }
});
