import * as Yup from 'yup';
import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import Item from '../../../models/Item';

class UpdateItem {
  async update(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos' });
    }

    const { item_id } = req.params;

    const item = await Item.findByPk(item_id);

    if (!item) {
      return res.status(401).json({ error: 'Item não encontrado' });
    }

    const sale = await Sale.findByPk(item.sale_id);

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.complete_at !== null) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const product = await Product.findByPk(item.product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    const { amount } = req.body;

    if (amount) {
      if (amount > product.amount_stock || product.amount_stock <= 0) {
        return res.status(401).json({ error: 'Sem quantidade em estoque' });
      }
      if (sale.type_sale === 1) {
        const lowItem = sale.total - product.retail_price * item.amount;
        const newItem = lowItem + product.retail_price * amount;

        await sale.update({ total: newItem });
      } else {
        const lowItem = sale.total - product.wholesale_price * item.amount;
        const newItem = lowItem + product.wholesale_price * amount;

        await sale.update({ total: newItem });
      }

      await product.update({
        amount_stock: product.amount_stock + item.amount - amount,
      });
    }

    const updateItem = await item.update(req.body);

    return res.json(updateItem);
  }
}

export default new UpdateItem();
