const mongoose = require('mongoose');

const contaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, enum: ['pendente', 'pago'], default: 'pendente' },
    tipo: { type: String, enum: ['a pagar', 'a receber'], required: true },
  },
  { timestamps: true }
);

const Conta = mongoose.model('Conta', contaSchema, 'contas');

module.exports = Conta;
