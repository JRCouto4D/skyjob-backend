import * as Yup from 'yup';
import Sale from '../../../models/Sale';
import Product from '../../../models/Product';
import Item from '../../../models/Item';

class UpdateItem {
  async update(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number().required(),
      discount: Yup.number().required(),
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

    const { amount, discount } = req.body;

    if (amount) {
      if (amount > product.amount_stock || product.amount_stock <= 0) {
        return res.status(401).json({ error: 'Sem quantidade em estoque' });
      }
      if (sale.type_sale === 1) {
        const lowItem = sale.total - item.total;

        const discountValue = product.retail_price * amount * (discount * 0.01);

        const grossAmount = product.retail_price * amount;

        const netValue = grossAmount - discountValue;

        const result = lowItem + netValue;

        sale.total = result;
        await sale.save();
      } else {
        const lowItem = sale.total - item.total;

        const discountValue =
          product.wholesale_price * amount * (discount * 0.01);

        const grossAmount = product.wholesale_price * amount;

        const netValue = grossAmount - discountValue;

        const result = lowItem + netValue;

        sale.total = result;
        await sale.save();
      }

      if (product.stock_moviment) {
        await product.update({
          amount_stock: product.amount_stock + item.amount - amount,
        });
      }
    }

    const dataItem = {
      ...req.body,
      total:
        sale.type_sale === 1
          ? product.retail_price * amount -
            product.retail_price * amount * (discount * 0.01)
          : product.wholesale_price * amount -
            product.wholesale_price * amount * (discount * 0.01),
    };
    const updateItem = await item.update(dataItem);

    return res.json({ item: updateItem, sale });
  }
}

export default new UpdateItem();
