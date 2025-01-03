const Conta = require('../models/contaModel');
const User = require('../models/userModel');
const { DateTime } = require('luxon');
exports.createConta = async (req, res) => {
  try {
    const { id, nome, valor, vencimento, tipo, descricao } = req.body;
    const user = req.user;
    // Cria a nova conta
    const conta = new Conta({
      id,
      nome,
      valor,
      vencimento,
      tipo,
      descricao,
      user: user._id,
    });

    const novaConta = await conta.save();
    // Atualiza a lista de contas do usuário
    await User.findByIdAndUpdate(user._id, {
      $push: { contas: novaConta._id },
    });

    res.status(201).json({
      message: 'Conta criada com sucesso',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
};

exports.getContas = async (req, res) => {
  try {
    //filtro

    const user = req.user;
    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    //filtros avançados
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Conta.find({ ...JSON.parse(queryStr), user: user.id });

    //fields limits
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Ajusta o fuso horário para São Paulo
    const contasComFusoHorario = await query;

    const contas = contasComFusoHorario.map((conta) => ({
      //transforma o documento em DOCUMENTO
      ...conta.toObject(),
      criadoEm: DateTime.fromJSDate(conta.criadoEm)
        .setZone('America/Sao_Paulo')
        .toISO(),
    }));

    res.status(200).json({ status: 'success', contas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Erro ao buscar contas' });
  }
};

// Função para obter o acumulado de contas no mês atual
exports.getAcumuladoMensal = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Datas passadas como query params
    //na requisição: ?startDate=2024-12-01&endDate=2024-12-31 adicionar ao final do endpoint

    // Validação de datas
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: 'Por favor, forneça startDate e endDate.' });
    }

    // Consulta agregada no MongoDB
    const acumulado = await Conta.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate), // Data inicial
            $lte: new Date(endDate), // Data final
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$valor' },
        },
      },
    ]);

    // Resposta com o total acumulado
    return res.status(200).json({ total: acumulado[0]?.total || 0 });
  } catch (error) {
    // Tratamento de erro
    return res.status(500).json({ error: error.message });
  }
};

exports.getContasMensais = async (req, res) => {
  try {
    const { year, month } = req.query; // Ano e mês fornecidos como parâmetros de consulta
    //na requisição: ?year=2024&month=12 adicionar no final do endpoint

    // Validação de parâmetros
    if (!year || !month) {
      return res
        .status(400)
        .json({ error: 'Por favor, forneça o ano (year) e o mês (month).' });
    }

    // Criação do intervalo de datas
    const startDate = new Date(year, month - 1, 1); // Primeiro dia do mês
    const endDate = new Date(year, month, 0, 23, 59, 59); // Último dia do mês

    // Busca de contas no intervalo
    const contas = await Conta.find({
      createdAt: {
        $gte: startDate, // Data inicial
        $lte: endDate, // Data final
      },
    });

    // Resposta com as contas encontradas
    return res.status(200).json({ contas });
  } catch (error) {
    // Tratamento de erro
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteConta = async (req, res) => {
  try {
    const conta = await Conta.findByIdAndDelete(req.params.id);
    const user = await User.findById(req.user);
    await User.findByIdAndUpdate(user._id, {
      $pull: { contas: conta._id },
    });
    res.status(200).json(conta);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar conta' });
  }
};

exports.updateConta = async (req, res) => {
  try {
    const conta = await Conta.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: 'Conta atualizada com sucesso',
      conta,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar conta' });
    console.log(error);
  }
};
