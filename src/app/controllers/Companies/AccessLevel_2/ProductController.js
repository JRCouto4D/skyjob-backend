import * as Yup from 'yup';
import { Op } from 'sequelize';
import Product from '../../../models/Product';
import Provider from '../../../models/Provider';
import Unit from '../../../models/Unit';
import Category from '../../../models/Category';
import File from '../../../models/File';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      category_id: Yup.number().required(),
      provider_id: Yup.number().required(),
      unit_id: Yup.number().required(),
      image_id: Yup.number(),
      cust_price: Yup.number(),
      retail_price: Yup.number().required(),
      wholesale: Yup.boolean(),
      wholesale_price: Yup.number().when('wholesale', (wholesale, field) =>
        wholesale ? field.required() : field
      ),
      minimum_wholesale: Yup.number().when('wholesale', (wholesale, field) =>
        wholesale ? field.required() : field
      ),
      minimum_stock: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const { category_id, provider_id, unit_id } = req.body;

    const checkCategory = await Category.findByPk(category_id);

    if (!checkCategory) {
      return res.status(401).json({ error: 'Categoria não encotrada' });
    }

    const checkProvider = await Provider.findByPk(provider_id);

    if (!checkProvider) {
      return res.status(401).json({ error: 'Fornecedor não encontrado' });
    }

    const checkUnit = await Unit.findByPk(unit_id);

    if (!checkUnit) {
      return res.status(401).json({ error: 'Unidade não encontrada' });
    }

    const { company_id } = req.params;

    const data = { company_id, ...req.body };

    const product = await Product.create(data);

    return res.json(product);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      category_id: Yup.number(),
      provider_id: Yup.number(),
      unit_id: Yup.number(),
      image_id: Yup.number(),
      cust_price: Yup.number(),
      retail_price: Yup.number(),
      wholesale_sale: Yup.number(),
      minimum_wholesale: Yup.number(),
      minimum_stock: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados iválidos' });
    }

    const { category_id, provider_id, unit_id } = req.body;

    const { product_id } = req.params;

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(401).json({ error: 'Produto não encontrado' });
    }

    if (category_id && category_id !== product.category_id) {
      const checkCategory = await Category.findByPk(category_id);

      if (!checkCategory) {
        return res.status(401).json({ error: 'Categoria não encotrada' });
      }
    }

    if (provider_id && provider_id !== product.provider_id) {
      const checkProvider = await Provider.findByPk(provider_id);

      if (!checkProvider) {
        return res.status(401).json({ error: 'Fornecedor não encontrado' });
      }
    }

    if (unit_id && unit_id !== product.unit_id) {
      const checkUnit = await Unit.findByPk(unit_id);

      if (!checkUnit) {
        return res.status(401).json({ error: 'Unidade não encontrada' });
      }
    }

    const newDataProduct = await product.update(req.body);

    return res.json(newDataProduct);
  }

  async delete(req, res) {
    const { product_id } = req.params;

    await Product.destroy({
      where: {
        id: product_id,
      },
    });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;

    const total = await Product.count({
      where: {
        company_id,
      },
    });

    const products = await Product.findAll({
      where: {
        company_id,
      },
      attributes: [
        'id',
        'description',
        'cust_price',
        'retail_price',
        'wholesale_price',
        'minimum_wholesale',
        'minimum_stock',
        'active',
        'amount_stock',
      ],
    });

    return res.json({ products, total });
  }

  async show(req, res) {
    const { page = 1, search = '', op = 0 } = req.query;
    const { company_id } = req.params;

    const searchOp = Number(op);

    function setWhere() {
      let query = {
        company_id,
      };

      if (searchOp === 1) {
        query = {
          company_id,
          description: { [Op.iLike]: `${search}%` },
        };
      }

      if (searchOp === 2) {
        query = {
          company_id,
          category_id: search,
        };
      }

      if (searchOp === 3) {
        query = {
          company_id,
          provider_id: search,
        };
      }

      if (searchOp === 4) {
        query = {
          company_id,
          unit_id: search,
        };
      }

      return query;
    }

    const total = await Product.count({
      where: setWhere(),
    });

    const products = await Product.findAll({
      where: setWhere(),
      attributes: [
        'id',
        'description',
        'cust_price',
        'retail_price',
        'wholesale_price',
        'minimum_wholesale',
        'minimum_stock',
        'wholesale',
        'active',
        'amount_stock',
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: Provider,
          as: 'provider',
          attributes: ['id', 'name'],
        },
        {
          model: Unit,
          as: 'unit',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'image',
          attributes: ['name', 'path', 'url'],
        },
      ],
      limit: 5,
      offset: (page - 1) * 5,
      order: [['description', 'ASC']],
    });

    return res.json({ products, total });
  }
}

export default new ProductController();
