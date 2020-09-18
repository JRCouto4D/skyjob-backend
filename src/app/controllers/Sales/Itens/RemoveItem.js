import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import Item from '../../../models/Item';

class RemoveItem {
  async delete(req, res) {
    const { item_id } = req.params;

    const item = await Item.findByPk(item_id);

    if (!item) {
      return res.status(401).json({ error: 'Item não encontradado' });
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

    if (sale.type_sale === 1) {
      await sale.update({
        total: sale.total - product.retail_price * item.amount,
      });
    } else {
      await sale.update({
        total: sale.total - product.wholesale_price * item.amount,
      });
    }

    await product.update({ amount_stock: product.amount_stock + item.amount });

    await item.destroy();

    return res.send();
  }
}

export default new RemoveItem();
