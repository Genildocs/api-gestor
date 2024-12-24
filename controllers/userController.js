const User = require('../models/userModel');

// Controlador para obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ usersList: users });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { user, email, password } = req.body;
    //valida se o email ja existe
    const existingUser = await User.findOne({ user });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    if (existingEmail) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const newUser = new User({ user, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};
