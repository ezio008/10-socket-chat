const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            search: '/api/buscar',
            categories: '/api/categorias',
            uploads: '/api/uploads',
            users: '/api/usuarios',
            products: '/api/productos',
        }
        this.authPath = '/api/auth';
        this.userRoutePath = '/api/usuarios';
        
        // Conectar a base de datos
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Configuración sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true            
        }));
    }

    routes() {

        // Rutas de Autenticación
        this.app.use(this.paths.auth, require('../routes/auth'));

        // Rutas de usuario
        this.app.use(this.paths.users, require('../routes/users'));

        // Rutas de categorias
        this.app.use(this.paths.categories, require('../routes/categories'));
        
        // Rutas de productos
        this.app.use(this.paths.products, require('../routes/products'));

        // Ruta de busqueda
        this.app.use(this.paths.search, require('../routes/search'));

        // Ruta de carga de archivos
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io) );
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;