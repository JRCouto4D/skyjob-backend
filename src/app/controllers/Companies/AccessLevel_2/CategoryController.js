import * as Yup from 'yup';
import { Op } from 'sequelize';
import Category from '../../../models/Category';
import User from '../../../models/User';

class CategoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      active: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(400).json({ error: 'Opereção não encontrada' });
    }

    const data = { company_id: req.params.company_id, ...req.body };
    const category = await Category.create(data);

    return res.json(category);
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
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(400).json({ error: 'Opereção não encontrada' });
    }

    const { category_id } = req.params;

    const category = await Category.findByPk(category_id);

    if (!category) {
      return res.status(401).json({ error: 'Categoria não encontrada' });
    }

    const newDataCategory = await category.update(req.body);

    return res.json(newDataCategory);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(400).json({ error: 'Opereção não encontrada' });
    }

    const { category_id } = req.params;

    await Category.destroy({
      where: {
        id: category_id,
      },
    });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Category.count({
      where: {
        company_id,
      },
    });

    const categories = await Category.findAll({
      where: {
        company_id,
      },
    });

    return res.json({ categories, total });
  }

  async show(req, res) {
    const { company_id } = req.params;
    const { page = 1, name = '' } = req.query;

    const total = await Category.count({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const categories = await Category.findAll({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
    });

    return res.json({ categories, total });
  }
}

export default new CategoryController();
