const conndb = require("../configs/database");
const ExcelJS = require("exceljs");

const tryoutModel = conndb.getRepository(require("../entities/tryoutEntity"));
const jenisProgramModel = conndb.getRepository(
  require("../entities/jenisTOEntity"),
);

module.exports = {
  createTO: async (req, res) => {
    try {
      await tryoutModel.insert({
        properties: req.body,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Tryout berhasil disimpan",
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
  updateTO: async (req, res) => {
    try {
      const { id } = req.params;
      const cekTO = await tryoutModel.findOne({
        where: {
          id: id,
        },
      });

      if (!cekTO) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Tryout tidak ditemukan",
          data: null,
        });
      }

      await tryoutModel.update(
        { id: id },
        {
          properties: req.body,
        },
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Tryout berhasil di perbaharui",
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
  deleteTO: async (req, res) => {
    try {
      const { id } = req.params;
      const cekTO = await tryoutModel.findOne({
        where: {
          id: id,
        },
      });

      if (!cekTO) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Tryout tidak ditemukan",
          data: null,
        });
      }

      await tryoutModel.update(
        { id: id },
        {
          is_deleted: true,
        },
      );

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Tryout berhasil di delete",
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
  getTryout: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const jenis = req.query.jenis || "";
      const sortby = req.query.sortby || "created_at|DESC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      // let query = programUtamaModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere("(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)", { jenis: `%${jenis}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})
      let query = tryoutModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'judul') LIKE LOWER(:judul) OR properties ->> 'judul' IS NULL)",
          { judul: `%${search}%` },
        )
        .andWhere("properties ->> 'status' = 'true'")
        .andWhere("is_deleted = :isDeleted", { isDeleted: false })
        .andWhere(
          "(properties ->> 'aktiUntil' IS NULL OR properties ->> 'aktiUntil' = '' OR (properties ->> 'aktiUntil')::date >= CURRENT_DATE)",
        );
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
        query = query.andWhere("properties ->> 'status' = :status", {
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
        message: "Sukses load Tryout",
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
  adminTryout: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const jenis = req.query.jenis || "";
      const sortby = req.query.sortby || "created_at|DESC";

      const sortColumn = sortby.split("|")[0];
      const sortType = sortby.split("|")[1].toUpperCase();

      // let query = programUtamaModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere("(LOWER(properties ->> 'jenis') LIKE LOWER(:jenis) OR properties ->> 'jenis' IS NULL)", { jenis: `%${jenis}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})
      let query = tryoutModel
        .createQueryBuilder()
        .where(
          "(LOWER(properties ->> 'judul') LIKE LOWER(:judul) OR properties ->> 'judul' IS NULL)",
          { judul: `%${search}%` },
        )
        // .andWhere("properties ->> 'status' = 'true'")
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
        query = query.andWhere("properties ->> 'status' = :status", {
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
        message: "Sukses load Tryout",
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
  exportNilaiTryout: async (req, res) => {
    try {
      const { tryout_id } = req.params;

      const repo = conndb.getRepository("AnswerUser");

      const rows = await repo
        .createQueryBuilder("a")
        .where("a.program_id = :tryout_id", { tryout_id })
        .andWhere("a.jenis = :jenis", { jenis: "Tryout" })
        .andWhere("a.is_deleted = false")
        .orderBy("a.total_skor", "DESC")
        .getMany();

      if (rows.length === 0) {
        return res.status(200).json({
          status: 200,
          message: "Belum ada user yang mengerjakan tryout ini",
        });
      }

      // ✅ Buat workbook Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Nilai Tryout");

      // Ambil judul tryout dari data pertama
      const judulTryout =
        rows[0]?.properties?.data_soal?.title || `Tryout ${tryout_id}`;

      // Header kolom
      worksheet.columns = [
        { header: "No", key: "no", width: 6 },
        { header: "Nama", key: "nama", width: 25 },
        { header: "Username", key: "username", width: 20 },
        { header: "Email", key: "email", width: 28 },
        { header: "No. WhatsApp", key: "no_wa", width: 18 },
        // { header: "Provinsi", key: "provinsi", width: 15 },
        // { header: "Kota/Kabupaten", key: "kota_kab", width: 18 },
        { header: "Pendidikan", key: "tingkat_pend", width: 14 },
        { header: "Total Skor", key: "total_skor", width: 13 },
        { header: "Dikerjakan Pada", key: "created_at", width: 22 },
      ];

      // Style header — merah sesuai warna primary
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCB1E0E" }, // #cb1e0e
        };
        cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          bottom: { style: "thin", color: { argb: "FFAF0011" } },
        };
      });
      worksheet.getRow(1).height = 28;

      // Isi data baris
      rows.forEach((row, idx) => {
        const detail = row.properties?.detail_user || {};
        const dataRow = worksheet.addRow({
          no: idx + 1,
          nama: detail.name || "-",
          username: detail.username || "-",
          email: detail.email || "-",
          no_wa: detail.no_wa || "-",
          // provinsi: detail.provinsi || "-",
          // kota_kab: detail.kota_kab || "-",
          tingkat_pend: detail.tingkat_pend || "-",
          total_skor: row.total_skor ?? 0,
          created_at: row.created_at
            ? new Date(row.created_at).toLocaleString("id-ID")
            : "-",
        });

        // Warna baris selang-seling
        if (idx % 2 === 0) {
          dataRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFAE9E7" }, // #fae9e7 (color-third)
            };
          });
        }

        // Highlight skor tertinggi (rank 1) dengan warna emas
        if (idx === 0) {
          dataRow.getCell("total_skor").font = {
            bold: true,
            color: { argb: "FFB45309" },
          };
        }

        dataRow.alignment = { vertical: "middle" };
      });

      // Freeze baris header
      worksheet.views = [{ state: "frozen", ySplit: 1 }];

      // Nama file
      const pad = (n) => String(n).padStart(2, "0");
      const now = new Date();
      const timestamp =
        now.getFullYear() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        pad(now.getHours()) +
        pad(now.getMinutes());

      const safeJudul = judulTryout.replace(/[^a-zA-Z0-9_\- ]/g, "").trim();
      const filename = `Nilai_${safeJudul}_${timestamp}.xlsx`;

      // Set header response
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

      await workbook.xlsx.write(res);
      return res.end();
    } catch (error) {
      console.error("exportNilaiTryout error:", error);
      return res.status(500).json({
        status: 500,
        message: "Gagal mengekspor nilai tryout",
      });
    }
  },
};
