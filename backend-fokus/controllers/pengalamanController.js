const { ILike } = require("typeorm");
const conndb = require("../configs/database");

const pengalamanModel = conndb.getRepository(require("../entities/pengalamanEntity"))

module.exports={
    addPengalamanPost:async (req, res) => {
        try {
            const { judul, deskripsi, imageUrl, link } = req.body;

            await pengalamanModel.save(
                {
                    judul: judul,
                    deskripsi: deskripsi,
                    imageUrl:imageUrl,
                    link:link,
                    created_at: new Date(Date.now()),
                    updated_at: new Date(Date.now())
                }
            )
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Instagram post berhasil disimpan',
                data: []
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                    error: error
                }
            )
        }
    },
    getPengalamanPosts:async (req, res) => {
        try {
            const result = await pengalamanModel.find(
                {
                    order: { created_at: "DESC" },
                    take: 4
                }
            )
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Instagram post berhasil diambil',
                data: result
            })
        } catch (error) {
            return res.status(500).json(
                {
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                    error: error
                }
            )
        }
    },
    getAllPengalaman: async (req, res) => {
        try {
        let { page , limit, search  } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        // COUNT TOTAL DATA
        const whereCondition = search 
            ? { judul: ILike(`%${search}%`) }
            : {};


        // COUNT
        const count = await pengalamanModel.count({
            where: whereCondition
        });


        // DATA + PAGINATION
        const data = await pengalamanModel.find({
            where: whereCondition,
            order: { created_at: "DESC" },
            take: limit,
            skip: skip
        });

        const totalPage = Math.ceil(count / limit);

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Sukses load pengalaman",
            data: {
            nextPage: page < totalPage,
            prevPage: page > 1,
            page,
            totalPage,
            totalData: count,
            data,
            },
        });
        } catch (error) {
            console.log(error)
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal server error",
            error,
        });
        }
    },
    updatePengalaman: async (req, res) => {
    try {
      const { id } = req.params;
      const { judul, deskripsi, imageUrl, link, is_active } = req.body;

      const pengalaman = await pengalamanModel.findOne({ where: { id } });

      if (!pengalaman) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Data tidak ditemukan",
        });
      }

      pengalaman.judul = judul ?? pengalaman.judul;
      pengalaman.deskripsi = deskripsi ?? pengalaman.deskripsi;
      pengalaman.imageUrl = imageUrl ?? pengalaman.imageUrl;
      pengalaman.link = link ?? pengalaman.link;
      pengalaman.is_active = is_active ?? pengalaman.is_active;
      pengalaman.updated_at = new Date();

      await pengalamanModel.save(pengalaman);

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Pengalaman berhasil diupdate",
        data: pengalaman,
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
  updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            const pengalaman = await pengalamanModel.findOne({ where: { id } });
            if (!pengalaman) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Data tidak ditemukan"
                });
            }

            pengalaman.is_active = is_active;
            pengalaman.updated_at = new Date(Date.now());

            await pengalamanModel.save(pengalaman);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Status berhasil diperbarui",
                data: pengalaman
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error
            });
        }
    },
    deletePengalaman: async (req, res) => {
        try {
            const { id } = req.params;

            const pengalaman = await pengalamanModel.findOne({ where: { id } });
            if (!pengalaman) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "Data tidak ditemukan"
                });
            }

            await pengalamanModel.delete({ id });

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Pengalaman berhasil dihapus",
            });

        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error
            });
        }
    }

}