const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers); //Rotas para listar usuarios
router.post('/', userController.createUser); // Rotas para criar usuarios
router.post('/login', userController.loginUser); // Rotas para logar usuarios
module.exports = router;
