document.addEventListener('DOMContentLoaded', async function () {
    const productContainer = document.querySelector('.product-container');

    const response = await fetch(`/api/product`)
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