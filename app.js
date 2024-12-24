require('dotenv').config();
const express = require('express');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors = require('cors');

//Middleware
app.use(cors());
app.use(express.json());

connectDb();

app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
