const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-node-loren.herokuapp.com/api/auth/';

let user = null;
let socket = null;
let token = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensaje = document.querySelector('#ulMensaje');
const btnSalir = document.querySelector('#btnSalir');

// Vallidar el token del localstorage
const validateJWT = async () => {

    token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
        headers: { 'auth': token }
    });

    const result = await resp.json();
    token = result.token;
    localStorage.setItem('token', token);
    user = result.user;

    document.title = user.name;

    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            auth: token
        }
    });

    socket.on('connect', () => {
        console.log('socket online');
    });

    socket.on('disconnect', () => {
        console.log('socket offline');
    });

    socket.on('recibir-mensaje', showMessages);

    socket.on('usuarios-activos', showUsers);

    socket.on('mensaje-privado', (payload) => {
        console.log(payload);
    });

}

const showUsers = (users = []) => {

    let userHtml = '';
    users.forEach(({ name, uid }) => {
        userHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = userHtml;
}

const showMessages = (messages = []) => {
    console.log(messages);
    let messagesHtml = '';
     
    messages.forEach(({ name, message, uid }) => {
        const spanClass = uid === user.uid ? 'text-danger' : 'text-primary';

        messagesHtml += `
            <li>
                <p>
                    <span class="${spanClass}">${name}: </message>
                    <span class="text-secondary">${message}</span>
                </p>
            </li>
        `;
    });

    ulMensaje.innerHTML = messagesHtml;
}

btnEnviar.addEventListener('click', () => {
    const message = txtMensaje.value.trim();
    const uid = txtUid.value.trim();

    if(message.length === 0) return;

    socket.emit('enviar-mensaje', {message, uid});

    txtMensaje.value = '';
});

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const message = txtMensaje.value.trim();
    const uid = txtUid.value.trim();

    if(keyCode !== 13 ) return;
    if(message.length === 0) return;

    socket.emit('enviar-mensaje', {message, uid});

    txtMensaje.value = '';
});

const main = async () => {
    await validateJWT();
}

main();