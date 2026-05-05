const { Like, ILike } = require("typeorm");
const conndb = require("../configs/database");

const voucherModel = conndb.getRepository(require("../entities/voucherEntity"))
const userModel = conndb.getRepository(require("../entities/usersEntity"))
const settingModel = conndb.getRepository(require("../entities/settingEntity"))
const transaksiModel = conndb.getRepository(require("../entities/transaksiProgramEntity"))
const reedemModel = conndb.getRepository(require("../entities/reedemEntity"))

module.exports ={
    createVoucher:async (req, res) => {
        try {
            const {nama, nilai, tipe, tanggal} = req.body
            await voucherModel.insert({
                name:nama,
                nilai:nilai,
                tipe:tipe,
                valid:tanggal
            })

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil menambah voucher',
                    data:null
                }
            )
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                data: error.message,
            });
        }
    },
    updateVoucher:async (req, res) => {
        try {
            const {id, nama, nilai, tipe, tanggal} = req.body

            const data= await voucherModel.findOne({where:{
                id:id
            }})

            if(!data){
                return res.status(404).json(
                    {
                        status:404,
                        success:false,
                        message:'Tidak bisa update data',
                        data:null
                    }
                )
            }
            await voucherModel.update({id:id},{
                name:nama,
                nilai:nilai,
                tipe:tipe,
                valid:tanggal
            })

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil update voucher',
                    data:null
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                data: error.message,
            });
        }
    },
    deleteVoucher:async (req, res) => {
        try {
            const {id} = req.body

            const data= await voucherModel.findOne({where:{
                id:id
            }})

            if(!data){
                return res.status(404).json(
                    {
                        status:404,
                        success:false,
                        message:'Tidak bisa update data',
                        data:null
                    }
                )
            }
            await voucherModel.update({id:id},{
                is_deleted:true
            })

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil update voucher',
                    data:null
                }
            )
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                data: error.message,
            });
        }
    },
    getVoucher: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
            const search = req.query.search || "";
            const sortby = req.query.sortby || "created_at|DESC";

            const sortColumn = sortby.split("|")[0];
            const sortType = sortby.split("|")[1].toUpperCase();

            const [result, count] = await voucherModel.findAndCount({
            where: search ? { name: ILike(`%${search}%`), is_deleted:false } : {is_deleted:false},
            take: limit,
            skip: offset,
            order: { [sortColumn]: sortType },
            });

            const totalPage = Math.ceil(count / limit);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Sukses load Voucher",
                data: {
                    nextPage: page < totalPage,
                    prevPage: page > 1,
                    page,
                    totalPage,
                    totalData: count,
                    data: result,
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
    cekVoucher: async (req, res) => {
        try {
            const { name } = req.body;
            let result = 0;
            let tipe='';

            // 1. Cek di userModel
            const userVoucher = await userModel.findOne({
                where: { referal: name }
            });

            if (userVoucher) {
                const setting = await settingModel.findOne({
                    where:{},
                    order: { created_at: "DESC" }
                });

                if (setting && setting.referal && name !== req.detailUser.referal) {
                    result = setting.referal;
                    tipe="REFERAL"
                }
            } else {
            // 2. Jika tidak ada di user, cek di voucherModel
                const voucher = await voucherModel.findOne({
                    where: { name:name }
                });

                if (voucher && voucher.nilai) {
                    result = voucher.nilai;
                    tipe="VOUCHER"
                }
            }

            // 3. Return hasil
            console.log(name !== req.detailUser.referal)
            return res.status(200).json({
                status: 200,
                success: true,
                message: result > 0 ? `${tipe} valid`:`${tipe} tidak valid`,
                data: {
                    nilai:result,
                    tipe:tipe
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },
    getReferalCode:async (req, res) => {
        try {
            const { voucherCode } = req.params;

            const result = await transaksiModel.query(
                `SELECT COUNT(*) AS jumlah
                FROM transaksi_program
                WHERE properties::json->>'voucherCode' = $1`,
                [voucherCode]
            );

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Sukses count Voucher",
                data: {
                    voucherCode:voucherCode,
                    jumlah:Number(result[0].jumlah) || 0
                }
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },
    addPengajuanReferal:async (req, res) => {
        try {
            const result = await reedemModel.insert({
                email:req.body.email,
                jumlah_pengajuan:req.body.jumlah_pengajuan,
                jumlah_total:req.body.jumlah_total,
                kode:req.body.kode,
                nama:req.body.nama,
                sisa:req.body.sisa,
                detail_user:req.body.detail_user, 
                status:req.body.status
            })
            if(!result){
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: "Gagal pengajuan",
                    data:null
                });
            }

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil melakukan pengajuan',
                    data:null
                }
            )
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    },
    getPengajuan: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const page = parseInt(req.query.page) || 1;
            const offset = (page - 1) * limit;
            const search = req.query.search || "";
            const sortby = req.query.sortby || "created_at|DESC";

            const [sortColumn, sortType] = sortby.split("|");

            const query = reedemModel
            .createQueryBuilder("redeem")
            .where("redeem.is_deleted = false");

            if (search) {
            query.andWhere(
                `(redeem.nama ILIKE :search OR redeem.email ILIKE :search OR redeem.kode ILIKE :search)`,
                { search: `%${search}%` }
            );
            }

            query.orderBy(`redeem.${sortColumn}`, sortType.toUpperCase());

            query.skip(offset).take(limit);

            const [result, count] = await query.getManyAndCount();

            const totalPage = Math.ceil(count / limit);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Sukses load referal",
                data: {
                    nextPage: page < totalPage,
                    prevPage: page > 1,
                    page,
                    totalPage,
                    totalData: count,
                    data: result,
                },
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal server error",
            error: error.message
            });
        }
    },
    getReferralStatsByCode: async (req, res) => {
        try {
            const { kode } = req.params;

            if (!kode) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Kode referral wajib diisi",
            });
            }

            // Ambil semua data berdasarkan kode
            const data = await reedemModel.find({
            where: {
                kode,
                is_deleted: false
            },
            order: {
                created_at: "DESC"
            }
            });

            if (!data || data.length === 0) {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Tidak ada pengajuan untuk kode ini",
                data: {
                kode,
                totalData: 0,
                totalPengajuan: 0,
                totalJumlah: 0,
                totalSisa: 0,
                users: []
                }
            });
            }

            // Hitung total jumlah_pengajuan
            const totalPengajuan = data.reduce(
            (acc, item) => acc + (item.jumlah_pengajuan || 0),
            0
            );

            // Hitung total jumlah_total
            const totalJumlah = data.reduce(
            (acc, item) => acc + (item.jumlah_total || 0),
            0
            );

            // Hitung total sisa
            const totalSisa = data.reduce(
            (acc, item) => acc + (item.sisa || 0),
            0
            );

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Berhasil menghitung total referral",
                data: {
                    kode,
                    totalData: data.length,
                    totalPengajuan,
                    totalJumlah,
                    totalSisa,
                    users: data, // opsional jika butuh detail list pengajuan
                }
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
    updateStatusPengajuan: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "ID pengajuan wajib diisi",
            });
            }

            if (!status) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Status wajib diisi",
            });
            }

            // Ambil data pengajuan
            const pengajuan = await reedemModel.findOne({
            where: { id, is_deleted: false }
            });

            if (!pengajuan) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Pengajuan tidak ditemukan",
            });
            }

            // Update field
            pengajuan.status = status;

            // Jika butuh update sisa / logika lain, bisa tambah disini
            // contoh:
            // if (status === "Diterima") pengajuan.sisa = pengajuan.sisa;

            await reedemModel.save(pengajuan);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Status pengajuan berhasil diperbarui",
                data: pengajuan,
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