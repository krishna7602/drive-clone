const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');  // Import Cloudinary config
const upload = multer({ dest: 'uploads/' });  // Temporary storage for the file before uploading to Cloudinary
const router = express.Router();

// GET Route to render the home page
router.get('/home', (req, res) => {
    res.render('home', { fileUrl: null }); // Initially set fileUrl to null
});

// POST Route to handle file upload
router.post('/upload-file', upload.single('file'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        // Upload file to Cloudinary
        const uploadedFile = await cloudinary.uploader.upload(req.file.path);

        // Get the file URL from Cloudinary response
        const fileUrl = uploadedFile.secure_url;

        // Return home page with file URL
        res.render('home', { fileUrl }); // Pass the uploaded file URL to the home page
    } catch (error) {
        console.error("Error uploading file: ", error);
        res.status(500).send("Error uploading file to Cloudinary");
    }
});

module.exports = router;
