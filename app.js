const express       = require("express"),
      bodyParser    = require('body-parser'),
      request       = require('request'),
      app           = express(),
      methodOverride= require("method-override"),
      Nail          =require("./models/Nails"),
      User          =require("./models/User"),
      mongoose=require("mongoose"),
      bcrypt=require("bcrypt"),
      session =require("express-session");

    mongoose.connect('mongodb://localhost:27017/nail', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false}).then(res=>{
        console.log("DB Connected!")
    }).catch(err => {
    console.log(Error, err.message);
    })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(session({resave: true,saveUninitialized: true,secret:'notagoodsecret'}))

app.get("/",function(req,res){
    res.render("Home")
});

app.get("/collections",function(req,res){
    Nail.find({},function(err,allNails){
        if(err){
            console.log(err)
            console.log("here is the error")
        }else{
            res.render("Collections",{nails:allNails})
        }
    })
})

app.post("/collections",function(req,res){
    const name=req.body.name;
    const image=req.body.image;
    const description=req.body.description;

    const newNail={name:name,image:image,description:description}
    Nail.create(newNail,function(err,newNail){
        if(err){
            console.log(err)
        }else{
            res.redirect("/collections");
        }
    })
})
//New route 
app.get("/new",function(req,res){
    res.render("new")
})


//Edit nail route
app.get("/:id/edit",function(req,res){
    Nail.findById(req.params.id,function(err,foundNail){
        res.render("Edit",{nail:foundNail})
    })
})
//Update nail route
app.put("/collections/:id",function (req,res){
    Nail.findByIdAndUpdate(req.params.id,req.body.nail,function(err,updateNail){
        if(err){
            console.log(err)
            res.redirect("/")
        }else{
            res.redirect("/collections")
        }
    })
})

//Delete nail route
app.delete("/:id",function(req,res){
    Nail.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect("/collections")
        }
        res.redirect("/collections")
    })
})

//register route
app.get("/register",async (req,res)=>{
    res.render("Register")
})
app.post("/register",async(req,res)=>{
    const {password,username}=req.body;
    const hash = await bcrypt.hash(password,12);
    const user = new User({
        username,
        password:hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect("/");
})

//Login route
app.get("/login",async(req,res)=>{
    res.render("Login")
})
app.post("/login",async(req,res)=>{
  const {username,password}=req.body;
  const user = await User.findOne({username})
  const validPassword = await bcrypt.compare(password,user.password)
  if(validPassword){
      req.session.user_id =user._id;
      res.redirect("/");
  }else{
      res.redirect("/login")
  }
})

//Log out route

app.post("/logout", (req,res)=>{
    req.session.user_id===null
    res.redirect("/");
 })

//Subscribtion logic get the users email.
app.post("/",function (req,res){
    var email=req.body.subscribe
    var data={
        members: [
            {email_address: email,
            status:"subscribed"
         }
        ]
    }

    var jsonData=JSON.stringify(data);

    var options = {
        url:'https://us4.api.mailchimp.com/3.0/lists/d12bda5c1d',
        method:"POST",
        headers: {
            "Authorization":"rigel1 4bc43a983fa50f8683b911e3b3e782b3-us4"
        },
        body: jsonData
    }
    request(options, function(error, response, body){
        if(error){
            res.sendFile(__dirname + "/failure.html");
            console.log("subscription not successful")
        }else{
            if(response.statusCode === 200){
                res.redirect("/");
                console.log("subscriptionsuccessful")
            }else{
                res.redirect("/")
                console.log("subscriptionsuccessful")
            }
        }
       });
})

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost 3000`)
  })