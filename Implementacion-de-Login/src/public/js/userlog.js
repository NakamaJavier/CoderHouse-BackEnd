document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email')
    const submitButton = document.getElementById('submitButton');
    const form = document.getElementById('userLogForm')

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        }
        const response = await fetch('http://localhost:4000/api/session/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.resultado === "OK") {
                        console.log(data.message);
                        window.location.reload();
                    } else {
                        console.log(data.error);;
                    }
                }).catch(error => {
                    console.log(error,data.message);
                });
    })

})