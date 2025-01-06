const mongoose = require('mongoose');
const validator = require('validator');

const caixaSchema = new mongoose.Schema({
  transaction_id: { type: String, unique: true, required: true },
  type: { type: String, enum: ['entrada', 'saída'], required: true },
  description: { type: String },
  valor: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: 'O valor deve ser positivo.',
    },
  },
  category: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ['dinheiro', 'cartão de crédito', 'transferência bancária', 'pix'],
    required: true,
  },
  type_of_payment: {
    type: String,
    enum: ['parcelado', 'unica'],
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pendente', 'pago', 'cancelado'],
    required: true,
    default: 'pendente',
  },
  notes: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Caixa = mongoose.model('Caixa', caixaSchema, 'caixas');

module.exports = Caixa;
