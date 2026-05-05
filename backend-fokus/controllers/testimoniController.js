const { Like } = require("typeorm");
const conndb = require("../configs/database")

const testimoniModel = conndb.getRepository(require("../entities/testimoniEntity"));
module.exports={
    addTestimoniUser:async (req, res) => {
        try {
            await testimoniModel.save(
                {
                    properties: req.body,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            )

            return res.status(200).json({
                status:200,
                success:true,
                message:'Testimoni berhasil dikirim',
                data:[]
            })
        } catch (error) {
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })
        }
    },
    getTestimony:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|DESC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase() 
            const [data, count] = await testimoniModel
                .createQueryBuilder("t")
                .where(
                    "(LOWER(t.properties ->> 'nama') ILIKE LOWER(:nama) OR t.properties ->> 'nama' IS NULL OR t.properties ->> 'nama' = '')",
                    { nama: `%${search}%` }
                    )
                .andWhere("t.is_deleted = false")
                .orderBy(`t.${sortColumn}`, sortType)
                .skip(offset)
                .take(limit)
                .getManyAndCount();

            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan testimoni user',
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
            console.log(error)
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })
        }
    },

    updateStatusTestimoni:async (req, res) => {
        try {
            const {id} = req.params
            const result = await testimoniModel.update(
                {id:id},
                {status:req.body.status }
            )
            if(result.affected <1){
                 return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Gagal update testimoni',
                    error:null
                })
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses update testimoni',
                data:null
            })  

        } catch (error) {
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })  
        }
    },
    dleteTestimoni:async (req, res) => {
        try {
            const {id} = req.params
            const result = await testimoniModel.update(
                {id:id},
                {is_deleted:true }
            )
            if(result.affected <1){
                 return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Gagal update testimoni',
                    error:null
                })
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses update testimoni',
                data:null
            })  

        } catch (error) {
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })  
        }
    },
    updateTestimoni:async (req, res) => {
        try {
            const {id} = req.params
            const result = await testimoniModel.update(
                {id:id},
                {properties:req.body}
            )
            if(result.affected <1){
                 return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Gagal update testimoni',
                    error:null
                })
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses update testimoni',
                data:null
            })  

        } catch (error) {
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })  
        }
    },
    getAllTestimoni:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|DESC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase() 
            const [data, count] = await testimoniModel
                .createQueryBuilder("t")
                .where(
                    "(LOWER(t.properties ->> 'nama') ILIKE LOWER(:nama) OR t.properties ->> 'nama' IS NULL OR t.properties ->> 'nama' = '')",
                    { nama: `%${search}%` }
                    )
                .andWhere("t.is_deleted = false")
                .andWhere("t.status= true")
                .orderBy(`t.${sortColumn}`, sortType)
                .skip(offset)
                .take(limit)
                .getManyAndCount();

            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses mendapatkan testimoni user',
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
            console.log(error)
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })
        }
    }   
}