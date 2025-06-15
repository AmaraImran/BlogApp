const { validateToken } = require("../services/authentication");

function checkforauthenticationToken(cookieName) {
    return(req,res,next)=>{
    const tokenvalue=req.cookies[cookieName];
    if(!tokenvalue){
         return next()
    }
    try {
        const payload=validateToken(tokenvalue);
        req.user=payload;
        console.log("User payload:", payload);
      
    }
    catch(error){}
    
   return next()


}
}
module.exports={checkforauthenticationToken};