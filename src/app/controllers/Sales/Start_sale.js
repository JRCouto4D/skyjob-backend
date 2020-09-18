import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Point from '../../models/Point_sale';

class Start_sale {
  async store(req, res) {
    const schema = Yup.object().shape({
      type_sale: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const { point_sale_id } = req.params;

    const point_sale = await Point.findByPk(point_sale_id);

    if (!point_sale) {
      return res.status(401).json({ error: 'Ponto de venda não encontrado' });
    }

    if (!point_sale.active) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const checkSale = await Sale.findAll({
      where: {
        point_sale_id,
        complete_at: null,
      },
    });

    if (checkSale.length >= 1) {
      return res
        .status(401)
        .json({ error: 'Este ponto de venda tem uma operação inacabada' });
    }

    const data = { point_sale_id: point_sale.id, ...req.body };

    const sale = await Sale.create(data);

    return res.json(sale);
  }
}

export default new Start_sale();
