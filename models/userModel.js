const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  uid: { type: String },
  nome: { type: String },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Por favor, insira um email valido'],
  },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  contas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conta',
    },
  ],
  transacao: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Caixa',
    },
  ],
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  //condição caso a senha nao seja alterada
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Middleware para verificar se a senha esta correta
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware para verificar se a senha foi alterada
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
