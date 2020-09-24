import * as Yup from 'yup';
import Invoice from '../../../../../models/Invoice';
import Invoice_Item from '../../../../../models/Invoice_item';
import Product from '../../../../../models/Product';

class Item_invoiceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      price: Yup.number().required(),
      amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { invoice_id, product_id } = req.params;

    const checkItem = await Invoice_Item.findAll({
      where: {
        invoice_id,
        product_id,
      },
    });

    if (checkItem.length >= 1) {
      return res.status(401).json({ error: 'Este produto já foi cadastrado' });
    }

    const invoice = await Invoice.findByPk(invoice_id);

    if (invoice.included_at !== null || invoice.reversed_at !== null) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    const data = { invoice_id, product_id, ...req.body };

    const item = await Invoice_Item.create(data);

    return res.json(item);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      price: Yup.number().required(),
      amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { item_id } = req.params;

    const item = await Invoice_Item.findByPk(item_id);

    if (!item) {
      return res
        .status(401)
        .json({ error: 'Item de nota fiscal não encontrado' });
    }

    const newDataItem = await item.update(req.body);

    return res.json(newDataItem);
  }

  async delete(req, res) {
    const { item_id } = req.params;

    await Invoice_Item.destroy({
      where: {
        id: item_id,
      },
    });

    return res.send();
  }

  async show(req, res) {
    const { invoice_id } = req.params;
    const { page = 1 } = req.query;

    const total = await Invoice_Item.count({
      where: {
        invoice_id,
      },
    });

    const itens = await Invoice_Item.findAll({
      where: {
        invoice_id,
      },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['description'],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['id', 'ASC']],
    });

    return res.json({ itens, total });
  }
}

export default new Item_invoiceController();
