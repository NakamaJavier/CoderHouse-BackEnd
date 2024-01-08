document.addEventListener('DOMContentLoaded', async function () {

    const profileName = document.getElementById('profileName');
    const profileInfo = document.getElementById('profileInfo');
    const emailElement = document.getElementById('emailElement');
    const email = emailElement.dataset.email;

    const response = await fetch(`/api/user/${email} `)
        .then(response => response.json())
        .then(data => {
            if (data.response === "OK") {
                const {
                    first_name,
                    last_name,
                    age,
                    email,
                    rol
                } = data.message
                profileName.textContent = `${first_name} ${last_name}`;
                profileInfo.textContent = `Edad: ${age} | Email: ${email} | Rol: ${rol}`;
            } else {
                console.log(data.error);;
            }
        }).catch(error => {
            console.log(error);
        });


});