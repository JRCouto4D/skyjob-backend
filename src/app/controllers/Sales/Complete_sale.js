import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Pdv from '../../models/Point_sale';

class Complete_sale {
  async update(req, res) {
    const schema = Yup.object().shape({
      payment: Yup.number().required(),
      installments: Yup.number().when('payment', (payment, field) =>
        payment === 2 ? field.required() : field
      ),
      customer_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const { sale_id } = req.params;

    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.complete_at !== null) {
      return res.status(401).json({ error: 'Esta venda já foi completa' });
    }

    const data = { ...req.body, complete_at: new Date() };

    const completedSale = await sale.update(data);

    if (completedSale.id) {
      const pdv = await Pdv.findByPk(completedSale.point_sale_id);

      if (!pdv) {
        return res.status(401).json({ error: 'PDV não encontrado.' });
      }

      pdv.flow_value = Number(pdv.flow_value) + completedSale.total;

      pdv.save();
    }

    return res.json(completedSale);
  }
}

export default new Complete_sale();
