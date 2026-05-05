const conndb = require("../configs/database");

const laporSoalModel = conndb.getRepository(
  require("../entities/laporanSoalEntity")
);

module.exports = {
  createLaporanSoal: async (req, res) => {
    try {
      const { data_soal, alasan } = req.body;

      await laporSoalModel.insert({
        data_user: req.detailUser,
        data_soal: data_soal,
        laporan: alasan,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Laporan berhasil di buat",
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
  getLaporanAll: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const sortby = req.query.sortby || "created_at|DESC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      let query = laporSoalModel
        .createQueryBuilder()
        .where(
          "(LOWER(data_soal ->> 'module_name') LIKE LOWER(:name) OR data_soal ->> 'module_name' IS NULL)",
          { name: `%${search}%` }
        )
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(`${sortColumn}`, sortType)
        .getManyAndCount();

      const totalPage = Math.ceil(count / limit);
      const nextPage = page < totalPage;
      const prevPage = page > 1;
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses load program",
        data: {
          nextPage: nextPage,
          prevPage: prevPage,
          page: page,
          totalPage: totalPage,
          totalData: count,
          data: data,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  updateStatusLaporan: async (req, res) => {
    try {
      await laporSoalModel.update(
        { id: req.params.id },
        { status: req.body.status }
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Laporan berhasil di update",
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
};
