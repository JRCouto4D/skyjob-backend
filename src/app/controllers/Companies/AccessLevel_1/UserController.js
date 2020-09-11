import * as Yup from 'yup';
import User from '../../../models/User';
// import Company from '../../models/Company';

class UserController {
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
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const user = await User.findByPk(req.companyId);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    if (user.access_level > 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { email, oldPassword } = req.body;

    if (email && email !== user.email) {
      const checkEmail = await User.findOne({ where: { email } });

      if (checkEmail) {
        return res.status(400).json({ error: 'Este email já está em uso.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const newDataUser = await user.update(req.body);

    return res.json(newDataUser);
  }
}

export default new UserController();
