const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed file types
    },
});

const upload = multer({ storage });

module.exports = upload;
