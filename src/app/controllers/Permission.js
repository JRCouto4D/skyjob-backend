import User from '../models/User';

class Permission {
  async index(req, res) {
    const { company_id } = req.query;

    const users = await User.findAll({
      where: {
        company_id,
        access_level: 2,
      },
    });

    return res.json(users);
  }

  async show(req, res) {
    const { user_id, password } = req.query;

    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    return res.send();
  }
}

export default new Permission();
