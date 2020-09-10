import Company from '../../../models/Company';
import Contract from '../../../models/Contract';
import File from '../../../models/File';

class ContractController {
  async index(req, res) {
    const checkAdmin = await Company.findByPk(req.companyId);

    if (!checkAdmin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { page = 1 } = req.query;

    const total = await Contract.count();

    const contracts = await Contract.findAll({
      attributes: ['id', 'start_date', 'end_date', 'status'],
      limit: 6,
      offset: (page - 1) * 6,
      order: [['start_date', 'ASC']],
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'description', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ contracts, total });
  }

  async delete(req, res) {
    const checkAdmin = await Company.findByPk(req.companyId);

    if (!checkAdmin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { contract_id } = req.params;

    await Contract.destroy({
      where: {
        id: contract_id,
      },
    });

    return res.send();
  }
}

export default new ContractController();
