const Caixa = require('../models/caixaModel');
const User = require('../models/userModel');

exports.createCaixa = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    const transacao = new Caixa({ ...body, user: user._id });
    const saveTransacao = await transacao.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { transacao: saveTransacao._id },
    });

    res.status(201).json({
      message: 'Transação criada com sucesso',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao criar transação' });
  }
};
