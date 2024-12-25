const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secretKey = process.env.SECRET_KEY;

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
    const { username, email, password } = req.body;
    //valida se o users ja existe
    const existingUser = await User.findOne({ username });
    //valida se o email ja é registrado
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    if (existingEmail) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const newUser = new User({ username, email, password });
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
    //Validação de senha
    const passwordMatch =
      user === null ? false : await bcrypt.compare(password, user.password);
    if (!(user && passwordMatch)) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    // Gera o token JWT
    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
      expiresIn: '1h',
    });

    res
      .status(200)
      .json({ message: 'Login realizado com sucesso', token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};
