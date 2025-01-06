require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const contasRoutes = require('./routes/contasRoutes');
const userRoutes = require('./routes/userRoutes');
const caixaRoutes = require('./routes/caixaRoutes');
const app = express();
const cors = require('cors');

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/contas', contasRoutes);
app.use('/api/v1/caixas', caixaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
