const Conta = require('../models/contaModel');

exports.createConta = async (req, res) => {
  try {
    const { descricao, valor, status } = req.body;

    const conta = new Conta({
      descricao,
      valor,
      status,
      usuario: req.user,
    });
    await conta.save();
    res.status(201).json({ message: 'Conta criada com sucesso', conta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar conta' });
  }
};
