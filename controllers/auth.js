const { response } = require("express");
const { request } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Tengo que crearlo
            const data = {
                name,
                email,
                img,
                password: ':P',
                role:'USER_ROLE',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // Si el usuario en DB 
        if(!user.state) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(user.id);
        
        res.json({
            msg: 'Google sign-in',
            user,
            token
        });
    } catch (error) {
        return res.status(400).json({
            msg: 'Fallo al verificar el token de Google',
            error
        });
    }


}

const renovateToken = async (req = request, res = response) => {
    
    const user = req.user;

    //Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
        user,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovateToken
};
