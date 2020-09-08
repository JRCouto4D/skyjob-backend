import * as Yup from 'yup';
import Company from '../models/Company';

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
}

export default new CompanyControllers();
