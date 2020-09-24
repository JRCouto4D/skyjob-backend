import Invoice from '../../../../models/Invoice';
import Item from '../../../../models/Invoice_item';
import Product from '../../../../models/Product';

class IncludeInvoice {
  async update(req, res) {
    const { invoice_id } = req.params;

    const invoice = await Invoice.findByPk(invoice_id);

    if (!invoice) {
      return res.status(401).json({ error: 'Nota fiscal não encontrada' });
    }

    if (invoice.included_at !== null) {
      return res.status(401).json({
        error: 'Operação não autorizada. Está nota jà consta no sistema',
      });
    }

    const itens = await Item.findAll({
      where: {
        invoice_id,
      },
    });

    if (itens.length >= 1) {
      itens.forEach(async (item) => {
        const product = await Product.findByPk(item.product_id);

        product.cust_price = item.price;
        product.amount_stock += item.amount;

        product.save();
      });

      const totalInvoice = itens.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.price * currentValue.amount,
        0
      );

      invoice.value = totalInvoice;
      invoice.included_at = new Date();
      await invoice.save();
    } else {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    return res.json(invoice);
  }
}

export default new IncludeInvoice();
