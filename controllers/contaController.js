const Conta = require('../models/contaModel');
const User = require('../models/userModel');

exports.createConta = async (req, res) => {
  // try {
  //   const body = req.body;
  //   const user = await User.findById(body.userId);
  //   const conta = new Conta({
  //     nome: body.nome,
  //     valor: body.valor,
  //     vencimento: body.vencimento,
  //     tipo: body.tipo,
  //     user: user._id,
  //   });
  //   const saveConta = await conta.save();
  //   user.contas = user.contas.concat(saveConta);
  //   await user.save();
  //   res.status(201).json({ message: 'Conta criada com sucesso', conta });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: 'Erro ao criar conta' });
  // }
  try {
    const { descricao, valor, tipo } = req.body;

    // Cria a nova conta
    const novaConta = await Conta.create({
      descricao,
      valor,
      tipo,
      userId: req.userId, // Associa ao usuário logado
    });

    // Atualiza a lista de contas do usuário
    await User.findByIdAndUpdate(req.userId, {
      $push: { contas: novaConta._id },
    });

    res.status(201).json(novaConta);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
};

exports.getContas = async (req, res) => {
  try {
    //filtro
    const queryObject = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    //filtros avançados
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Conta.find(JSON.parse(queryStr));

    //fields limits
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const contas = await query;
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
