import Invoice from '../../../../models/Invoice';
import Provider from '../../../../models/Provider';

class ListInvoice {
  async index(req, res) {
    const { company_id } = req.params;
    const { page = 1 } = req.query;

    const total = await Invoice.count({
      where: {
        company_id,
      },
    });

    const invoices = await Invoice.findAll({
      where: {
        company_id,
      },
      include: [
        {
          model: Provider,
          as: 'provider',
          attributes: ['name', 'representative', 'email'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['included_at', 'ASC']],
    });

    return res.json({ invoices, total });
  }

  async show(req, res) {
    const { company_id } = req.params;

    const invoices = await Invoice.findAll({
      where: {
        company_id,
      },
    });

    return res.json(invoices);
  }
}

export default new ListInvoice();
