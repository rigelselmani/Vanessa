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
            res.render("Collections",{nails:allNails})
        }
    })
})

router.post("/collections",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const description=req.body.description;

    const newNail={name:name,image:image,description:description}
    Nail.create(newNail,function(err,newNail){
        if(err){
            console.log(err)
        }else{
            res.redirect("/nails/collections");
        }
    })
})
//New route 
router.get("/new",function(req,res){
    res.render("new")
})


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
            res.redirect("/nails")
        }else{
            res.redirect("/nails/collections")
        }
    })
})

//Delete nail route
router.delete("/:id",function(req,res){
    Nail.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect("/nails/collections")
        }
        res.redirect("/nails/collections")
    })
})

//register route

module.exports = router;