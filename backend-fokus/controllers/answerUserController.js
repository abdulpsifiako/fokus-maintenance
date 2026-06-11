const conndb = require("../configs/database");

const answerUserModel = conndb.getRepository(require("../entities/answerUser"));

module.exports = {
  createAnswerUser: async (req, res) => {
    try {
      const { id } = req.detailUser;

      const { data_soal, data_answer, total_skor, program_id, jenis } =
        req.body;
      await answerUserModel.insert({
        user_id: id,
        jenis: jenis,
        program_id: program_id,
        properties: {
          data_soal: data_soal,
          data_answer: data_answer,
          detail_user: req.detailUser,
        },
        total_skor: total_skor,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil menyimpan jawaban",
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
  getAllAnswerByUser: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis, program_id, title, module_name } = req.body;

      const qb = answerUserModel
        .createQueryBuilder("answerUser")
        .where("answerUser.jenis = :jenis", { jenis })
        .andWhere("answerUser.program_id = :program_id", { program_id })
        .andWhere("answerUser.user_id = :id", { id })
        .andWhere("answerUser.properties -> 'data_soal' ->> 'title' = :title", {
          title,
        });

      if (jenis !== "Tryout") {
        qb.andWhere(
          "answerUser.properties -> 'data_soal' ->> 'module_name' = :module_name",
          { module_name },
        );
      }

      const result = await qb.orderBy("answerUser.created_at", "DESC").getOne();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil mengambil jawaban",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error,
      });
    }
  },
  getAnswerById: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { answer_id } = req.body;
      const result = await answerUserModel
        .createQueryBuilder("answerUser")
        .where("answerUser.id = :answer_id", { answer_id: Number(answer_id) })
        .andWhere("answerUser.user_id = :id", { id })
        .orderBy("answerUser.created_at", "DESC")
        .getOne();
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil menyimpan jawaban",
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
  getAllRaporByUser: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis, title, module_name } = req.body;
      const result = await answerUserModel.query(
        `
               SELECT
                    *
                FROM "answer_user" AS "answerUser"
                WHERE
                    "answerUser".user_id = $1
                    AND "answerUser".properties -> 'data_soal' ->> 'jenis' = $2
                    AND "answerUser".properties -> 'data_soal' ->> 'title' = $3
                    AND "answerUser".properties -> 'data_soal' ->> 'module_name' = $4
                ORDER BY
                    "answerUser".created_at DESC
                LIMIT 10;
                `,
        [id, jenis, title, module_name],
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil mendapat jawaban",
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
  getRangkingTO: async (req, res) => {
    try {
      const userId = req.detailUser.id;
      const { jenis, title, id } = req.body;

      // 🟢 Ambil hanya 1 data terbaru per user berdasarkan program_id, jenis, dan title
      const result = await answerUserModel.query(
        `
                WITH latest_answer AS (
                    SELECT DISTINCT ON (au."user_id")
                        au.id,
                        au.user_id,
                        au.total_skor,
                        au.created_at,
                        au.properties,
                        au.program_id
                    FROM "answer_user" AS au
                    WHERE
                        au.program_id = $1
                        AND au.properties -> 'data_soal' ->> 'jenis' = $2
                        AND au.properties -> 'data_soal' ->> 'title' = $3
                        AND au.is_deleted = false
                    ORDER BY au."user_id", au.created_at DESC
                ),
                ranked AS (
                    SELECT
                        la.*,
                        RANK() OVER (ORDER BY la.total_skor DESC, la.created_at ASC) AS rank
                    FROM latest_answer la
                )
                SELECT *
                FROM ranked
                ORDER BY rank
                LIMIT 30;
                `,
        [id, jenis, title],
      );

      const userRank = await answerUserModel.query(
        `
                WITH latest_answer AS (
                    SELECT DISTINCT ON (au."user_id")
                        au.user_id,
                        au.total_skor,
                        au.created_at
                    FROM "answer_user" AS au
                    WHERE
                        au.program_id = $1
                        AND au.properties -> 'data_soal' ->> 'jenis' = $2
                        AND au.properties -> 'data_soal' ->> 'title' = $3
                        AND au.is_deleted = false
                    ORDER BY au."user_id", au.created_at DESC
                ),
                ranked AS (
                    SELECT
                        la.user_id,
                        la.total_skor,
                        RANK() OVER (ORDER BY la.total_skor DESC, la.created_at ASC) AS rank
                    FROM latest_answer la
                )
                SELECT *
                FROM ranked
                WHERE ranked.user_id::text = $4;
                `,
        [id, jenis, title, userId],
      );

      // 🟣 Ambil total peserta (untuk info "ranking x dari y")
      const totalPeserta = await answerUserModel.query(
        `
                SELECT COUNT(DISTINCT user_id) AS total
                FROM "answer_user"
                WHERE
                    program_id = $1
                    AND properties -> 'data_soal' ->> 'jenis' = $2
                    AND properties -> 'data_soal' ->> 'title' = $3
                    AND is_deleted = false;
                `,
        [id, jenis, title],
      );

      const statusCount = await answerUserModel.query(
        `
                WITH latest_answer AS (
                    SELECT DISTINCT ON (au."user_id")
                        au."user_id",
                        au.properties -> 'data_soal' ->> 'keterangan' AS keterangan
                    FROM "answer_user" AS au
                    WHERE
                        au.program_id = $1
                        AND au.properties -> 'data_soal' ->> 'jenis' = $2
                        AND au.properties -> 'data_soal' ->> 'title' = $3
                        AND au.is_deleted = false
                    ORDER BY au."user_id", au.created_at DESC
                )
                SELECT
                    COUNT(*) FILTER (WHERE keterangan ILIKE 'lulus') AS jumlah_lulus,
                    COUNT(*) FILTER (WHERE keterangan ILIKE 'tidak lulus') AS jumlah_tidak_lulus
                FROM latest_answer;
                `,
        [id, jenis, title],
      );

      const { jumlah_lulus, jumlah_tidak_lulus } = statusCount[0] || {};

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil mengambil ranking",
        data: {
          topRank: result,
          userRank: userRank[0] || null,
          totalPeserta: Number(totalPeserta[0]?.total || 0),
          jumlahLulus: Number(jumlah_lulus || 0),
          jumlahTidakLulus: Number(jumlah_tidak_lulus || 0),
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
  getCountLAtihanDikerjakan: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const result = await answerUserModel.query(
        `
                    SELECT DISTINCT ON ("answerUser".properties -> 'data_soal' ->> 'title')
                        *
                    FROM "answer_user" AS "answerUser"
                    WHERE
                        "answerUser".user_id = $1
                        AND "answerUser".properties -> 'data_soal' ->> 'jenis' = 'Program Utama'
                    ORDER BY
                        "answerUser".properties -> 'data_soal' ->> 'title',
                        "answerUser".created_at DESC;
                    `,
        [id],
      );
      console.log(result);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil load jumlah",
        data: {
          total: result.length,
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
  getAllAnswersByUser: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis } = req.body;
      const result = await answerUserModel.findOne({
        where: {
          jenis: jenis,
          user_id: id,
        },
        order: {
          created_at: "DESC",
        },
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil menyimpan jawaban",
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
