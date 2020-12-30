import * as Yup from 'yup';
import Product from '../models/Product';

class ProductController {
  async update(req, res) {
    const schema = Yup.object().shape({
      moviment: Yup.number().required(),
      amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { product_id } = req.params;
    const { moviment, amount } = req.body;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (moviment === 1) {
      product.amount_stock += amount;

      await product.save();
    }

    if (moviment === 2) {
      if (amount > product.amount_stock) {
        return res.status(401).json({ error: 'Produto em baixa no estoque' });
      }

      product.amount_stock -= amount;

      await product.save();
    }

    return res.json(product);
  }
}

export default new ProductController();
