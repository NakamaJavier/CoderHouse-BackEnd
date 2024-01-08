const btnCarrito = document.getElementById("btnCarrito");
const email = btnCarrito.dataset.email


const cargarCarrito = async () => {
    let carritoCompra = []
    const id_cart = await fetch(`/api/user/${email} `)
        .then(response => response.json())
        .then(data => {
            if (data.response === "OK") {
                const {
                    id_cart: { _id: id_cart }
                } = data.message
                return id_cart
            } else {
                console.log(data.error);
                return null
            }
        }).catch(error => {
            console.log(error);
            return null
        });
    console.log("_idcart", id_cart);
    carritoCompra = await fetch(`/api/carts/${id_cart} `)
        .then(response => response.json())
            .then(data => {
                if (data.response === "OK") {
                    return data.message.products
                } else {
                    console.log(data.error);
                    return null
                }
            }).catch(error => {
                console.log(error);
                return null
            });
    console.log(carritoCompra);
    if (carritoCompra.length > 0) {
        console.log("me imprimo");
        btnCarrito.innerHTML = `
                            <i class="fa-sharp fa-solid fa-cart-shopping fa-lg" style="color: #ffffff;"></i>
                            <span class="position-absolute  start-f translate-middle badge rounded-pill bg-danger top-f">
                                ${carritoCompra.length}
                            </span>
                            `
    } 
    else
        btnCarrito.innerHTML = `<i class="fa-sharp fa-solid fa-cart-shopping fa-lg"></i>`
}

cargarCarrito()