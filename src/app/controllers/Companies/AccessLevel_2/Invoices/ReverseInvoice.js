import Invoice from '../../../../models/Invoice';
import Item from '../../../../models/Invoice_item';
import Product from '../../../../models/Product';

class ReverseInvoice {
  async update(req, res) {
    const { invoice_id } = req.params;

    const invoice = await Invoice.findByPk(invoice_id);

    if (!invoice) {
      return res.status(401).json({ error: 'Nota fiscal não encontrada' });
    }

    if (invoice.included_at === null) {
      return res.status(401).json({
        error: 'Operação não autorizada. Está nota não está no sistema',
      });
    }

    const itens = await Item.findAll({
      where: {
        invoice_id,
      },
    });

    itens.forEach(async (item) => {
      const product = await Product.findByPk(item.product_id);

      product.amount_stock -= item.amount;

      product.save();
    });

    invoice.reversed_at = new Date();
    await invoice.save();

    return res.json(invoice);
  }
}

export default new ReverseInvoice();
