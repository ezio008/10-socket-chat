const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {

    const token = req.headers.auth;

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid, exp } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const expDate = new Date();
        expDate.setTime(exp * 1000);
        
        if(expDate < Date.now()) {
            return res.status(401).json({
                msg: 'Token expirado'
            });
        }

        // leer el usuario que corresponde al uid
        const user = await User.findById(uid);

        // Verificar si el usuario existe
        if(!user) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            });
        }

        // verificar si el usuario esta habilitado
        if(!user.state) {
            return res.status(401).json({
                msg: 'Token no valido - usuario deshabilitado'
            });
        }

        req.user = user;        

    } catch (error) {
        return res.status(401).json({
            msg: 'Token no valido',
            error
        });
    }

    next();

}

module.exports = {
    validateJWT
}
