const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const contaSchema = new mongoose.Schema({
  id:{Type: String},
  nome: { type: String, required: true },
  descricao: { type: String },
  valor: { type: Number, required: true },
  status: { type: String, enum: ['pendente', 'pago'], default: 'pendente' },
  vencimento: { type: Date, required: true },
  tipo: { type: String, enum: ['pagar', 'receber'], required: true },
  formaDePagamento: {
    type: String,
    enum: ['dinheiro', 'debito', 'credito', 'pix'],
  },
  tipoDePagamento: { type: String, enum: ['parcelado', 'unica'] },
  parcelas: { type: Number },
  criadoEm: {
    type: Date,
    default: Date.now(),
  },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Conta = mongoose.model('Conta', contaSchema, 'contas');

module.exports = Conta;
