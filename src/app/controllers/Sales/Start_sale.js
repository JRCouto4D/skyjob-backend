import * as Yup from 'yup';
import Sale from '../../models/Sale';
import Point from '../../models/Point_sale';
import Customer from '../../models/Customer';

class Start_sale {
  async store(req, res) {
    const schema = Yup.object().shape({
      type_sale: Yup.number().required(),
      customer_id: Yup.number().when('type_sale', (type_sale, field) =>
        type_sale === 2 ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const { point_sale_id } = req.params;
    const { type_sale, customer_id } = req.body;

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

    if (type_sale === 2) {
      const checkCustomer = await Customer.findByPk(customer_id);

      if (!checkCustomer) {
        return res.status(401).json({ error: 'Cliente não encontrado' });
      }

      if (!checkCustomer.wholesale) {
        return res.status(401).json({
          error: 'Este usuário não está autorizado para compras em atacado',
        });
      }
    }

    const data = { point_sale_id: point_sale.id, ...req.body };

    const sale = await Sale.create(data);

    return res.json(sale);
  }
}

export default new Start_sale();
