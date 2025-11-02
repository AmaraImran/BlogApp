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
router.post('/', upload.single('coverimage'), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).send("All fields are required");
    }
    if (!req.user) {
      return res.status(401).send("You must be logged in");
    }

    const blog = await blogModel.create({
      title,
      body,
      coverimage: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user._id,
    });

    console.log("Blog created:", blog);
    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("Error while creating blog:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.post('/comment/:blogId',async(req,res)=>{

  await commentModel.create({
    content:req.body.content,
    blogId:req.params.blogId,
    createdBy:req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`);
})
module.exports = router;
