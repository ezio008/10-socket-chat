const { response, request } = require("express");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile, validTextExtensions, validImgExtensions, checkFileAndDelete, showFile } = require('../helpers');
const { Product, User } = require('../models');

const postFile = async (req = request, res = response) => {

    await uploadFile(req.files.file, undefined, 'img')
        .then((name) => {
            res.json({
                name
            });
        })
        .catch((err) => res.status(400).json({ msg: err }));

}

const postImg = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no validada' });
    }

    // Limpiar imagenes previas
    try {
        if (model.img) {
            checkFileAndDelete(model.img, collection);
        }
    } catch (err) {
        return res.status(500).json({
            msg: 'fallo en el servidor',
            err
        });
    }

    await uploadFile(req.files.file, undefined, collection)
        .then(async (name) => {
            model.img = name;
            await model.save();
            res.json({
                model
            });
        })
        .catch((err) => res.status(400).json({ msg: err }));

}

const postImgCloudinary = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no validada' });
    }

    // Limpiar imagenes previas
    try {
        if (model.img) {
            const nameSplit = model.img.split('/');
            const name = nameSplit[nameSplit.length - 1];
            const [ public_id ] = name.split('.');
            cloudinary.uploader.destroy(public_id);
        }
    } catch (err) {
        return res.status(500).json({
            msg: 'fallo en el servidor',
            err
        });
    }

    // subir imagen a claudinary
    const { tempFilePath } = req.files.file;
    cloudinary.uploader.upload(tempFilePath)
        .then(async (result) => {
            model.img = result.secure_url;
            await model.save();
            res.json({
                model
            });
        }).catch(err => {
            res.status(500).json({ msg: 'fallo en el servicio de cloudinary', err });
        });
}

const getImage = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Coleccion no validada' });
    }

    const img = showFile(model.img, collection);

    res.sendFile(img);

}

module.exports = {
    getImage,
    postFile,
    postImg,
    postImgCloudinary
}