const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.LogInAuthorization = async (req, res, next) =>{
  const rawToken = req.headers.authorization
  if(!rawToken){
    return res.status(401).json({message: "Unauthorized", authorized: false});
  }
  try{
    const token = rawToken.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verify;
    
   const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found", authorized: false });
    }

    req.user.name = user.name;
    req.user.email = user.email;
    next();
  }catch(error){
res.status(500).json({"error": error, authorized: false});
  }
}
