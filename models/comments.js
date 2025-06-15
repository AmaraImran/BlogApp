const{Schema, model} = require('mongoose');
const commentschema=new Schema({
    content:{type:String,required:true},
    createdBy:{type:Schema.Types.ObjectId,ref:'user',required:true},
    blogId:{
        type:Schema.Types.ObjectId,
        ref:'blog',
        required:true
    }
},{timestamps:true});
const commentModel = model('comment', commentschema);
module.exports = commentModel;