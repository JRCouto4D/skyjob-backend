import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Company from '../models/Company';
import File from '../models/File';
import authConfig from '../../config/auth';
import Contract from '../models/Contract';

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

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'description', 'access'],
          include: [
            {
              model: Contract,
              as: 'contract',
              attributes: ['id', 'start_date', 'end_date', 'status'],
            },
          ],
        },
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não registrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name, company, access_level, avatar } = user;

    if (!company.access) {
      return res.status(401).json({ error: 'Acesso negado para esta empresa' });
    }

    return res.json({
      user: {
        id,
        name,
        access_level,
        company,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
