// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Theme Management
const themeCheckbox = document.querySelector('.theme-checkbox');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeCheckbox.checked = savedTheme === 'dark';

themeCheckbox.addEventListener('change', () => {
    const newTheme = themeCheckbox.checked ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    playSound('switch');
});

// Form Switching
function switchForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchBtns = document.querySelectorAll('.switch-btn');
    const indicator = document.querySelector('.switcher-indicator');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        indicator.style.transform = 'translateX(0)';
        switchBtns[0].classList.add('active');
        switchBtns[1].classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        indicator.style.transform = 'translateX(100%)';
        switchBtns[0].classList.remove('active');
        switchBtns[1].classList.add('active');
    }

    // Trigger AOS refresh
    AOS.refresh();
}

// Password Toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

// Form Validation with Animations
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        const field = input.parentElement;
        
        if (!input.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
            showError(field, 'Please enter a valid email');
            isValid = false;
        } else if (input.type === 'password' && input.value.length < 6) {
            showError(field, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            showSuccess(field);
        }
    });

    if (isValid) {
        showNotification('Success! Processing your request...', 'success');
    }

    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    // Create or update error message
    let errorMsg = field.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        field.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    
    // Shake animation
    field.style.animation = 'shake 0.5s';
    setTimeout(() => field.style.animation = '', 500);
}

function showSuccess(field) {
    field.classList.remove('error');
    field.classList.add('success');
    
    // Remove error message if exists
    const errorMsg = field.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm('loginForm')) {
        // Add your login logic here
    }
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm('signupForm')) {
        // Add your signup logic here
    }
});

// Add smooth transitions for all interactive elements
document.querySelectorAll('button, input, a').forEach(element => {
    element.addEventListener('mouseover', () => playSound('hover'));
});

// Sound Effects (optional)
const sounds = {
    hover: new Audio('data:audio/mp3;base64,...'), // Add base64 audio data
    switch: new Audio('data:audio/mp3;base64,...'), // Add base64 audio data
    success: new Audio('data:audio/mp3;base64,...'), // Add base64 audio data
    error: new Audio('data:audio/mp3;base64,...') // Add base64 audio data
};

function playSound(type) {
    if (sounds[type]) {
        sounds[type].currentTime = 0;
        sounds[type].play().catch(() => {});
    }
}
function validateAndSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Reset error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        document.querySelector('#loginEmail + .error-message').textContent = 'Email is required';
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        document.querySelector('#loginPassword + .error-message').textContent = 'Password is required';
        isValid = false;
    }
    
    // If form is valid, redirect to home page
    if (isValid) {
        window.location.href = 'home.html';
    }
    
    return false;
}