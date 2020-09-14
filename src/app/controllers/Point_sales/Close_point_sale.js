import Point from '../../models/Point_sale';
import User from '../../models/User';

class Close_point_sale {
  async update(req, res) {
    const { point_sale_id } = req.params;

    const user = await User.findByPk(req.companyId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const point = await Point.findByPk(point_sale_id);

    if (!point) {
      return res.status(401).json({ error: 'Ponto de venda não encontrado' });
    }

    if (user.access_lavel <= 1) {
      if (point.user_id !== user.id) {
        return res.status(401).json({ error: 'Operação não encontrada' });
      }
    }

    point.closed_at = new Date();
    point.final_value = Number(point.initial_value) + Number(point.flow_value);
    point.active = false;

    const newDataPoint = await point.save();

    return res.json(newDataPoint);
  }
}

export default new Close_point_sale();
