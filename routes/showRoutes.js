const express = require("express"),
      router  = express.Router(),
      Nail    =require("../models/Nails");

router.get("/",function(req,res){
    res.render("Home")
});

router.get("/collections",function(req,res){
    Nail.find({},function(err,allNails){
        if(err){
            console.log(err)
            console.log("here is the error")
        }else{
            res.render("Collections",{nails:allNails,currentUser:req.user})
        }
    })
})

//New route 
router.post("/collections",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const description=req.body.description;

    const newNail={name:name,image:image,description:description}
    Nail.create(newNail,function(err,newNail){
        if(err){
            console.log(err)
        }else{
            req.flash("success","Successfully made a new Nail")
            res.redirect("/collections");
        }
    })
})
router.get("/new",function(req,res){
    res.render("new")
})


//SHOW MORE INFO ABOUT ONE NAIL
router.get("/nail/:id",function(req,res){
    //FIND THE NAIL WITH ID PROVIDED
   Nail.findById(req.params.id,function(err, foundNail){
      if(err){
          console.log(err)
      }else{
          res.render("Show",{nail:foundNail})
      }
   })
});

//Edit nail route
router.get("/:id/edit",function(req,res){
    Nail.findById(req.params.id,function(err,foundNail){
        res.render("Edit",{nail:foundNail})
    })
})
//Update nail route
router.put("/collections/:id",function (req,res){
    Nail.findByIdAndUpdate(req.params.id,req.body.nail,function(err,updateNail){
        if(err){
            console.log(err)
            res.redirect("")
        }else{
            req.flash("success","Successfully updated campground!")
            res.redirect("/collections")
        }
    })
})

//Delete nail route
router.delete("/:id",function(req,res){
    Nail.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect("/collections")
        }
        req.flash("success","Successfully deleted campground!")
        res.redirect("/collections")
    })
})

//register route

module.exports = router;