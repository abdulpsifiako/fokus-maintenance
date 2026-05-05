const conndb = require("../configs/database");

const programModel = conndb.getRepository(require("../entities/programEntity"))
const latihanModel = conndb.getRepository(require("../entities/latihanEntity"))
module.exports={
    createProgram: async (req, res) => {
        try {
            const {properties} = req.body;
            await programModel.save(
                {
                    properties
                }
            )
             return res.status(200).json({
                status: 200,
                success: true,
                message: 'Program berhasil ditambah',
                data: null
            });
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
    updateProgram:async (req, res) => {
        try {
            const {id} = req.params;
            const {properties, is_active} = req.body;
            const program = await programModel.findOne({ where: { id:id } });
            if (!program) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Program tidak ditemukan',
                    data: null
                });
            }
            program.properties = properties;
            program.updated_at = new Date();
            program.is_active = is_active ||false;

            await programModel.save(program);
            
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Program berhasil diperbarui',
                data: program
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
    getProgramLanding:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|ASC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase()

            let query = programModel.createQueryBuilder()
                        .where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` })
                        .andWhere('is_deleted = :isDeleted',{isDeleted:false})
                        .andWhere("properties ->> 'program_id' IS NOT NULL")

            if (req.query.is_active !== undefined) {
                query = query.andWhere("is_active = :isActive", {
                    isActive: req.query.is_active === "true",
                });
            }
            
            // const [data, count] = await query.take(limit).skip(offset).orderBy(`properties ->> '${sortColumn}'`, sortType).getManyAndCount()
            const [data, count] = await query.take(4).skip(offset).orderBy(sortColumn, sortType).getManyAndCount()
            
            
            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses load program',
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
    getPaketProgram:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|ASC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase()

            let query = programModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})

            if (req.query.is_active !== undefined) {
                query = query.andWhere("is_active = :isActive", {
                    isActive: req.query.is_active === "true",
                });
            }
            
            // const [data, count] = await query.take(limit).skip(offset).orderBy(`properties ->> '${sortColumn}'`, sortType).getManyAndCount()
            const [data, count] = await query.take(limit).skip(offset).orderBy(sortColumn, sortType).getManyAndCount()
            
            
            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses load program',
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
    getProgram:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|ASC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase()

            let query = programModel.createQueryBuilder().where("(LOWER(properties ->> 'name') LIKE LOWER(:name) OR properties ->> 'name' IS NULL)", { name: `%${search}%` }).andWhere('is_deleted = :isDeleted',{isDeleted:false})

            if (req.query.is_active !== undefined) {
                query = query.andWhere("is_active = :isActive", {
                    isActive: req.query.is_active === "true",
                });
            }
            
            // const [data, count] = await query.take(limit).skip(offset).orderBy(`properties ->> '${sortColumn}'`, sortType).getManyAndCount()
            const [data, count] = await query.take(limit).skip(offset).orderBy(sortColumn, sortType).getManyAndCount()
            
            
            const totalPage= Math.ceil(count/limit)
            const nextPage= page<totalPage
            const prevPage = page>1
            return res.status(200).json({
                status:200,
                success:true,
                message:'Sukses load program',
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
    deleteProgram: async (req, res) => {
        try {
            const {id} = req.params;
            const program = await programModel.findOne({ where: { id:id } });
            if (!program) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Program tidak ditemukan',
                    data: null
                });
            }
            program.is_deleted = true;
            program.updated_at = new Date();

            await programModel.save(program);
            
            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Program berhasil dihapus',
                data: null
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
    getCountLatihanSoal:async (req, res) => {
        try {
            const [result, count] = await latihanModel.findAndCount()
            
            const totalLatihan = result.reduce((total, item) => {
                return total + item.properties.latihan.length;
            }, 0);
            const totalSemuaSoal = result.reduce((total, item) => {
                const totalSoalPerLatihan = item.properties.latihan.reduce((subTotal, latihanItem) => {
                    return subTotal + latihanItem.datasoal.length;
                }, 0);
                return total + totalSoalPerLatihan;
            }, 0);

            return res.status(200).json({
                status: 200,
                success: true,
                message: "Latihan berhasil di-load",
                data: {
                    totalLatihan,
                    totalSemuaSoal
                },
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

}