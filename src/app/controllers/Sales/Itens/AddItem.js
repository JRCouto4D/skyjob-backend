import * as Yup from 'yup';
import Sale from '../../../models/Sale';
import Item from '../../../models/Item';
import Product from '../../../models/Product';
import Point from '../../../models/Point_sale';
import Cash from '../../../models/Cash_register';

class AddItem {
  async store(req, res) {
    const schema = Yup.object().shape({
      amount: Yup.number().required(),
      discount: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { sale_id, product_id } = req.params;
    const { amount, discount } = req.body;

    const sale = await Sale.findByPk(sale_id, {
      include: [
        {
          model: Point,
          as: 'point_sale',
          attributes: ['id', 'user_id', 'cash_register_id'],
          include: [
            {
              model: Cash,
              as: 'cash_register',
              attributes: ['id', 'company_id', 'description'],
            },
          ],
        },
      ],
    });

    if (!sale) {
      return res.status(401).json({ error: 'Venda não encontrada' });
    }

    if (sale.complete_at !== null) {
      return res
        .status(401)
        .json({ error: 'Operação não autorizada. A venda já foi completa' });
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (sale.point_sale.cash_register.company_id !== product.company_id) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    if (sale.type_sale === 2) {
      if (product.wholesale === false) {
        return res
          .status(401)
          .json({ error: 'Produto não autorizada para vendas em atacado' });
      }

      if (amount < product.minimum_wholesale) {
        return res.status(410).json({
          error: 'Quantidade abaixo do minimo para vendas em atacado',
        });
      }
    }

    if (product.stock_moviment) {
      if (amount > product.amount_stock || product.amount_stock <= 0) {
        return res.status(401).json({ error: 'Sem quantidade em estoque' });
      }
    }

    const dataItem = {
      sale_id,
      product_id,
      ...req.body,
      total:
        product.retail_price * req.body.amount -
        product.retail_price * req.body.amount * (discount * 0.01),
    };

    const item = await Item.create(dataItem);

    if (item.id) {
      const valueDiscount = product.retail_price * amount * (discount * 0.01);
      if (sale.total === null) {
        const totalRetail =
          sale.type_sale === 1
            ? product.retail_price * amount - valueDiscount
            : product.wholesale_price * amount - valueDiscount;

        sale.total = totalRetail;
        await sale.save();
      } else {
        const totalWholesale =
          sale.type_sale === 1
            ? sale.total + product.retail_price * amount - valueDiscount
            : sale.total + product.wholesale_price * amount - valueDiscount;

        sale.total = totalWholesale;
        await sale.save();
      }

      if (product.stock_moviment) {
        await product.update({ amount_stock: product.amount_stock - amount });
      }
    }

    return res.json({
      item,
      sale: { id: sale.id, total: sale.total },
      product: {
        id: product.id,
        description: product.description,
        retail_price: product.retail_price,
      },
    });
  }
}

export default new AddItem();
