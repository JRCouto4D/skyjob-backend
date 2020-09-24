import Invoice from '../../../../models/Invoice';
import Item from '../../../../models/Invoice_item';

class DeleteInvoice {
  async delete(req, res) {
    const { invoice_id } = req.params;

    const invoice = await Invoice.findByPk(invoice_id);

    if (!invoice) {
      return res.status(401).json({ error: 'Nota fiscal não encontrada' });
    }

    if (invoice.reversed_at === null) {
      return res.status(401).json({ error: 'Operação não autorizada.' });
    }

    await Item.destroy({
      where: {
        invoice_id,
      },
    });

    await invoice.destroy();

    return res.send();
  }
}

export default new DeleteInvoice();
