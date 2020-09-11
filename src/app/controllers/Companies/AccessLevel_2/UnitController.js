import * as Yup from 'yup';
import Unit from '../../../models/Unit';
import User from '../../../models/User';

class UnitController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { company_id } = req.params;

    const data = { company_id, ...req.body };
    const unit = await Unit.create(data);

    return res.json(unit);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { unit_id } = req.params;

    const unit = await Unit.findByPk(unit_id);

    if (!unit) {
      return res.status(401).json({ error: 'Unidade não encontrada' });
    }

    await unit.update(req.body);

    return res.json(unit);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { unit_id } = req.params;

    await Unit.destroy({ where: { id: unit_id } });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Unit.count({ where: { company_id } });

    const units = await Unit.findAll({
      where: {
        company_id,
      },
      attributes: ['id', 'name', 'active'],
      order: [['name', 'ASC']],
    });

    return res.json({ units, total });
  }
}

export default new UnitController();
