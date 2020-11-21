import Sale from '../../models/Sale';
import Point from '../../models/Point_sale';
import Cash from '../../models/Cash_register';
import User from '../../models/User';
import File from '../../models/File';

class List_sales {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { point_sale_id } = req.params;

    const total = await Sale.count({
      point_sale_id,
    });

    const sales = await Sale.findAll({
      where: {
        point_sale_id,
      },
      attributes: ['id', 'type_sale', 'payment', 'installments', 'complete_at'],
      include: [
        {
          model: Point,
          as: 'point_sale',
          attributes: ['id'],
          include: [
            {
              model: Cash,
              as: 'cash_register',
              attributes: ['id', 'description'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'access_level', 'active'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['complete_at', 'DESC']],
    });

    return res.json({ sales, total });
  }

  async show(req, res) {
    const { point_sale_id } = req.params;
    const total = await Sale.count({
      where: {
        point_sale_id,
      },
    });

    const sales = await Sale.findAll({
      where: {
        point_sale_id,
      },
      attributes: [
        'id',
        'type_sale',
        'total',
        'payment',
        'installments',
        'complete_at',
      ],
      include: [
        {
          model: Point,
          as: 'point_sale',
          attributes: ['id'],
          include: [
            {
              model: Cash,
              as: 'cash_register',
              attributes: ['id', 'description'],
            },
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'access_level', 'active'],
              include: [
                {
                  model: File,
                  as: 'avatar',
                  attributes: ['name', 'path', 'url'],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json({ sales, total });
  }
}

export default new List_sales();
