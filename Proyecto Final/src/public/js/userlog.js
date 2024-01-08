document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email')
    const submitButton = document.getElementById('submitButton');
    const form = document.getElementById('userLogForm')
    const githubButton = document.getElementById('githubButton')


    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        }
        try {
            const response = await fetch('http://localhost:4000/api/sessions/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            console.log(JSON.stringify(user));
            const data = await response.json();
            console.log(data.resultado);
            if (data.resultado === "OK") {
                console.log(data.message);
                window.location.reload();
            } else {
                console.log(data.error);
            }
        } catch (error) {
            console.log(error);
        }
    })
    //TIRA ERROR DE CORS
    // githubButton.addEventListener('click', async function () {
    //     try {
    //         console.log("me triguereo");
    //         const response = await fetch('http://localhost:4000/api/sessions/github', {
    //             method: 'GET',
    //         });
    //         const data = await response.json();
    //         if (data.resultado === "OK") {
    //             console.log(data.message);
    //             window.location.reload();
    //         } else {
    //             console.log(data.error);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
    githubButton.addEventListener('click', function () {
        try {
            console.log("me triguereo");
            window.location.href = 'http://localhost:4000/api/sessions/github';
        } catch (error) {
            console.log(error);
        }
    });
})