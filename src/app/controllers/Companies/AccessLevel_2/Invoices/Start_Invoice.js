import * as Yup from 'yup';
import Invoice from '../../../../models/Invoice';
import Provider from '../../../../models/Provider';

class Start_Invoice {
  async store(req, res) {
    const schema = Yup.object().shape({
      number: Yup.string().required(),
      date_issue: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { provider_id } = req.body;
    const { company_id } = req.params;

    const provider = await Provider.findByPk(provider_id);

    if (!provider) {
      return res.status(401).json({ error: 'Fornecedor não encontrado' });
    }

    if (!provider.active) {
      return res
        .status(401)
        .json({ error: 'Este fornecedor não está ativo no sistema' });
    }

    const data = { company_id, provider_id, ...req.body };

    const checkInvoice = await Invoice.findAll({
      where: {
        company_id,
        provider_id,
        included_at: null,
      },
    });

    if (checkInvoice.length >= 1) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const invoice = await Invoice.create(data);

    return res.json(invoice);
  }
}

export default new Start_Invoice();
