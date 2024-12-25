const express = require('express');
const contaController = require('../controllers/contaController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, contaController.createConta);

module.exports = router;
