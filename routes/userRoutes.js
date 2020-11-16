const express = require("express"),
      router  = express.Router(),
      bcrypt  =require("bcrypt"),
      User    =require("../models/User");


router.get("/register",async (req,res)=>{
    res.render("Register")
})
router.post("/register",async(req,res)=>{
    const {password,username}=req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password:hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/nails");
})

//Login route
router.get("/login",async(req,res)=>{
    res.render("Login")
})
router.post("/login",async(req,res)=>{
  const {username,password}=req.body;
  const user = await User.findOne({username})
  const validPassword = await bcrypt.compare(password,user.password)
  if(validPassword){
      req.session.user_id =user._id;
      res.redirect("/nails");
  }else{
      res.redirect("/nails/login")
  }
})

//Log out route

router.post("/logout", (req,res)=>{
    req.session.user_id===null
    res.redirect("/nails");
 })


 module.exports = router;