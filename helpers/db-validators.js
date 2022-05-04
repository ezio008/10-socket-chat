const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const validateRole = async (role = '') => {
    const existRole = await Role.findOne({ role });
    if (!existRole) {
        throw new Error(`El rol ${role} no esta registrado en la BD`);
    }
}

const validateExistEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya existe`);
    }
}

const validateNotExistEmail = async (email = '') => {
    const existeEmail = await User.findOne({ email });

    if (!existeEmail) {
        throw new Error(`El correo ${email} no existe`);
    }
}

const validateIdExist = async (id) => {
    const idExist = await User.findById(id);

    if (!idExist) {
        throw new Error(`No existe el id ${id}`);
    }
}

const validateUserActive = async (email) => {
    const existeEmail = await User.findOne({ email });

    if (!existeEmail.state) {
        throw new Error(`El usuario con correo ${email} esta deshabilitado`);
    }
}

const validateCategoryExist = async (id) => {
    const category = await Category.findById(id);

    if (!category) {
        throw new Error(`La categoria con id ${id} no existe`);
    }
}

const validateCategoryNameExist = async (name) => {
    const category = await Category.findOne({ name: name.toUpperCase() });

    if (category) {
        throw new Error(`Ya existe una categoria con el nombre ${name}`);
    }
}

const validateProductExist = async (id) => {
    const product = await Product.findById(id);

    if (!product) {
        throw new Error(`El producto con id ${id} no existe`);
    }
}

const validateProductNameExist = async (name) => {
    const product = await Product.findOne({ name: name });

    if (product) {
        throw new Error(`Ya existe un producto con el nombre ${name}`);
    }
}

const validateCollections = (collection = '', collections = []) => {
    if(!collections.includes(collection)) {
        throw new Error(`La colección ${collection} no es permitida (${collections})`);
    }

    return true;
} 

module.exports = {
    validateRole,
    validateEmail: validateExistEmail,
    validateIdExist,
    validateNotExistEmail,
    validateUserActive,
    validateCategoryExist,
    validateCategoryNameExist,
    validateProductExist,
    validateProductNameExist,
    validateCollections
};