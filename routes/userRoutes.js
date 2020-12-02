const express = require("express"),
      router  = express.Router(),
      passport=require("passport");
      User    =require("../models/User");

//Register routes
router.get("/register",async (req,res)=>{
    res.render("Register")
})
router.post("/register",async(req,res)=>{
    const {username,password}=req.body;
    const user = new User({username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
      if(err)return next(err);
      req.flash("success","Welcome to yelp camp!");
      res.redirect("/");
    })


    // const hash = await bcrypt.hash(password,12);
    // const user = new User({
    //     username,
    //     password:hash
    // })
    // await user.save();
    // req.session.user_id = user._id;
   return res.redirect("/");
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

// router.post("/logout", (req,res)=>{
//     req.session.user_id===null
//     res.redirect("/");
//  })

router.get("/logout", (req,res)=>{
  req.logout();
  req.flash("success","Goodbye!")
  res.redirect("/")
})

 module.exports = router;