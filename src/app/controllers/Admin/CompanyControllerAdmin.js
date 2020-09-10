import * as Yup from 'yup';
import Company from '../../models/Company';
import File from '../../models/File';

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

    await company.destroy();

    return res.send();
  }

  async index(req, res) {
    const { pages = 1 } = req.query;
    const total = await Company.count();

    const company = await Company.findAll({
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
      limit: 6,
      offset: (pages - 1) * 6,
      order: ['description'],
    });

    return res.json({ company, total });
  }
}

export default new CompanyControllers();
