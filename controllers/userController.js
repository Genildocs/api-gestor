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
    //valida se o users ja existe
    const existingUser = await User.findOne({ user });
    //valida se o email ja é registrado
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
    console.error(error);
    res.status(500).json({ message: `Erro: ${error.message}` });
  }
};

//login do usuario
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || (await user.isValidPassword(password))) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};
