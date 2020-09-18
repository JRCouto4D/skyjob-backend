import * as Yup from 'yup';
import Return from '../../models/Return';
import Sale from '../../models/Sale';
import Point from '../../models/Point_sale';
import User from '../../models/User';
import Item from '../../models/Item';
import Product from '../../models/Product';

class Return_sale {
  async store(req, res) {
    const schema = Yup.object().shape({
      authorized_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { point_sale_id, sale_id } = req.params;

    const point_sale = await Point.findByPk(point_sale_id);

    if (!point_sale) {
      return res.status(401).json({ error: 'Ponto de venda não encontrado' });
    }

    if (!point_sale.active) {
      return res
        .status(401)
        .json({ error: 'Operação não autorizada. Ponto de venda inativo' });
    }

    const sale = await Sale.findByPk(sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encotrada' });
    }

    if (sale.canceled_at !== null) {
      return res.status(401).json({ error: 'Esta venda foi cancelada' });
    }

    const { authorized_id } = req.body;

    const authorized = await User.findByPk(authorized_id);

    if (!authorized) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (authorized.access_level < 2) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const data = { point_sale_id, sale_id, ...req.body };

    const return_sale = await Return.create(data);

    if (return_sale.id) {
      const itens = await Item.findAll({
        where: {
          sale_id,
        },
      });

      if (itens.length >= 1) {
        itens.forEach(async (item) => {
          const product = await Product.findByPk(item.product_id);

          await product.update({
            amount_stock: product.amount_stock + item.amount,
          });
        });

        await sale.update({ canceled_at: new Date() });
      }
    }

    return res.json(return_sale);
  }
}

export default new Return_sale();
