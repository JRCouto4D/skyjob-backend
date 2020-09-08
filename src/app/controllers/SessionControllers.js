import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Company from '../models/Company';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, password } = req.body;

    const company = await Company.findOne({ where: { email } });

    if (!company) {
      return res.status(401).json({ error: 'Usuário não registrado' });
    }

    if (!(await company.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, description, access } = company;

    if (!access) {
      return res.status(401).json({ error: 'Acesso negado para esta empresa' });
    }

    return res.json({
      user: {
        id,
        description,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
