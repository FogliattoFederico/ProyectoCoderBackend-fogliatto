// console.log("chat")

const socket = io();

// socket.emit("message", "esto es data en forma de string");

// socket.on("socket_individual", (data) => console.log(data));

// socket.on("para_todos_menos_el_actual", (data) => console.log(data));

// socket.on("socket_para_todos", (data) => console.log(data));

const input = document.getElementById('message')
const messageList = document.getElementById('list-message')

input.addEventListener('keyup', event => {
    if(event.key === 'Enter'){
        socket.emit('mensaje_cliente', input.value)
        input.value = ''
    }
})

socket.on('message-server', data => {

    console.log(data)

})