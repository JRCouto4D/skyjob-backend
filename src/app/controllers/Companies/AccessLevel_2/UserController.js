import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../../../models/User';
import File from '../../../models/File';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      access_level: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const user = await User.findByPk(req.companyId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { email } = req.body;

    const checkEmail = await User.findOne({
      where: {
        company_id: user.company_id,
        email,
      },
    });

    if (checkEmail) {
      return res.status(401).json({ error: 'Este email já está em uso' });
    }

    const data = { ...req.body, company_id: user.company_id };

    const newUser = await User.create(data);

    return res.json(newUser);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      access_level: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const { email } = req.body;
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (email && email !== user.email) {
      const checkEmail = await User.findOne({
        where: {
          company_id: user.company_id,
          email,
        },
      });

      if (checkEmail) {
        return res.status(401).json({ error: 'Este email já está em uso' });
      }
    }

    const newDataUser = await user.update(req.body);

    return res.json(newDataUser);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { user_id } = req.params;

    await User.destroy({ where: { id: user_id } });

    return res.send();
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const { company_id } = req.params;

    const total = await User.count();

    const users = await User.findAll({
      where: {
        company_id,
      },
      attributes: ['id', 'name', 'email', 'access_level', 'active'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
    });

    return res.json({ users, total });
  }

  async show(req, res) {
    const { page = 1, name = '' } = req.query;
    const { company_id } = req.params;

    const total = await User.count({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
    });

    const users = await User.findAll({
      where: {
        company_id,
        name: { [Op.iLike]: `${name}%` },
      },
      attributes: ['id', 'name', 'email', 'access_level', 'active'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
    });

    return res.json({ users, total });
  }
}

export default new UserController();
