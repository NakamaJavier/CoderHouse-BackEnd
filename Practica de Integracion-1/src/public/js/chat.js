const socket = io()

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let email

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su email",
    input: "text",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un email'
    },
    allowOutsideClick: false
}).then(resultado => {
    email = resultado.value
    console.log(email)
})

botonChat.addEventListener('click', async () => {
    let fechaActual = new Date().toLocaleString()
    const message = { email: email, message: valInput.value, date:fechaActual }
    if (valInput.value.trim().length > 0) { 
        try{
            //guardo el mensaje en la base de datos usando la terminal POST
            const response = await fetch('http://localhost:4000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            const data = await response.json();
            if (data.resultado ==="OK"){
                console.log(data.message)
            }else{
                console.error(error)
            }
                //Evitar que me envien un mensaje vacio
            socket.emit('mensaje', message)
            valInput.value = "" //Limpio el input
        }catch{
            console.error(error);
        }
        
    }
})

socket.on('mensajes', arrayMensajes => {
    parrafosMensajes.innerHTML = "" //Limpio el html
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p><span>${mensaje.date} - ${mensaje.email} escribio :</span> ${mensaje.message}</p>`
    })
})