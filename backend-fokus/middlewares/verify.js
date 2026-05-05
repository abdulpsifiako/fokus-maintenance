const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json(
        {
            status:401,
            success:false,
            message:'Token invalid/session telah berakhir',
            data:null
        }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_JWT); 
    req.detailUser = decoded;
    req.token = token
    next(); 
  } catch (error) {
    return res.status(403).json(
        {
            status:403,
            success:false,
            message:'Token invalid/session telah berakhir',
            data:null
        }
    )
  }
};

const isAdmin = async(req, res, next)=>{
  const {role} = req.detailUser
  if (role !== 'admin'){
    return res.status(403).json(
        {
            status:403,
            success:false,
            message:'Token invalid/session telah berakhir',
            data:null
        }
    )
  }
  next()
}

module.exports={verifyToken, isAdmin}