const {Schema,model}=require('mongoose');
const {createHmac,randomBytes}=require('crypto');
const{generateToken}=require('../services/authentication')
const userSchema=new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        
    },
    password:{type:String,
         required:true},
         profileImage:{
            type:String,
            default:"/images/user.jpg"
         },
         role:{
            type:String,
            enum:['user','admin'],
            default:'user'
         }

},
{timestamps:true})
userSchema.pre('save',function (next){
    const user=this;
    if(!user.isModified('password')  )return
    const salt=randomBytes(16).toString('hex');
    const hashedpassword=createHmac('sha256',salt).update(user.password).digest("hex")
    this.salt=salt
    this.password=hashedpassword
    next()
})
userSchema.static('loginWithEmailAndPassword',async function(email,password){
    const user=await this.findOne({email})
    if(!user) return false;
    const providedpassword=createHmac('sha256',user.salt).update(password).digest('hex')
    const salt=user.salt
    const hashedpassword=user.password

if (hashedpassword!==providedpassword) throw new Error('Invalid email or password');

    const token=generateToken(user);
    return token
})

const userModel=model('user',userSchema);
module.exports=userModel;