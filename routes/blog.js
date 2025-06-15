const {Router} = require('express');
const router = Router();
const multer=require('multer');
const blogModel=require('../models/blog');
const path = require('path');
const commentModel = require('../models/comments');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const filename=`${Date.now()}-${file.originalname}`;
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

router.get('/addnew',(req,res)=>{
  console.log(req.user);
    return res.render("addblogs",{
        user:req.user,
        
    });
})
router.get("/:id",async(req,res)=>{
  const blog=await blogModel.findById(req.params.id).populate("createdBy");
  const comments=await commentModel.find({blogId:req.params.id}).populate("createdBy");
  return res.render("blog",{
    blog,
    user:req.user,
    comments
  })
})
router.post('/',upload.single('coverimage'),async (req, res) => {
  const{title,body}=req.body;
  if(!title || !body){
    return res.status(400).send("All fields are required");
  }
  const blog=await blogModel.create({
    title,
    body,
    coverimage:`/uploads/${req.file.filename}`,
    createdBy:req.user._id
    
  })
  console.log(req.body)
  console.log(req.file)
  return res.redirect(`/blog/${blog._id}`);
}
)
router.post('/comment/:blogId',async(req,res)=>{

  await commentModel.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})
module.exports = router;
