require('dotenv').config()
const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const cookieparser=require('cookie-parser')
const { checkforauthenticationToken } = require('./middlewares/authentication')
const blog=require('./models/blog')
const  app= express()
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Database connected successfully');
})
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(checkforauthenticationToken("token"))
app.use(express.static(path.join(__dirname, 'public')));
const userRoutes=require('./routes/user')
const blogRoutes=require('./routes/blog')
const { validateToken } = require('./services/authentication')
app.use('/user',userRoutes)
app.use('/blog',blogRoutes)

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
const Port=process.env.PORT||8000
app.get('/',async(req,res)=>{
const allblogs=await blog.find({}).sort('createdAt')
    res.render('home',{
        user:req.user,
        blogs:allblogs
    })
})
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})