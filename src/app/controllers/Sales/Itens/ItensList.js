import Item from '../../../models/Item';
import Product from '../../../models/Product';

class SearchSale {
  async show(req, res) {
    const { sale_id } = req.params;

    const itens = await Item.findAll({
      where: {
        sale_id,
      },
      attributes: ['id', 'amount', 'discount', 'total'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['description', 'retail_price'],
        },
      ],
    });

    return res.json(itens);
  }

  async index(req, res) {
    const { sale_id, product_id } = req.params;

    const itens = await Item.findAll({
      where: {
        sale_id,
        product_id,
      },
    });

    return res.json(itens);
  }
}

export default new SearchSale();
