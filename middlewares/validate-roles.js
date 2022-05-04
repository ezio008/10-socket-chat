const { request, response } = require("express");


const isAdminRole = (req = request, res = response, next) => {

    if(!req.user) {
        return res.status(500).json({
            msg: 'Se quiere validar el rol sin validar el token'
        });
    }

    const {role, name} = req.user;

    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:`${name} no es administrador`
        });
    }

    next();
}

const haveRole = ( ...roles ) => {

    return (req = request, res = response, next) => {
        if(!req.user) {
            return res.status(500).json({
                msg: 'Se quiere validar el rol sin validar el token'
            });
        }
    
        const {role} = req.user;

        if(!roles.includes(role)) {
            return res.status(401).json({
                msg:`El servicio require uno de estos ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    haveRole
}
