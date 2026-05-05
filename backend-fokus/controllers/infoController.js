const conndb = require("../configs/database");

const infoRepo = conndb.getRepository(require("../entities/infoEntity"));

// POST /api/info — tambah info baru (admin)
async function addInfo(req, res) {
  try {
    const { judul, deskripsi, tanggal, link } = req.body;

    if (!judul || !deskripsi) {
      return res.status(400).json({
        status: 400,
        message: "Judul dan deskripsi wajib diisi",
      });
    }

    const now = new Date();
    const info = infoRepo.create({
      judul,
      deskripsi,
      tanggal: tanggal || now.toISOString(),
      link: link || null,
      created_at: now,
      updated_at: now,
    });

    await infoRepo.save(info);

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Info berhasil ditambahkan",
      data: info,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
    });
  }
}

// GET /api/info/latest — ambil 1 info terakhir (publik)
async function getLatestInfo(req, res) {
  try {
    const info = await infoRepo.findOne({
      where: {},
      order: { created_at: "DESC" },
    });

    // Tidak ada data = kembalikan null (modal tidak muncul di frontend)
    if (!info) {
      return res.status(200).json({
        status: 200,
        message: "Tidak ada info",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Berhasil",
      data: info,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Terjadi kesalahan server",
    });
  }
}

module.exports = { addInfo, getLatestInfo };
