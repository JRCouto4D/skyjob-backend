import Pdv from '../../models/Point_sale';

class Search_point_sale {
  async index(req, res) {
    const pdv = await Pdv.findByPk(req.params.pdv_id);

    if (!pdv) {
      return res.status(401).json({ error: 'PDV não encontrado.' });
    }

    return res.json(pdv);
  }
}

export default new Search_point_sale();
