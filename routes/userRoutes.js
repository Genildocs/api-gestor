const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authenticate, userController.getUsers);

module.exports = router;