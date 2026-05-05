const conndb = require("../configs/database");

const videoModel = conndb.getRepository(require("../entities/videoEntity"));
const programInfo = conndb.getRepository(
  require("../entities/programUtamaEntity")
);
const latihanModel = conndb.getRepository(require("../entities/latihanEntity"));
module.exports = {
  createVideo: async (req, res) => {
    try {
      const { properties } = req.body;

      await videoModel.save({
        properties,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Data video berhasil ditambah",
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
  getListVideoProgramUtama: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const sortby = req.query.sortby || "created_at|ASC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      const programs = await programInfo
        .createQueryBuilder("program")
        .where("program.is_deleted = false")
        .getMany();

      const allowedNames = programs
        .map((p) => p.properties?.name)
        .filter(Boolean);

      // let query = programUtamaModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere("(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)", { jenis: `%${jenis}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})
      let query = videoModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'materi') LIKE LOWER(:materi) OR properties ->> 'materi' IS NULL)",
          { materi: `%${search}%` }
        )
        .andWhere("properties ->> 'program_name' IN (:...allowedNames)", {
          allowedNames,
        })
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });

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
        message: "Sukses load video",
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
  updateVideoProgram: async (req, res) => {
    try {
      const { id } = req.params;
      const { properties } = req.body;
      const program = await videoModel.findOne({ where: { id: id } });
      if (!program) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Program tidak ditemukan",
          data: null,
        });
      }
      program.properties = properties;
      program.updated_at = new Date();

      await videoModel.save(program);

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Program berhasil diperbarui",
        data: program,
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
  getInfoProgramFiturLatihan: async (req, res) => {
    try {
      const result = await programInfo
        .createQueryBuilder("program")
        .select(["program.id", "program.properties ->> 'name' as name"])
        // .where("program.properties -> 'fitur' @> :fitur", { fitur: '["latihan"]' })
        .andWhere("program.is_deleted = false")
        .andWhere("program.properties ->> 'status' = :status ", {
          status: true,
        })
        .getRawMany();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Program berhasil di load",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  getListMateri: async (req, res) => {
    try {
      const { program_id } = req.params;

      const result = await videoModel
        .createQueryBuilder("video")
        .select(["video.id as id", "video.properties ->> 'materi' as materi"])
        .where("properties ->> 'program_id' = :program_id", {
          program_id: program_id,
        })
        .getRawMany();

      if (result.length < 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Video tidak ditemukan",
          data: null,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Materi berhasil di load",
        data: result,
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
  getListSubMateri: async (req, res) => {
    try {
      const { program_id } = req.params;
      const result = await videoModel
        .createQueryBuilder("v")
        .select(["v.id as id", "v.properties -> 'video' as video"])
        .where("v.id = :id", { id: program_id })
        .getRawOne();
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Submateri berhasil di load",
        data: result,
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
  createLatihan: async (req, res) => {
    try {
      await latihanModel.save({
        properties: req.body,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Latihan berhasil disimpan",
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
  updateLatihan: async (req, res) => {
    try {
      const { id } = req.params;
      const latihan = await latihanModel.findOne({ where: { id: id } });

      if (!latihan) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Latihan tidak ditemukan",
          data: null,
        });
      }
      await latihanModel.update({ id }, { properties: req.body });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Latihan berhasil disimpan",
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
  getLatihanProgramUtama: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const programUtama = req.query.programUtama || "";
      const search = req.query.search || "";
      const sortby = req.query.sortby || "id|ASC";

      // Whitelist kolom sort
      const allowedSortColumns = [
        "id",
        "created_at",
        "updated_at",
        "properties->>'materi'",
      ];
      const [rawColumn, rawType] = sortby.split("|");

      const sortColumn = allowedSortColumns.includes(rawColumn)
        ? rawColumn
        : "id";
      const sortType = ["ASC", "DESC"].includes(rawType?.toUpperCase())
        ? rawType.toUpperCase()
        : "ASC";

      const programs = await programInfo
        .createQueryBuilder("program")
        .where("program.is_deleted = false")
        .getMany();

      const allowedNames = programs
        .map((p) => p.properties?.name)
        .filter(Boolean);

      let query = latihanModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'materi') LIKE LOWER(:materi) OR properties ->> 'materi' IS NULL)",
          {
            materi: `%${search}%`,
          }
        )
        .andWhere("properties ->> 'program_utama' IN (:...allowedNames)", {
          allowedNames,
        })
        .andWhere("is_deleted = :isDeleted", { isDeleted: false });

      if (programUtama) {
        query.andWhere("properties ->> 'program_utama' ILIKE :programUtama", {
          programUtama: `%${programUtama}%`,
        });
      }

      const [data, count] = await query
        .take(limit)
        .skip(offset)
        .orderBy(rawColumn, rawType)
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
  deleteLatihanProgramUtama: async (req, res) => {
    try {
      const { id } = req.params;

      const latihan = await latihanModel.findOneBy({
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

      await latihanModel.update(
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
  getVideobyId: async (req, res) => {
    try {
      const { program_id } = req.params;

      const result = await videoModel
        .createQueryBuilder("v")
        .select([
          "v.id",
          "v.created_at",
          "v.updated_at",
          "v.is_deleted",
          `jsonb_build_object(
                            'materi', v.properties ->> 'materi',
                            'program_id', v.properties ->> 'program_id',
                            'program_name', v.properties ->> 'program_name',
                            'status', v.properties ->> 'status',
                            'video', (
                                SELECT jsonb_agg(elem)
                                FROM jsonb_array_elements(v.properties -> 'video') elem
                                WHERE (elem ->> 'status')::boolean = true
                            )
                        ) as properties`,
        ])
        .where("v.properties ->> 'program_id' = :program_id", { program_id })
        .andWhere("v.properties ->> 'status' = :status", { status: "true" })
        .andWhere("v.is_deleted = false")
        .getRawMany();

      if (result.length < 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Video tidak ditemukan",
          data: null,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Materi berhasil di load",
        data: result,
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
  getLatihanById: async (req, res) => {
    try {
      const { program_id } = req.params;

      const result = await latihanModel.query(
        `
            SELECT 
                id,
                jsonb_build_object(
                'materi', properties->>'materi',
                'program_id', properties->>'program_id',
                'program_utama', properties->>'program_utama',
                'status', properties->>'status',
                'latihan', (
                    SELECT jsonb_agg(
                    jsonb_build_object(
                        'waktu', latihan_elem->>'waktu',
                        'kategori', latihan_elem->>'kategori',
                        'jumlahsoal', latihan_elem->>'jumlahsoal',
                        'submateri_name', latihan_elem->>'judul',
                        'status', latihan_elem->>'status',
                        'minPoin', latihan_elem->>'minPoin',
                        'datasoal', (
                            SELECT jsonb_agg(
                                jsonb_build_object(
                                'opsi', soal_elem->'opsi',
                                'pertanyaan', soal_elem->>'pertanyaan',
                                'pembahasan', soal_elem->>'pembahasan',
                                'kunci', soal_elem->>'kunci',
                                'submateri', soal_elem->>'submateri'
                                )
                            )
                        FROM jsonb_array_elements(latihan_elem->'datasoal') soal_elem
                        )
                    )
                    )
                    FROM jsonb_array_elements(properties->'latihan') latihan_elem
                    WHERE (latihan_elem->>'status')::boolean = true
                )
                ) AS latihan_data
            FROM latihan l
            WHERE properties->>'program_id' = $1 AND (properties->>'status')::boolean = true ORDER BY id ASC;
            `,
        [program_id]
      );
      if (result.length < 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Latihan Belum Ditambahkan",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Latihan berhasil di-load",
        data: result,
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
  deleteVideoProgramUtama: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await videoModel.update({ id: id }, { is_deleted: true });
      if (!result.affected || result.affected === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Video tidak ditemukan",
          data: null,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Video berhasil di hapus",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
};
