import * as Yup from 'yup';
import { Op } from 'sequelize';
import Company from '../../models/Company';
import User from '../../models/User';
import File from '../../models/File';
import Contract from '../../models/Contract';

class CompanyControllers {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkCompany = await Company.findByPk(req.companyId);

    if (!checkCompany.admin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { email } = req.body;

    const checkEmail = await Company.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res
        .status(400)
        .json({ error: 'Este email já está sendo usado em nosso sistema' });
    }

    const company = await Company.create(req.body);

    if (company.id) {
      await User.create({
        company_id: company.id,
        name: 'admin',
        email: company.email,
        password: req.body.password,
        access_level: 2,
      });
    }

    return res.json(company);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const checkAdmin = await Company.findByPk(req.companyId);

    if (!checkAdmin.admin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { company_id } = req.params;

    const company = await Company.findByPk(company_id);

    if (!company) {
      return res.statues(400).json({ error: 'Empresa não encontrada' });
    }

    const { email } = req.body;

    if (email && company.email !== email) {
      const checkEmail = await Company.findOne({
        where: {
          email,
        },
      });

      if (checkEmail) {
        return res
          .status(400)
          .json({ error: 'Este email já está sendo usado em nosso sistema' });
      }
    }

    const newDataCompany = await company.update(req.body);

    return res.json(newDataCompany);
  }

  async delete(req, res) {
    const { company_id } = req.params;

    const company = await Company.findByPk(company_id);

    if (!company) {
      return res.status(401).json({ error: 'Empresa não encontrada' });
    }

    await User.destroy({ where: { company_id } });

    if (company.avatar_id) {
      await File.destroy({ where: { id: company.avatar_id } });
    }

    await company.destroy();

    return res.send();
  }

  async index(req, res) {
    const { search = '' } = req.query;

    const company = await Company.findAll({
      where: {
        description: { [Op.iLike]: `${search}%` },
        admin: false,
        access: false,
      },
      attributes: [
        'id',
        'description',
        'email',
        'access',
        'admin',
        'created_at',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: ['description'],
    });

    return res.json(company);
  }

  async show(req, res) {
    const { page = 1, search = '' } = req.query;

    const total = await Company.count({
      where: {
        description: { [Op.iLike]: `${search}%` },
        admin: false,
      },
    });

    const companies = await Company.findAll({
      where: {
        description: { [Op.iLike]: `${search}%` },
        admin: false,
      },
      attributes: ['id', 'description', 'email', 'access'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'start_date', 'end_date', 'status'],
        },
      ],
      limit: 5,
      offset: (page - 1) * 5,
      order: [['description', 'ASC']],
    });

    return res.json({
      companies,
      total,
    });
  }
}

export default new CompanyControllers();
