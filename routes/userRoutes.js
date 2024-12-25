const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, userController.getAllUsers); //Rotas para listar usuarios
router.post('/register', userController.createUser); // Rotas para criar usuarios
router.post('/login', userController.loginUser); // Rotas para logar usuarios
module.exports = router;
