import Pdv from '../../models/Point_sale';
import Cash from '../../models/Cash_register';
import User from '../../models/User';

class Search_point_sale {
  async index(req, res) {
    const pdv = await Pdv.findByPk(req.params.pdv_id);

    if (!pdv) {
      return res.status(401).json({ error: 'PDV não encontrado.' });
    }

    return res.json(pdv);
  }

  async show(req, res) {
    const { company_id } = req.params;

    const pdvs = await Pdv.findAll({
      where: {
        company_id,
        closed_at: null,
      },
      include: [
        {
          model: Cash,
          as: 'cash_register',
          attributes: ['description'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    return res.json(pdvs);
  }
}

export default new Search_point_sale();
