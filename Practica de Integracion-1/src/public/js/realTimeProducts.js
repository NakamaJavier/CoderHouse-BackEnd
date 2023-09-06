const socket = io()

const form = document.getElementById('newFormProduct')
const deleteProduct = document.getElementById('deleteProduct')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target) //El formulario que disparo el evento
    const prod = Object.fromEntries(datForm) //Dado un objeto iterable, te devuelvo sus datos en un objeto simple
    prod.price = parseInt(prod.price)
    prod.stock = parseInt(prod.stock)
    if (prod.status==="on")
        prod.status=true
    else
        prod.status= false
    console.log(prod);
    console.log(typeof(prod.price));
    socket.emit('nuevoProducto', prod)
    socket.on('mensajeProductoCreado', (mensaje) => {
        Swal.fire(
            mensaje
        )
    })
    e.target.reset()
})

deleteProduct.addEventListener('click', (e) => {
    const idInput = document.querySelector(".delete-option input[name='id']");
    const idValue = parseInt(idInput.value)
    socket.emit('borrarProducto', idValue)
    socket.on('mensajeProductoBorrado', (mensaje) => {
        Swal.fire(
            mensaje
        )
    })
    idInput.value = "";
})

    //Actualizo la lista de productos en tiempo real
    socket.on('newProductList', (productosActualizados) => {
        const productosContainer = document.querySelector('.flex-container'); // El contenedor donde se muestran los productos
        // Limpia el contenido actual del contenedor
        productosContainer.innerHTML = '';

        // Recorre la lista de productos actualizados y crea las tarjetas
        productosActualizados.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style = 'width: 18rem;';
    
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
    
            // Construye el contenido de la tarjeta con la información del producto
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.textContent = producto.title;
    
            const id = document.createElement('p');
            id.className = 'card-text';
            id.textContent = `ID: ${producto.id}`;
    
            const description = document.createElement('p');
            description.className = 'card-text';
            description.textContent = `Descripcion: ${producto.description}`;
    
            const category = document.createElement('p');
            category.className = 'card-text';
            category.textContent = `Categoria: ${producto.category}`;
    
            const price = document.createElement('p');
            price.className = 'card-text';
            price.textContent = `Precio: ${producto.price}`;
    
            const stock = document.createElement('p');
            stock.className = 'card-text';
            stock.textContent = `Stock: ${producto.stock}`;
    
            const code = document.createElement('p');
            code.className = 'card-text';
            code.textContent = `Codigo: ${producto.code}`;
    
            const status = document.createElement('p');
            status.className = 'card-text';
            status.textContent = `Status: ${producto.status ? 'ok' : 'Disable'}`;
    
            // Agrega los elementos al cuerpo de la tarjeta
            cardBody.appendChild(title);
            cardBody.appendChild(id);
            cardBody.appendChild(description);
            cardBody.appendChild(category);
            cardBody.appendChild(price);
            cardBody.appendChild(stock);
            cardBody.appendChild(code);
            cardBody.appendChild(status);
    
            // Agrega el cuerpo de la tarjeta a la tarjeta
            card.appendChild(cardBody);
    
            // Agrega la tarjeta al contenedor de productos
            productosContainer.appendChild(card);
    });
});