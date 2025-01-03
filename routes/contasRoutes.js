const express = require('express');
const contaController = require('../controllers/contaController');
const authController = require('../controllers/authController');
const router = express.Router();

router
  .route('/')
  .post(authController.protectedRoute, contaController.createConta)
  .get(authController.protectedRoute, contaController.getContas);

router.get(
  '/acumulado-mensal',
  authController.protectedRoute,
  contaController.getAcumuladoMensal
);
router.get(
  '/mensais',
  authController.protectedRoute,
  contaController.getContasMensais
);

router
  .route('/:id')
  .delete(authController.protectedRoute, contaController.deleteConta)
  .put(authController.protectedRoute, contaController.updateConta);

module.exports = router;
