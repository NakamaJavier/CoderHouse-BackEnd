document.addEventListener('DOMContentLoaded', async function () {
    const productContainer = document.querySelector('.product-container');
    const profileName = document.getElementById('profileName');
    const profileInfo = document.getElementById('profileInfo');
    const emailElement = document.getElementById('emailElement');
    const email = emailElement.dataset.email;

    const user = await fetch(`/api/user/${email} `)
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
                profileName.textContent = `Bienvenido: ${first_name} ${last_name}`;
                profileInfo.textContent = `Edad: ${age} | Email: ${email} | Rol: ${rol}`;
            } else {
                console.log(data.error);;
            }
        }).catch(error => {
            console.log(error);
        });

    const response = await fetch(`/api/product?limit=100`)
        .then(response => response.json())
        .then(data => {
            if (data.resultado === "OK") {
                const productsOK = data.message.payload.filter(prod => prod.status)
                return productsOK; // Filtrar por status true
            } else {
                console.log(data.error);
                return [];
            }
        }).catch(error => {
            console.log(error);
            return [];
        });

    const products = response || [];

    products.forEach(prod => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <h2>${prod.title}</h2>
            <p><span>Descripción:</span> ${prod.description}</p>
            <p><span>Categoría:</span> ${prod.category}</p>
            <p><span>Código:</span> ${prod.code}</p>
            <p><span>Stock:</span> ${prod.stock}</p>
        `;

        productContainer.appendChild(productCard);
    });
});