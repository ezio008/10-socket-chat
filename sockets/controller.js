const { Socket } = require("socket.io");
const { comprobateJWT } = require("../helpers");
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

const socketController = async (socket = new Socket(), io) => {

    const token = socket.handshake.headers.auth;
    const user = await comprobateJWT(token);

    if (!user) {
        socket.disconnect();
    }

    // Agregar el usuario
    chatMessages.addUser(user);
    io.emit('usuarios-activos', chatMessages.usersArr);
    socket.emit('recibir-mensaje', chatMessages.last10);

    // Conectarlo a la sala especial
    socket.join( user.id ); // global, socket.id, user.id

    // Limpar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.deleteUser(user);
        io.emit('usuarios-activos', chatMessages.usersArr);
    });

    socket.on('enviar-mensaje', ({uid, message}) => {
        if (uid) {
            socket.to(uid).emit('mensaje-privado', {user: user.name, message});
        } else {
            chatMessages.sendMessage(user.id, user.name, message);
            io.emit('recibir-mensaje', chatMessages.last10);
        }
    })
}



module.exports = {
    socketController
}

