const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const validImgExtensions = ['png', 'jpg', 'jpeg', 'gif'];
const validTextExtensions = ['txt', 'md'];
const pathPlaceHolder = path.join(__dirname, '../assets', 'no-image.jpg');

const uploadFile = (file, validExtensions = validImgExtensions, folder = '') => {

    return new Promise((resolve, reject) => {

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file        
        const nameSplit = file.name.split('.');
        const ext = nameSplit[nameSplit.length - 1];        

        if (!validExtensions.includes(ext)) {
            return reject(`La extensiòn .${ext} no esta permitida (${validExtensions})`);
        }

        const nameTemp = uuidv4() + '.' + ext;
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err) => {
            if (err) {
                return reject('Error en el servidor');
            }

            resolve(nameTemp);
        });
    });

}

const checkFileAndDelete = (file, folder = '') => {
    const pathImage = path.join(__dirname, '../uploads', folder, file);
    if(fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

const showFile = (file = '', folder = '') => {
    const pathImage = path.join(__dirname, '../uploads', folder, file);    
    if(file && fs.existsSync(pathImage)) {
        return pathImage;
    } else {
        return pathPlaceHolder;
    }
}

module.exports = {
    checkFileAndDelete,
    showFile,
    uploadFile,
    validImgExtensions,
    validTextExtensions
}