const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const secretKey = process.env.SECRET_KEY;

// Controlador para obter todos os usuários

exports.createUser = async (req, res) => {
  try {
    const uid = crypto.randomUUID();
    const { username, email, password } = req.body;
    //valida se o email ja é registrado
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const newUser = new User({ username, email, password, uid });
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

    res.status(200).json({
      status: {
        message: 'Login realizado com sucesso',
        username: user.username,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
};

exports.protectedRoute = async (req, res, next) => {
  //verificar se o token existe
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(res.status(401).json({ message: 'Acesso não autorizado.' }));
  }
  //verificar se o token é valido
  const decoded = await promisify(jwt.verify)(token, secretKey);

  //verificar se o usuário existe
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(res.status(401).json({ message: 'Usuário nao encontrado.' }));
  }
  //check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(res.status(401).json({ message: 'Token expirado.' }));
  }
  next();
};
