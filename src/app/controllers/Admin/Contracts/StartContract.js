import { parseISO, isAfter, isBefore } from 'date-fns';
import Contract from '../../../models/Contract';
import Company from '../../../models/Company';

class StartContract {
  async store(req, res) {
    const checkAdmin = await Company.findByPk(req.companyId);

    if (!checkAdmin.admin) {
      return res.status(400).json({ error: 'Operação não autorizada' });
    }

    const { company_id, start_date, end_date } = req.body;

    const company = await Company.findOne({
      where: {
        id: company_id,
      },
    });

    if (!company) {
      return res.status(401).json({ error: 'Company não encontrada' });
    }

    const checkContract = await Contract.findOne({
      where: {
        company_id,
        status: true,
      },
    });

    if (checkContract) {
      return res
        .status(401)
        .json({ error: 'Existe um contrato ativo para esta empresa' });
    }

    const contract = await Contract.create({
      company_id,
      start_date: parseISO(start_date),
      end_date: parseISO(end_date),
    });

    if (
      isAfter(new Date(), parseISO(start_date)) &&
      isBefore(new Date(), parseISO(end_date))
    ) {
      company.access = true;
      await company.save();
    } else {
      company.access = false;
      await company.save();
    }
    return res.json(contract);
  }
}

export default new StartContract();
