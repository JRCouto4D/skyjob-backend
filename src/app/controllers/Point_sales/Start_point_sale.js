import * as Yup from 'yup';
import Point from '../../models/Point_sale';
import User from '../../models/User';
import Cash from '../../models/Cash_register';

class Start_point_sale {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_id: Yup.number().required(),
      cash_register_id: Yup.number().required(),
      initial_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const { user_id, cash_register_id } = req.body;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const cash = await Cash.findByPk(cash_register_id);

    if (!cash) {
      return res
        .status(401)
        .json({ error: 'Caixa registradora não encontrada' });
    }

    if (user.company_id !== cash.company_id) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const checkUser = await Point.findAll({
      where: {
        user_id,
        active: true,
      },
    });

    if (checkUser.length >= 1) {
      return res
        .status(401)
        .json({ error: 'Este usuário já está operando um ponto de venda' });
    }

    const checkCash = await Point.findAll({
      where: {
        cash_register_id,
        active: true,
      },
    });

    if (checkCash.length >= 1) {
      return res.status(401).json({
        error: 'Este caixa já está operando em um outro ponto de venda',
      });
    }

    const point_sale = await Point.create(req.body);

    return res.json(point_sale);
  }
}

export default new Start_point_sale();
