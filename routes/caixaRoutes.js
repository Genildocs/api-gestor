const express = require('express');
const caixaController = require('../controllers/caixaController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .post(authController.protectedRoute, caixaController.createCaixa);

module.exports = router;
