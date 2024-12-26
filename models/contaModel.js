const mongoose = require('mongoose');

const contaSchema = new mongoose.Schema(
  {
    descricao: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, enum: ['pendente', 'pago'], default: 'pendente' },
  },
  { timestamps: true }
);

const Conta = mongoose.model('Conta', contaSchema, 'contas');

module.exports = Conta;
