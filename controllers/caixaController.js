const Caixa = require('../models/caixaModel');
const User = require('../models/userModel');

exports.createCaixa = async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;

    const caixa = new Caixa({ ...body, user: user._id });
    const saveCaixa = await caixa.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { caixas: saveCaixa._id },
    });

    res.status(201).json({
      message: 'Caixa criada com sucesso',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao criar caixa' });
  }
};
