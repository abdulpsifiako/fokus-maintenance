const conndb = require("../configs/database")
const argon2 = require('argon2')
const userEntity = require("../entities/usersEntity")
const userModel = conndb.getRepository(userEntity)
module.exports={
    updatDetailUser:async (req, res) => {
        try {
            const {id, ...data} = req.body
            let updateData;
            if(data.password){
                updateData= {...data, password:await argon2.hash(data.password)}
            }else{
                updateData=data
            }
            delete updateData.confirmPassword

            const result = await userModel.update({id:id},updateData)

            if(result.affected != 1){
                return res.status(403).json(
                    {
                        status:403,
                        success:false,
                        message:'Tidak dapat melakukan update data',
                        data:null
                    }
                )
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Data berhasil diperbarui',
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
    deleteUser:async (req, res) => {
        try {
            const {id}= req.body
            const result = await userModel.update({id:id}, {is_deleted:true})
            if(result.affected != 1){
                return res.status(403).json(
                    {
                        status:403,
                        success:false,
                        message:'Tidak dapat menghapus user',
                        data:null
                    }
                )
            }
            return res.status(200).json({
                status:200,
                success:true,
                message:'Data berhasil dihapus',
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
    }
}