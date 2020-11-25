import * as Yup from 'yup';
import Reinforcement from '../../../models/Reinforcement';
import User from '../../../models/User';
import Point from '../../../models/Point_sale';

class ReinforcementController {
  async store(req, res) {
    const schema = Yup.object().shape({
      point_sale_id: Yup.number().required(),
      cash_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const { point_sale_id } = req.body;

    const point_sale = await Point.findByPk(point_sale_id);

    if (!point_sale) {
      return res.status(401).json({ error: 'Ponto de venda não disponível' });
    }

    if (!point_sale.active) {
      return res.status(401).json({ error: 'Ponto de venda desativado' });
    }

    const data = {
      user_id: req.companyId,
      point_sale_id: point_sale.id,
      ...req.body,
    };

    const reinforcement = await Reinforcement.create(data);

    if (reinforcement.id) {
      point_sale.flow_value =
        Number(point_sale.flow_value) + Number(req.body.cash_value);

      await point_sale.save();
    }

    return res.json(reinforcement);
  }
}

export default new ReinforcementController();
