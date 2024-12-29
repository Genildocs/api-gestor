const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.createUser); // Rotas para criar usuarios
router.post('/login', authController.loginUser); // Rotas para logar usuarios
module.exports = router;
