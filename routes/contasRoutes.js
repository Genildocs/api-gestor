const express = require('express');
const contaController = require('../controllers/contaController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/')
  .post(authenticate, contaController.createConta)
  .get(contaController.getContas);

router.get('/acumulado-mensal', contaController.getAcumuladoMensal);
router.get('/mensais', contaController.getContasMensais);

router.route('/:id');

module.exports = router;
