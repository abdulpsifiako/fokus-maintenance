const { get } = require("@dotenvx/dotenvx");
const conndb = require("../configs/database");

const fasilitatorModel= conndb.getRepository(require("../entities/fasilitatorEntity"));
module.exports={
    createFasilitator: async (req, res) => {
        try {
            const { name, jobdesk, image, properties } = req.body;
            if (!name || !jobdesk || !image) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Name, jobdesk, and image are required',
                    data:null
                });
            }

            await fasilitatorModel.save(
                {
                    name:name,
                    jobdesk: jobdesk,
                    image: image,
                    properties: properties,
                    created_at: new Date(),
                    updated_at: new Date(),
                    is_active: true,
                    is_deleted: false,
                    status: true
                }
            );

            return res.status(201).json({
                status: 201,
                success: true,
                message: 'Fasilitator created successfully',
                data: null
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },
    getAllFasilitator:async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 12
            const page = parseInt(req.query.page) || 1
            const offset = (page-1) *limit
            const search = req.query.search || ""
            const sortby = req.query.sortby || "created_at|DESC"

            const sortColumn = sortby.split('|')[0] 
            const sortType = sortby.split('|')[1].toUpperCase()
            
            const [data, count] = await fasilitatorModel.createQueryBuilder().where("(LOWER(name) LIKE LOWER(:name) OR name IS NULL)", { name: `%${search}%` })
                    .andWhere('is_active = :isActive', {isActive:true})
                    .andWhere('is_deleted = :isDeleted',{isDeleted:false}).take(limit).skip(offset).orderBy(sortColumn, sortType).getManyAndCount()
            
            
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
    updateFasilitator:async (req, res) => {
        try {
            const { id } = req.params;
            const { name, jobdesk, image, properties } = req.body;

            if (!name || !jobdesk || !image) {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Name, jobdesk, and image are required',
                    data: null
                });
            }

            const fasilitator = await fasilitatorModel.findOne({ where: { id: id, is_deleted: false } });
            
            if (!fasilitator) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Fasilitator not found',
                    data: null
                });
            }

            fasilitator.name = name;
            fasilitator.jobdesk = jobdesk;
            fasilitator.image = image;
            fasilitator.properties = properties;
            fasilitator.updated_at = new Date();

            await fasilitatorModel.save(fasilitator);

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fasilitator updated successfully',
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
    updateStatusFasilitator:async (req, res) => {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            if (typeof is_active !== "boolean") {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Status required',
                    data: null
                });
            }

            const fasilitator = await fasilitatorModel.findOne({ where: { id: id, is_deleted: false } });
            
            if (!fasilitator) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Fasilitator not found',
                    data: null
                });
            }

            fasilitator.is_active = is_active;
            fasilitator.updated_at = new Date();

            await fasilitatorModel.save(fasilitator);

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fasilitator updated successfully',
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
    deleteFasilitator: async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id)
            const fasilitator = await fasilitatorModel.findOne({ where: { id: id, is_deleted: false } });
            
            if (!fasilitator) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: 'Fasilitator not found',
                    data: null
                });
            }

            fasilitator.is_deleted = true;
            fasilitator.updated_at = new Date();

            await fasilitatorModel.save(fasilitator);

            return res.status(200).json({
                status: 200,
                success: true,
                message: 'Fasilitator deleted successfully',
                data: null
            });
        } catch (error) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
}