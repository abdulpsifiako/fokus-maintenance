const conndb = require("../configs/database");
const syaratKetentuanEntity = require("../entities/syaratKetentuanEntity")
const kenaliKamiEntity = require("../entities/kenaliKamiEntity")
const kebijakanPrivasiEntity = require("../entities/kebijakanPrivasiEntity")

const syaratKetentuanModel = conndb.getRepository(syaratKetentuanEntity)
const kenaliKamiModel = conndb.getRepository(kenaliKamiEntity)
const kebijakanPrivasiModel = conndb.getRepository(kebijakanPrivasiEntity)
const bannerModel = conndb.getRepository(require("../entities/bannerEntity"))
const instagramModel = conndb.getRepository(require("../entities/instagramEntity"))
module.exports={
    termCondition:async (req, res) => {
        try {
            const { term } = req.body;

            await syaratKetentuanModel.save(
                {
                    properties:{
                        term: term
                    },
                    created_at:new Date(Date.now()),
                    is_active:true
                }
            )
            return res.status(200).json({
                status:200,
                success:true,
                message:'Syarat dan ketentuan berhasil disimpan',
                data:[]
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
    getTermAndCondition:async (req, res) => {
        try {
            const result = await syaratKetentuanModel.findOne({
                where: { is_active: true },
                order: { created_at: "DESC" },
            });
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses',
                data:result
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
    kenaliKami:async (req, res) => {
        try {
             const { kenali } = req.body;

            await kenaliKamiModel.save(
                {
                    properties:{
                        kenali: kenali
                    },
                    created_at:new Date(Date.now()),
                    is_active:true
                }
            )
            return res.status(200).json({
                status:200,
                success:true,
                message:'Kenali kami berhasil disimpan',
                data:[]
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
    getKenaliKami:async (req, res) => {
        try {
            const result = await kenaliKamiModel.findOne({
                where: { is_active: true },
                order: { created_at: "DESC" },
            });
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses',
                data:result
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
    privacyContent:async (req, res) => {
        try {
             const { privacy } = req.body;

            await kebijakanPrivasiModel.save(
                {
                    properties:{
                        privacy: privacy
                    },
                    created_at:new Date(Date.now()),
                    is_active:true
                }
            )
            return res.status(200).json({
                status:200,
                success:true,
                message:'Kebijakan privasi berhasil disimpan',
                data:[]
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
    getPrivacyContent:async (req, res) => {
        try {
            const result = await kebijakanPrivasiModel.findOne({
                where: { is_active: true },
                order: { created_at: "DESC" },
            });
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses',
                data:result
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
    addBannerImage:async (req, res) => {
        try {
            await bannerModel.save(
                {
                    url:req.body.url,
                }
            )
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses menyimpan banner image',
                data:[]
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
    getBannerImage:async (req, res) => {
        try {
            const result = await bannerModel.find(
                {
                    order:{id:"DESC"},
                    take:1,
                }
            )
            res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses menyimpan banner image',
                data:result
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
    addInstagramPost:async (req, res) => {
        try {
            const { judul, deskripsi, link, imageUrl } = req.body;

            await instagramModel.save(
                {
                    judul: judul,
                    deskripsi: deskripsi,
                    link: link,
                    imageUrl:imageUrl,
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
    getInstagramPosts:async (req, res) => {
        try {
            const result = await instagramModel.find(
                {
                    order: { created_at: "DESC" },
                    take: 3
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
    }
}