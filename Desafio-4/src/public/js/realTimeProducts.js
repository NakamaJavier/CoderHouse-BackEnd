const socket = io()

const form = document.getElementById('newFormProduct')

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