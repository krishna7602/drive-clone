const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Storage for uploaded files
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Array to store file paths for simplicity (use DB in production)
let uploadedFiles = [];

// Register Page Route
router.get('/register', (req, res) => {
    res.render('register');
});

// Register User
router.post('/register',
    body('email').trim().isEmail().withMessage('Enter a valid email'),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data',
                });
            }

            const { email, username, password } = req.body;
            await userModel.create({ email, username, password });
            res.render('login');
        } catch (error) {
            console.error('Error during registration:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Login Page Route
router.get('/login', (req, res) => {
    res.render('login');
});

// Login User
router.post('/login',
    body('password').trim().isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), message: 'Invalid data' });
            }

            const { username, password } = req.body;
            const user = await userModel.findOne({ username });
            if (!user || user.password !== password) {
                return res.status(400).json({ message: 'Username or password is incorrect' });
            }

            const token = jwt.sign({ userId: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token);
            res.redirect('/home');
        } catch (error) {
            console.error('Error during login:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

// Home Page Route
router.get('/home', (req, res) => {
    res.render('home', { files: uploadedFiles });
});

// File Upload Route
router.post('/upload-file', upload.single('file'), (req, res) => {
    if (req.file) {
        const filePath = `/uploads/${req.file.filename}`;
        uploadedFiles.push(filePath);
    }
    res.redirect('/home');
});

module.exports = router;
