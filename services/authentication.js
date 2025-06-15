const jwt=require('jsonwebtoken');
const secret="Moura@3rankl!n"
function generateToken(user) {
    const payload={
        _id:user._id,
        email:user.email,
        profileImage:user.profileImage,
        role:user.role
    };
    const token=jwt.sign(payload,secret)
    return token;
}
const validateToken=(token)=>{
    const payload=jwt.verify(token,secret)
    return payload;
}
module.exports={generateToken,validateToken};