import Contract from '../../../models/Contract';
import Company from '../../../models/Company';

class CancelContract {
  async update(req, res) {
    const checkAdmin = await Company.findByPk(req.companyId);

    if (!checkAdmin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { contract_id } = req.params;

    const contract = await Contract.findByPk(contract_id);

    if (!contract) {
      return res.status(401).json({ error: 'Contrato não encontrado' });
    }

    const customer = await Company.findOne({
      where: {
        current_contract: contract.id,
      },
    });

    if (customer) {
      customer.access = false;
      await customer.save();
    }

    contract.status = false;

    await contract.save();

    return res.json({ contract, customer });
  }
}

export default new CancelContract();
