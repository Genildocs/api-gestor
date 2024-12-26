const Conta = require('../models/contaModel');
const User = require('../models/userModel');

exports.createConta = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findById(body.userId)
    const conta = new Conta({
      descricao: body.descricao,
      valor: body.valor,
      status: body.status,
      user: user._id
    });
    const saveConta = await conta.save()
    user.contas = user.contas.concat(saveConta)
    await user.save();
    res.status(201).json({ message: 'Conta criada com sucesso', conta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar conta' });
  }
};
