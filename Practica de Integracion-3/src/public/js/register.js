document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.getElementById('submitButton');
    const firstNameInput = document.getElementById('nombre')
    const lastNameInput = document.getElementById('apellido')
    const emailInput = document.getElementById('email')
    const ageInput = document.getElementById('edad')
    // Habilitar o deshabilitar el botón según la validación
    form.addEventListener('input', function () {
        const isPasswordMatch = passwordInput.value === confirmPasswordInput.value;
        const isFormValid = form.checkValidity() && isPasswordMatch;
        submitButton.disabled = !isFormValid;
    });

    // Verificar la coincidencia de contraseñas al enviar el formulario
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (passwordInput.value !== confirmPasswordInput.value) {
            event.preventDefault();
            alert('Las contraseñas no coinciden');
        } else {
            const user = {
                first_name: firstNameInput.value,
                last_name: lastNameInput.value,
                age: parseInt(ageInput.value),
                email: emailInput.value,
                password: passwordInput.value
            }
            console.log(JSON.stringify(user));

            const response = await fetch('http://localhost:4000/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.response === "OK") {
                        console.log(data.message);
                    } else {
                        console.log(data.error);;
                    }
                }).catch(error => {
                    console.log(error);
                });
        }
    })
})