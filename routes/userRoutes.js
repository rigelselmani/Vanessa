const express = require("express"),
      router  = express.Router(),
      passport=require("passport");
      User    =require("../models/User");


router.get("/register",async (req,res)=>{
    res.render("Register")
})
router.post("/register",async(req,res)=>{
    const {username,password}=req.body;
    const user = new User({username});
    const registeredUser = await User.register(user,password);
    console.log(registeredUser);


    // const hash = await bcrypt.hash(password,12);
    // const user = new User({
    //     username,
    //     password:hash
    // })
    // await user.save();
    // req.session.user_id = user._id;
    res.redirect("/");
})

//Login route
router.get("/login",async(req,res)=>{
    res.render("Login")
})
router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}), async(req,res)=>{
  res.redirect("/")


// const user = await User.findOne({username})
// if(user===null){
//    res.redirect("/login")
// }else{
//   const validPassword = await bcrypt.compare(password,user.password)
//   if(!validPassword){
//     res.redirect("/login")
//   }else if(validPassword){
//     console.log(req.session.user_id);
//     req.session.user_id =user._id;
//     res.redirect("/");
//   }
// }
})

//Log out route

router.post("/logout", (req,res)=>{
    req.session.user_id===null
    res.redirect("/");
 })


 module.exports = router;