const{Schema,model}=require('mongoose');
const { string } = require('yup');
const blogSchema=new Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    coverimage:{type:String},
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
       
    },
},{timestamps:true});
const blogModel=model('blog',blogSchema);
module.exports=blogModel;