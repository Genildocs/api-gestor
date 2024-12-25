const jwt = require('jsonwebtoken');

const secreteKey = process.env.SECRET_KEY;

// Middleware para proteger rotas
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado.' });
  }

  try {
    const decoded = jwt.verify(token, secreteKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
