const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/', authController.protectedRoute, userController.getUsers);

module.exports = router;
