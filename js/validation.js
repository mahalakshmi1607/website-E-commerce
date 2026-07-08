// Form Validation Logic
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

window.FormValidator = {
    validateEmail,
    validatePassword
};

// Password toggle generic logic
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-password')) {
        const input = document.querySelector(e.target.dataset.target);
        if (input) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        }
    }
});
