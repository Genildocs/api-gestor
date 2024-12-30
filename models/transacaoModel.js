const mongoose = require('mongoose');

const transacaoSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['entrada', 'saida'], required: true },
  data: { type: Date, required: true },
  categoria: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  criadoEm: { type: Date, default: Date.now },
});

const Transacao = mongoose.model('Transacao', transacaoSchema, 'transacoes');

module.exports = Transacao;
