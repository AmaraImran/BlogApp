require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const { checkforauthenticationToken } = require('./middlewares/authentication');
const blog = require('./models/blog');

const app = express();

// MongoDB
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));

app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(checkforauthenticationToken("token"));

// Routes
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

// Views
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Home route
app.get('/', async (req, res) => {
  try {
    const allblogs = await blog.find({}).sort({ createdAt: -1 });
    res.render('home', {
      user: req.user,
      blogs: allblogs
    });
  } catch (error) {
    console.error("Error loading home:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

const Port = process.env.PORT || 8000;
app.listen(Port, () => {
  console.log(`🚀 Server running on port ${Port}`);
});
