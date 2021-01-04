import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import Company from '../../models/Company';
import File from '../../models/File';
import authConfig from '../../../config/auth';

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

    const company = await Company.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!company) {
      return res.status(401).json({ error: 'Usuário não registrado' });
    }

    if (!company.admin) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    if (!(await company.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    if (!company.access) {
      return res.status(401).json({ error: 'Acesso negado para esta empresa' });
    }

    return res.json({
      user: company,
      token: jwt.sign({ id: company.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
