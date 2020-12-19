import * as Yup from 'yup';
import Return from '../../models/Return';
import Sale from '../../models/Sale';
import Point from '../../models/Point_sale';
import User from '../../models/User';
import Item from '../../models/Item';
import Product from '../../models/Product';
import Customer from '../../models/Customer';
import File from '../../models/File';

class Return_sale {
  async store(req, res) {
    const schema = Yup.object().shape({
      authorized_id: Yup.number().required(),
      company_id: Yup.number().required(),
    });

    async function updateStock(it) {
      const product = await Product.findByPk(it.product_id);

      product.amount_stock += it.amount;

      await product.save();
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { point_sale_id, sale_id } = req.params;

    const point_sale = await Point.findByPk(point_sale_id);

    if (!point_sale) {
      return res.status(401).json({ error: 'Ponto de venda não encontrado' });
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
        itens.forEach((item) => {
          updateStock(item);
          return this;
        });

        await sale.update({ canceled_at: new Date() });
      }
    }

    return res.json(return_sale);
  }

  async index(req, res) {
    const { company_id } = req.params;
    const { page = 1 } = req.query;

    const total = await Return.count({
      where: {
        company_id,
      },
    });

    const returns = await Return.findAll({
      where: {
        company_id,
      },
      limit: 8,
      offset: (page - 1) * 8,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Sale,
          as: 'sale',
          attributes: ['id', 'total', 'type_sale', 'complete_at'],
          include: [
            {
              model: Customer,
              as: 'customer',
              attributes: ['name', 'type', 'cpf', 'cnpj'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: 'authorized',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ returns, total });
  }
}

export default new Return_sale();
