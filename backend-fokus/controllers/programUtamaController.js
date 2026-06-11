const { get } = require("@dotenvx/dotenvx");
const conndb = require("../configs/database");
const { deleteProgram } = require("./programController");
const { In } = require("typeorm");

const programUtamaModel = conndb.getRepository(
  require("../entities/programUtamaEntity"),
);
const tryoutModel = conndb.getRepository(require("../entities/tryoutEntity"));
const kelasModel = conndb.getRepository(
  require("../entities/kelasOnlineEntity"),
);
const jenisProgramModel = conndb.getRepository(
  require("../entities/jenisProgramEntity"),
);
const transaksiModel = conndb.getRepository(
  require("../entities/transaksiProgramEntity"),
);

module.exports = {
  createProgramUtama: async (req, res) => {
    try {
      const { properties } = req.body;

      await programUtamaModel.save({
        properties,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Program Utama berhasil ditambah",
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
  getProgramUtama: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const jenis = req.query.jenis || "";
      const sortby = req.query.sortby || "created_at|DESC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      // let query = programUtamaModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere("(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)", { jenis: `%${jenis}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})
      let query = programUtamaModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)",
          { name: `%${search}%` },
        )
        .andWhere("is_deleted = :isDeleted", { isDeleted: false })
        .andWhere("properties ->> 'status' = :status", { status: "true" });
      if (jenis) {
        query = query.andWhere(
          "(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)",
          { jenis: `%${jenis}%` },
        );
      } else {
        const jenis = await jenisProgramModel.find({
          where: {
            is_active: true,
            is_deleted: false,
          },
        });
        const nameList = jenis.map((item) => {
          return item.name;
        });
        query = query.andWhere(
          "(properties ->> 'jenis' IN (:...nameList) OR properties ->> 'jenis' IS NULL)",
          { nameList },
        );
      }
      if (req.query.is_active !== undefined) {
        query = query.andWhere("status = :status", {
          isActive: req.query.status === "true",
        });
      }

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(sortColumn, sortType)
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
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  getProgramUtamaAdmin: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const jenis = req.query.jenis || "";
      const sortby = req.query.sortby || "created_at|DESC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      // let query = programUtamaModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere("(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)", { jenis: `%${jenis}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})
      let query = programUtamaModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)",
          { name: `%${search}%` },
        )
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });
      if (jenis) {
        query = query.andWhere(
          "(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)",
          { jenis: `%${jenis}%` },
        );
      } else {
        const jenis = await jenisProgramModel.find({
          where: {
            is_active: true,
            is_deleted: false,
          },
        });
        const nameList = jenis.map((item) => {
          return item.name;
        });
        query = query.andWhere(
          "(properties ->> 'jenis' IN (:...nameList) OR properties ->> 'jenis' IS NULL)",
          { nameList },
        );
      }
      if (req.query.is_active !== undefined) {
        query = query.andWhere("status = :status", {
          isActive: req.query.status === "true",
        });
      }

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(sortColumn, sortType)
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
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  updateProgramUtama: async (req, res) => {
    try {
      const { id } = req.params;
      const { properties } = req.body;

      const programUtama = await programUtamaModel.findOneBy({
        id: id,
        is_deleted: false,
      });

      if (!programUtama) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Program Utama tidak ditemukan",
          data: null,
        });
      }

      await programUtamaModel.update(
        { id: id },
        {
          properties: properties,
        },
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Program Utama berhasil diupdate",
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
  deleteProgramUtama: async (req, res) => {
    try {
      const { id } = req.params;

      const programUtama = await programUtamaModel.findOneBy({
        id: id,
        is_deleted: false,
      });

      if (!programUtama) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Program Utama tidak ditemukan",
          data: null,
        });
      }

      await programUtamaModel.update(
        { id: id },
        {
          is_deleted: true,
        },
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Program Utama berhasil dihapus",
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
  getListProgramUtamaVideo: async (req, res) => {
    try {
      const result = await programUtamaModel
        .createQueryBuilder("program")
        // .where("program.properties -> 'fitur' @> :fitur", { fitur: '["video"]' })
        // .andWhere("program.is_deleted = false")
        .where("program.is_deleted = false")
        .andWhere("program.properties ->> 'status' = :status ", {
          status: true,
        })
        .orderBy("program.id", "DESC")
        .getMany();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses ambil data Program Utama",
        data: result,
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
  getProgramUtamaById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await programUtamaModel.findOneBy({ id });

      if (!result) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Program Utama tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses",
        data: result,
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
  getProgramKu: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis } = req.query;

      const dataTransaksi = await transaksiModel.find({
        where: {
          user_id: id,
          jenis: jenis,
          status: "success",
        },
        // ✅ valid_until hanya diambil jika Program Utama
        select:
          jenis === "Program Utama"
            ? ["program_id", "valid_until"]
            : ["program_id"],
      });

      const ids = dataTransaksi.map((item) => Number(item.program_id));

      // ✅ Map hanya dibuat untuk Program Utama
      const validUntilMap = {};
      if (jenis === "Program Utama") {
        dataTransaksi.forEach((item) => {
          validUntilMap[Number(item.program_id)] = item.valid_until;
        });
      }

      let result;
      if (jenis === "Program Utama") {
        result = await programUtamaModel.find({
          where: { id: In(ids) },
          order: { created_at: "DESC" },
        });

        // ✅ Tambah valid_until hanya untuk Program Utama
        result = result.map((item) => ({
          ...item,
          valid_until: validUntilMap[Number(item.id)] ?? null,
        }));
      }

      if (jenis === "Tryout") {
        result = await tryoutModel.find({
          where: { id: In(ids) },
          order: { created_at: "DESC" },
        });
      }

      if (jenis === "Kelas Online") {
        result = await kelasModel.find({
          where: { id: In(ids) },
          order: { created_at: "DESC" },
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses",
        data: result,
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
};
