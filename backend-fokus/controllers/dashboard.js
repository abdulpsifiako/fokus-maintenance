const { Not, Between } = require("typeorm");
const conndb = require("../configs/database");
const usersEntity = require("../entities/usersEntity");
const logEntity = require('../entities/logEntity')

const userModel= conndb.getRepository(usersEntity)
const logModel = conndb.getRepository(logEntity)
const settingModel = conndb.getRepository(require("../entities/settingEntity"))
const transaksiModel = conndb.getRepository(require("../entities/transaksiProgramEntity"))
module.exports={
    getJumlahUser:async (req, res) => {
        try {
            const data = await userModel.createQueryBuilder().where("role = :role",{role:"users"}).getCount()
            
             return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan jumlah pengguna',
                data:[{
                    count:data
                }]
            })
        } catch (error) {
            return res.status(500).json(
                {
                    status:500,
                    success:false,
                    message:'Internal server error',
                    error:error
                }
            )
        }
    },
    getJumlahPengunjung:async (req, res) => {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0); // 00:00:00.000

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999); // 23:59:59.999

            const data = await logModel.count({
                where:{
                    created_at:Between(startOfDay, endOfDay)
                }
            })
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan jumlah pengguna',
                data:[{
                    count:data
                }]
            })
        } catch (error) {
            return res.status(500).json(
                {
                    status:500,
                    success:false,
                    message:'Internal server error',
                    error:error
                }
            )
        }
    },
    getAllUser:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|DESC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase()
            
            const [data, count] = await userModel.createQueryBuilder().where("role = :role",{role:"users"}).andWhere("(LOWER(name) LIKE LOWER(:name) OR name IS NULL)", { name: `%${search}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false}).take(limit).skip(offset).orderBy(sortColumn, sortType).getManyAndCount()
            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan data pengguna',
                data:{
                    nextPage:nextPage,
                    prevPage:prevPage,
                    page:page,
                    totalPage: totalPage,
                    totalData:count,
                    data:data
                }
            })
        } catch (error) {
            return res.status(500).json(
                {
                    status:500,
                    success:false,
                    message:'Internal server error',
                    error:error
                }
            )
        }
    },
    getSetting:async (req, res) => {
        try {
            const result = await settingModel.findOne({
                where:{},
                order:{
                    created_at:'DESC'
                }
            })
            
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan setting',
                data:result
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    status:500,
                    success:false,
                    message:'Internal server error',
                    error:error
                }
            )
        }
    },
    updateSetting:async (req, res) => {
        try {
            const id = req.body.id

            await settingModel.update({id},{
                gmail:req.body.gmail,
                instagram:req.body.instagram,
                no_wa:req.body.no_wa,
                link_instagram:req.body.link_instagram,
                referal:req.body.referal,
                tiktok:req.body.tiktok,
                youtube:req.body.youtube
            })
            
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses memperbaharui setting',
                data:null
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json(
                {
                    status:500,
                    success:false,
                    message:'Internal server error',
                    error:error
                }
            )
        }
    },
    getCountTransaksi: async (req, res) => {
        try {
        
        const totalTransaksi = await transaksiModel.count();

        const totalProgramUtama = await transaksiModel.count({
            where: { jenis: "Program Utama" },
        });

        const totalTryout = await transaksiModel.count({
            where: { jenis: "Tryout" },
        });

        const totalKelasOnline = await transaksiModel.count({
            where: { jenis: "Kelas Online" },
        });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Berhasil mengambil data total transaksi",
            data: {
            totalTransaksi,
            totalProgramUtama,
            totalTryout,
            totalKelasOnline,
            },
        });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error: error.message,
            });
        }
    },
}