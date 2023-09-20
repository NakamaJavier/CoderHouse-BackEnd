document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submitButton');

    // Habilitar o deshabilitar el botón según la validación
    form.addEventListener('input', function() {
        const isPasswordMatch = passwordInput.value === confirmPasswordInput.value;
        const isFormValid = form.checkValidity() && isPasswordMatch;
        submitButton.disabled = !isFormValid;
    });

    // Verificar la coincidencia de contraseñas al enviar el formulario
    form.addEventListener('submit', function(event) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault();
            alert('Las contraseñas no coinciden');
        }
    });
});