const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authController.getAllUsers); //Rotas para listar usuarios
router.post('/register', authController.createUser); // Rotas para criar usuarios
router.post('/login', authController.loginUser); // Rotas para logar usuarios
module.exports = router;
