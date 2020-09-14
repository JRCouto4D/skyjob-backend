import * as Yup from 'yup';
import Bleed from '../../../models/Bleed';
import User from '../../../models/User';
import Point from '../../../models/Point_sale';

class BleedController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cash_value: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level <= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
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

    const bleed = await Bleed.create(data);

    if (bleed.id) {
      point_sale.flow_value =
        Number(point_sale.flow_value) - req.body.cash_value;

      await point_sale.save();
    }

    return res.json(bleed);
  }
}

export default new BleedController();
