const conndb = require("../configs/database");

const jenisProgramModel = conndb.getRepository(require("../entities/jenisProgramEntity"))
module.exports= {
    createJenisProgram : async (req, res) => {
        try {
            const {name} = req.body;
            await jenisProgramModel.save(
                {
                    name,
                    created_at:new Date(),
                    is_active:true
                }
            )
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Jenis program berhasil ditambah',
                data: null
            });
        } catch (error) {
           return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })
        }
    },
    updateJenisProgram:async (req, res) => {
        try {
            const {id} = req.params;
            const {name, is_active, is_deleted} = req.body;
            const jenisProgram = await jenisProgramModel.findOne({ where: { id:id } });
            if (!jenisProgram) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Jenis program tidak ditemukan',
                    data: null
                });
            }
            jenisProgram.name = name;
            jenisProgram.updated_at = new Date();
            jenisProgram.is_active = is_active ||false;
            jenisProgram.is_deleted = is_deleted || false;

            await jenisProgramModel.save(jenisProgram);
            
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Jenis program berhasil diperbarui',
                data: jenisProgram
            });
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'Internal server error',
                error: error
            }
        }
    },
    getJenisProgram: async (req, res) => {
        try {
            const { status } = req.query;

            let whereCondition = { is_deleted: false };

            if (status !== undefined) {
                whereCondition.is_active = status === "true";
            }
            
            const jenisPrograms = await jenisProgramModel.find({
                where: whereCondition,
                order: { created_at: 'DESC' }
            });
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Jenis program retrieved successfully',
                data: jenisPrograms
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal server error',
                error: error
            });
        }
    },
    deleteJenisProgram: async (req, res) => {
        try {
            const { id } = req.params;
            const jenisProgram = await jenisProgramModel.findOne({ where: { id } });
            if (!jenisProgram) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Jenis program tidak ditemukan',
                    data: null
                });
            }
            jenisProgram.is_deleted = true;
            jenisProgram.updated_at = new Date();
            await jenisProgramModel.save(jenisProgram);
            
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Jenis program berhasil dihapus',
                data: null
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal server error',
                error: error
            });
        }
    }
}