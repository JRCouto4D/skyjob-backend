import * as Yup from 'yup';
import Cash_register from '../../../models/Cash_register';
import User from '../../../models/User';

class CashController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { company_id } = req.params;
    const data = { company_id, ...req.body };

    const cash_register = await Cash_register.create(data);

    return res.json(cash_register);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { cash_register_id } = req.params;

    const cash_register = await Cash_register.findByPk(cash_register_id);

    if (!cash_register) {
      return res
        .status(401)
        .json({ error: 'Caixa registradora não encontrada' });
    }

    const newDataCash = await cash_register.update(req.body);

    return res.json(newDataCash);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { cash_register_id } = req.params;

    await Cash_register.destroy({ where: { id: cash_register_id } });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Cash_register.count({
      where: {
        company_id,
      },
    });

    const cash_registers = await Cash_register.findAll({
      where: {
        company_id,
      },
    });

    return res.json({ cash_registers, total });
  }
}

export default new CashController();
