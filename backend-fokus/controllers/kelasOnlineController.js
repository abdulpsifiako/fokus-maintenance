const conndb = require("../configs/database");

const kelasOnlineModel = conndb.getRepository(
  require("../entities/kelasOnlineEntity")
);

module.exports = {
  createKelasOnline: async (req, res) => {
    try {
      await kelasOnlineModel.insert({
        properties: req.body,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Kelas Online berhasil ditambah",
        data: null,
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
  getkelasOnline: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const programUtama = req.query.programUtama || "";
      const search = req.query.search || "";
      const sortby = req.query.sortby || "created_at|DESC";

      // Whitelist kolom sort
      const allowedSortColumns = ["created_at", "updated_at"];
      // const allowedSortColumns = ["created_at", "updated_at", "properties->>'materi'"];
      const [rawColumn, rawType] = sortby.split("|");

      const sortColumn = allowedSortColumns.includes(rawColumn)
        ? rawColumn
        : "created_at";
      const sortType = ["ASC", "DESC"].includes(rawType?.toUpperCase())
        ? rawType.toUpperCase()
        : "DESC";

      let query = kelasOnlineModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'judul') LIKE LOWER(:judul) OR properties ->> 'judul' IS NULL)",
          {
            judul: `%${search}%`,
          }
        )
        .andWhere("properties ->> 'status' = 'true'")
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });

      if (programUtama) {
        query.andWhere("properties ->> 'program_utama' ILIKE :programUtama", {
          programUtama: `%${programUtama}%`,
        });
      }

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(sortColumn, sortType)
        .getManyAndCount();

      const totalPage = Math.ceil(count / limit);
      const nextPage = page < totalPage ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses load program",
        data: {
          nextPage,
          prevPage,
          page,
          totalPage,
          totalData: count,
          data,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  adminkelasOnline: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const programUtama = req.query.programUtama || "";
      const search = req.query.search || "";
      const sortby = req.query.sortby || "created_at|DESC";

      // Whitelist kolom sort
      const allowedSortColumns = ["created_at", "updated_at"];
      // const allowedSortColumns = ["created_at", "updated_at", "properties->>'materi'"];
      const [rawColumn, rawType] = sortby.split("|");

      const sortColumn = allowedSortColumns.includes(rawColumn)
        ? rawColumn
        : "created_at";
      const sortType = ["ASC", "DESC"].includes(rawType?.toUpperCase())
        ? rawType.toUpperCase()
        : "DESC";

      let query = kelasOnlineModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'judul') LIKE LOWER(:judul) OR properties ->> 'judul' IS NULL)",
          {
            judul: `%${search}%`,
          }
        )
        // .andWhere("properties ->> 'status' = 'true'")
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });

      if (programUtama) {
        query.andWhere("properties ->> 'program_utama' ILIKE :programUtama", {
          programUtama: `%${programUtama}%`,
        });
      }

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(sortColumn, sortType)
        .getManyAndCount();

      const totalPage = Math.ceil(count / limit);
      const nextPage = page < totalPage ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses load program",
        data: {
          nextPage,
          prevPage,
          page,
          totalPage,
          totalData: count,
          data,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  updateKelasOnline: async (req, res) => {
    try {
      const { id } = req.params;
      const kelas = await kelasOnlineModel.findOne({ where: { id: id } });

      if (!kelas) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Kelas tidak ditemukan",
          data: null,
        });
      }
      await kelasOnlineModel.update({ id }, { properties: req.body });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Kelas berhasil disimpan",
        data: [],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  deleteKelasOnline: async (req, res) => {
    try {
      const { id } = req.params;

      const latihan = await kelasOnlineModel.findOneBy({
        id: id,
        is_deleted: false,
      });

      if (!latihan) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Latihan tidak ditemukan",
          data: null,
        });
      }

      await kelasOnlineModel.update(
        { id: id },
        {
          is_deleted: true,
        }
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Latihan berhasil dihapus",
        data: null,
      });
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      };
    }
  },
};
