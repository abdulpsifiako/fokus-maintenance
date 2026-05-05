const { validationResult } = require("express-validator");
const conndb = require("../configs/database");

const usersModel = conndb.getRepository(require("../entities/usersEntity"));
module.exports={
    updateProfile:async (req, res) => {
        try {
            const error = validationResult(req)
            if(!error.isEmpty()){
                return res.status(405).json({
                    status:405,
                    success:false,
                    message:'Method not allowed',
                    error:error.array()
                })
            }
            const {id} = req.detailUser
            const { name, email, no_wa, tingkat_pend, provinsi, kota_kab, image, instagram } = req.body;
            const user = await usersModel.findOne({ where: { email:email, id:id } });
            if (!user) {
                return res.status(404).json({
                    status:404,
                    success:false,
                    message:'Tidak ada user dengan email tersebut',
                    data:null
                });
            }
            await usersModel.update(id, {
                name: name,
                email: email,
                no_wa: no_wa,
                tingkat_pend: tingkat_pend,
                provinsi: provinsi,
                kota_kab: kota_kab,
                image: image ||"",
                instagram: instagram
            });
            return res.status(200).json({
                status:200,
                success:true,
                message:'Profile berhasil diperbarui',
                data:[
                    {
                    id:id,
                    name:name,
                    email:email,
                    no_wa:no_wa,
                    tingkat_pend:tingkat_pend,
                    provinsi:provinsi,
                    kota_kab:kota_kab,
                    image:image,
                    instagram:instagram
                }
            ]
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status:500,
                success:false,
                message:'Internal server error',
                error:error
            })   
        }
    },
    getImageUrl:async (req, res) => {
        try {
            const result =await usersModel.findOne({
                where: { id: req.params.id },
                select: ['image']
            })
            if(!result ){
                return res.status(404).json(
                    {
                        status:404,
                        success:false,
                        message:'Tidak ditemukan data',
                        data:null
                    }
                )
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Url berhasil diambil',
                data:result.image
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
}