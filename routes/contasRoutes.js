const express = require('express');
const contaController = require('../controllers/contaController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .post(authController.protectedRoute, contaController.createConta)
  .get(authController.protectedRoute, contaController.getContas);

router.get('/acumulado-mensal', contaController.getAcumuladoMensal);
router.get('/mensais', contaController.getContasMensais);

router
  .route('/:id')
  .delete(authController.protectedRoute, contaController.deleteConta);

module.exports = router;
