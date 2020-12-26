import Sale from '../../models/Sale';
import Customer from '../../models/Customer';

class SearchSale {
  async show(req, res) {
    const { sale_id } = req.params;

    const sale = await Sale.findByPk(sale_id, {
      attributes: [
        'id',
        'point_sale_id',
        'type_sale',
        'payment',
        'installments',
        'total',
        'complete_at',
        'canceled_at',
      ],
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name', 'type', 'cpf', 'cnpj'],
        },
      ],
    });

    return res.json(sale);
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Sale.count({
      where: {
        company_id,
      },
    });

    const sales = await Sale.findAll({
      where: {
        company_id,
      },
    });

    return res.json({ sales, total });
  }
}

export default new SearchSale();
