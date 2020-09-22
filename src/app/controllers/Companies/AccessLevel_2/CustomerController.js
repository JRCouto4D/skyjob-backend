import * as Yup from 'yup';
import { Op } from 'sequelize';
import Customer from '../../../models/Customer';
import User from '../../../models/User';
import File from '../../../models/File';

class CustomerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.number().required(),
      name: Yup.string().required(),
      cpf: Yup.string().when('type', (type, field) =>
        type === 1 ? field.required() : field
      ),
      cnpj: Yup.string().when('type', (type, field) =>
        type === 2 ? field.required() : field
      ),
      email: Yup.string().email(),
      telephone: Yup.string(),
      cell_phone: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neighborhood: Yup.string(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      wholesale: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { type, email, cpf, cnpj, wholesale } = req.body;
    const { company_id } = req.params;

    if (email) {
      const checkEmail = await Customer.findOne({
        where: {
          company_id,
          email,
        },
      });

      if (checkEmail) {
        return res
          .status(401)
          .json({ error: 'Este email já está em uso no sistema' });
      }
    }

    if (type === 1) {
      const checkCpf = await Customer.findOne({
        where: {
          company_id,
          cpf,
        },
      });

      if (checkCpf) {
        return res
          .status(401)
          .json({ error: 'Pessoa física já cadastrado no sistema' });
      }
    }

    if (type === 2 || wholesale) {
      const checkUser = await User.findByPk(req.companyId);

      if (!checkUser) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      if (
        checkUser.access_level < 2 ||
        checkUser.company_id !== Number(company_id)
      ) {
        return res.status(401).json({ error: 'Operação não autorizada' });
      }

      const checkCnpj = await Customer.findOne({
        where: {
          company_id,
          cnpj,
        },
      });

      if (checkCnpj) {
        return res
          .status(401)
          .json({ error: 'Esta empresa já possui cadastro no sistema' });
      }
    }

    const data = { company_id, ...req.body };
    const customer = await Customer.create(data);

    return res.json(customer);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      type: Yup.number(),
      name: Yup.string(),
      cpf: Yup.string(),
      cnpj: Yup.string(),
      email: Yup.string().email(),
      telephone: Yup.string(),
      cell_phone: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neighborhood: Yup.string(),
      complement: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      wholesale: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { customer_id } = req.params;

    const customer = await Customer.findByPk(customer_id);

    if (!customer) {
      return res.status(401).json({ error: 'Cliente não encotrado' });
    }

    const { type, email, cpf, cnpj } = req.body;
    const { company_id } = req.params;

    if (email && email !== customer.email) {
      const checkEmail = await Customer.findOne({
        where: {
          company_id,
          email,
        },
      });

      if (checkEmail) {
        return res
          .status(401)
          .json({ error: 'Este email já está em uso no sistema' });
      }
    }

    if (type && type !== customer.type) {
      if (type === 1) {
        const checkCpf = await Customer.findOne({
          where: {
            company_id,
            cpf,
          },
        });

        if (checkCpf) {
          return res
            .status(401)
            .json({ error: 'Pessoa física já cadastrado no sistema' });
        }
      }

      if (type === 2) {
        const checkUser = await User.findByPk(req.companyId);

        if (!checkUser) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        if (
          checkUser.access_level < 2 ||
          checkUser.company_id !== Number(company_id)
        ) {
          return res.status(401).json({ error: 'Operação não autorizada' });
        }

        if (cnpj) {
          const checkCnpj = await Customer.findOne({
            where: {
              company_id,
              cnpj,
            },
          });

          if (checkCnpj) {
            return res
              .status(401)
              .json({ error: 'Esta empresa já possui cadastro no sistema' });
          }
        }
      }
    }

    const newDataCustomer = await customer.update(req.body);

    return res.json(newDataCustomer);
  }

  async delete(req, res) {
    const checkUser = await User.findByPk(req.companyId);

    if (!checkUser) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (checkUser.access_level < 2) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const { customer_id } = req.params;

    await Customer.destroy({
      where: {
        id: customer_id,
      },
    });

    return res.send();
  }

  async index(req, res) {
    const { company_id } = req.params;
    const { page = 1 } = req.query;

    const total = await Customer.count({
      where: {
        company_id,
      },
    });

    const customers = await Customer.findAll({
      where: {
        company_id,
      },
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({ customers, total });
  }

  async show(req, res) {
    const { company_id } = req.params;
    const { page = 1, type = 0, name = '' } = req.query;

    const query =
      type === 0
        ? { company_id, name: { [Op.iLike]: `${name}%` } }
        : { company_id, type, name: { [Op.iLike]: `${name}%` } };

    const total = await Customer.count({
      where: query,
    });

    const customers = await Customer.findAll({
      where: query,
      limit: 6,
      offset: (page - 1) * 6,
      order: [['name', 'ASC']],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json({ customers, total });
  }
}

export default new CustomerController();
