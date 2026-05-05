const conndb = require("../configs/database");

const historyModel = conndb.getRepository(require("../entities/historyEntity"));
const transaksiModel = conndb.getRepository(
  require("../entities/transaksiProgramEntity")
);

module.exports = {
  createHistory: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis, typelatihan, orderstatus, submateri, id_program, materi } =
        req.body;
      const order = await transaksiModel.findOne({
        where: {
          jenis,
          user_id: id,
          status: orderstatus,
        },
        order: {
          created_at: "DESC",
        },
      });
      await historyModel.insert({
        jenis,
        typelatihan,
        orderid: order.id,
        orderstatus,
        submateri,
        id_program,
        userid: id,
        materi,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses menyimpan history",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  getHistory: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis, typelatihan, orderstatus, id_program } = req.body;
      const order = await transaksiModel.findOne({
        where: {
          jenis,
          user_id: id,
          status: orderstatus,
        },
        order: {
          created_at: "DESC",
        },
      });
      if (new Date() > new Date(order.valid_until)) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "Harus membeli lagi",
          data: {
            isPurchase: false,
            valid: result.valid_until,
          },
        });
      }
      const result = await historyModel.find({
        where: {
          userid: id,
          jenis,
          typelatihan,
          id_program,
        },
      });

      console.log("Ini RESULT", result);

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses mendapat history",
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
};
