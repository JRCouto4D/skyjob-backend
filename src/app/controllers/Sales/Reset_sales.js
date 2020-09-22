import Sale from '../../models/Sale';
import Item from '../../models/Item';

class Reset_sales {
  async delete(req, res) {
    const { point_sale_id } = req.params;
    const sales = await Sale.findAll({
      where: {
        point_sale_id,
        complete_at: null,
        canceled_at: null,
      },
    });

    sales.map(async (sale) => {
      await Item.destroy({
        where: {
          sale_id: sale.id,
        },
      });

      await Sale.destroy({
        where: {
          id: sale.id,
        },
      });
    });

    return res.send();
  }
}

export default new Reset_sales();
