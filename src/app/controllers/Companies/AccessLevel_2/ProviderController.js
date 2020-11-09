import * as Yup from 'yup';
import { Op } from 'sequelize';
import Provider from '../../../models/Provider';
import User from '../../../models/User';

class ProviderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      representative: Yup.string(),
      email: Yup.string().email(),
      telephone: Yup.string(),
      cell_phone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level && checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { company_id } = req.params;

    const data = { company_id, ...req.body };

    const provider = await Provider.create(data);

    return res.json(provider);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      representative: Yup.string(),
      email: Yup.string().email(),
      telephone: Yup.string(),
      cell_phone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { provider_id } = req.params;

    const provider = await Provider.findByPk(provider_id);

    if (!provider) {
      return res.status(401).json({ error: 'Fornecedor não encontrado' });
    }

    const newDataProvider = await provider.update(req.body);

    return res.json(newDataProvider);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { provider_id } = req.params;

    await Provider.destroy({ where: { id: provider_id } });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Provider.count({
      where: {
        company_id,
      },
    });

    const providers = await Provider.findAll({
      where: {
        company_id,
      },
      attributes: [
        'id',
        'name',
        'representative',
        'email',
        'telephone',
        'cell_phone',
        'active',
      ],
    });

    return res.json({ providers, total });
  }

  async show(req, res) {
    const { page = 1, name = '' } = req.query;
    const { company_id } = req.params;

    const total = await Provider.count({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const providers = await Provider.findAll({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
      attributes: [
        'id',
        'name',
        'representative',
        'email',
        'telephone',
        'cell_phone',
        'active',
      ],
      limit: 5,
      offset: (page - 1) * 5,
      order: [['name', 'ASC']],
    });

    return res.json({ providers, total });
  }
}

export default new ProviderController();
