import * as Yup from 'yup';
import Company from '../models/Company';

class CompanyControllers {
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const company = await Company.findByPk(req.companyId);

    const { email, oldPassword } = req.body;

    if (email && email !== company.email) {
      const checkEmail = await Company.findOne({ where: { email } });

      if (checkEmail) {
        return res.status(400).json({ error: 'Usuário não existe.' });
      }
    }

    if (oldPassword && !(await company.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, description } = await company.update(req.body);

    return res.json({
      id,
      description,
      email,
    });
  }
}

export default new CompanyControllers();
