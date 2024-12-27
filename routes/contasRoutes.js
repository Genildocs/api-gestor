const express = require('express');
const contaController = require('../controllers/contaController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, contaController.createConta);
router.get('/', contaController.getContas);
router.get('/acumulado-mensal', contaController.getAcumuladoMensal);
router.get('/mensais', contaController.getContasMensais);

module.exports = router;
