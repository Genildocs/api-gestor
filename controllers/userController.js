const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('contas');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};
