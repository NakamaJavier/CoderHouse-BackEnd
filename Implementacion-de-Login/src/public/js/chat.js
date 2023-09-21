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
    //hago una peticion get para recuperar todos los mensajes (solo si no se hizo antes)
    fetch('http://localhost:4000/api/messages', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => response.json())
                .then(data => {
                    if (data.resultado === "OK") {
                        const mensajesDB = data.message;
                        socket.emit('mensajesDB', mensajesDB)
                        mensajesDB.forEach(mensaje => {
                            parrafosMensajes.innerHTML += `<p><span>${mensaje.date} - ${mensaje.email} escribio :</span> ${mensaje.message}</p>`})
                    } else {
                        console.log(data.error);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
})

botonChat.addEventListener('click', async () => {
    let fechaActual = new Date().toLocaleString()
    const message = { email: email, message: valInput.value, date:fechaActual }
    if (valInput.value.trim().length > 0) {     //Evitar que me envien un mensaje vacio
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
                socket.emit('mensaje', message)
                valInput.value = "" //Limpio el input
            }else{
                console.error(data.resultado)
            }
        }catch{
            console.error(error);
        }
        
    }
})

document.getElementById('chatBox').addEventListener('keydown', (event) => {
    if (event.keyCode === 13) { // Verifica si se presionó la tecla Enter
        event.preventDefault(); // Evita que se haga un salto de línea en el input
        document.getElementById('botonChat').click(); // Simula un clic en el botón de enviar
    }
});


socket.on('mensajes', arrayMensajes => {
    parrafosMensajes.innerHTML = "" //Limpio el html
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p><span>${mensaje.date} - ${mensaje.email} escribio :</span> ${mensaje.message}</p>`
    })
})