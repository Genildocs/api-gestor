const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    //Eventos para monitorar o estado da conexão
    mongoose.connection.on('connected', () => {
      console.log(`Mongoose conectado ao banco de dados`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Erro no Mongoose: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose desconectado do banco de dados');
    });
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); // Encerra a aplicação caso a conexão falhe
  }
};

module.exports = connectDB;
