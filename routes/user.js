const {Router}=require('express');
const router=Router();
const User=require('../models/user')
router.get('/signin',(req,res)=>{
   return res.render('signin')
});
router.get('/signup',(req,res)=>{
   res.render('signup')
})
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.loginWithEmailAndPassword(email, password);
    console.log("Generated token:", token);

    res.cookie("token", token, {
      httpOnly: true, // protects cookie from client-side JS
    });

    return res.redirect('/');  // ✅ redirect after setting cookie
  } catch (error) {
    console.error("Login error:", error);
    return res.render('signin', { error: "Invalid email or password" });
  }
});
router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    await User.create({
      fullname,
      email,
      password
    });
    res.redirect('/');
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send("Internal server error");
  }
});
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});
module.exports=router;