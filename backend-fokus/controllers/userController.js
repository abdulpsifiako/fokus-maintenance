const { validationResult } = require("express-validator")
const conndb = require("../configs/database")
const argon2 = require("argon2")
const usersEntity = require("../entities/usersEntity")
const sendEmail = require("../helpers/mail")
const userModel = conndb.getRepository(usersEntity)

module.exports={
    getDetail:async (req, res) => {
        try {
            const {id} = req.detailUser
            const data = await userModel.findOne(
                {
                    where:{
                        id:id
                    }
                }
            )
            delete data.password            
            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Sukses',
                    data:[
                        {
                            detail:data,
                        }
                    ]
                }
            )
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
    getUserAvailable:async (req, res) => {
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
            const {username} = req.body
            const data = await userModel.findOne({
                where:{
                    username
                }
            })
            
            if (data !== null) {
                return res.status(403).json({
                    status: 403,
                    success: false,
                    message: 'Username tidak bisa digunakan',
                    data: null
                });
            }
            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Username bisa digunakan',
                    data:null
                }
            )
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
    updateDataUser:async (req, res) => {
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
            const {id} =req.detailUser
            const {
                namaLengkap,
                username,
                tingkatPend,
                prov,
                kabKota,
                noWa,
                instag
            } = req.body

            const updateData = await userModel.update({id:id},{
                provinsi:prov,
                instagram:instag,
                kota_kab:kabKota,
                username:username,
                name:namaLengkap,
                tingkat_pend:tingkatPend,
                no_wa:noWa
            })

            if(updateData.affected <1){
                 return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Gagal update Profil',
                    error:null
                })
            }

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Profil berhasil diperbaharui',
                    data:null
                }
            )
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
    updatePinUser:async (req, res) => {
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
            const {id} =req.detailUser
            const {
               pin
            } = req.body

            const updateData = await userModel.update({id:id},{
               pin:pin
            })

            if(updateData.affected <1){
                 return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Gagal update Profil',
                    error:null
                })
            }

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil memperbaharui pin',
                    data:null
                }
            )
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
    sentMailForgotPassword:async (req, res) => {
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
            const {email} = req.body
            const dataEmail= await userModel.findOne({
                where:{
                    email:email
                }
            })
            if(!dataEmail){
                return res.status(404).json({
                    status:404,
                    success:false,
                    message:'Email tidak ditemukan',
                    error:null
                })
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await sendEmail({
                to:email,
                subject:"One Time Password",
                template:"otp",
                context:{
                    otp:otp
                }
            })

            await userModel.update({id:dataEmail.id}, {pin:otp, expires_at:new Date(Date.now() + 5 * 60 * 1000)})
            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil mengirim OTP',
                    data:[
                        {
                            token:dataEmail.id,
                            email:dataEmail.email
                        }
                    ]
                }
            )
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
    cekOTPFOrgotPassword:async (req, res) => {
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

            const {
               otp,
               token
            } = req.body

            const data= await userModel.findOne(
                {
                    where:{
                        id:token,
                        pin:otp
                    }
                }
            )

            if(!data){
                return res.status(403).json({
                    status:403,
                    success:false,
                    message:'OTP/Token gagal',
                    error:null
                })
            }
            if(data.expires_at<new Date()){
                return res.status(403).json({
                    status:403,
                    success:false,
                    message:'OTP Sudah kadaluarsa, harap kirim ulang',
                    error:null
                })
            }

            return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Berhasil mencocokan OTP',
                    data:null
                }
            )
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
    updatePasswordUser:async (req, res) => {
        try {
            const { password, confirmPassword, token} = req.body
            if(password !== confirmPassword){
                return res.status(403).json({
                    status:403,
                    success:false,
                    message:'Harap periksa kembali masukan',
                    error:null
                })
            }
            const hashPassword = await argon2.hash(password)
            await userModel.update({id:token},{password:hashPassword})
             return res.status(200).json(
                {
                    status:200,
                    success:true,
                    message:'Password berhasil diubah',
                    data:null
                }
            )
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