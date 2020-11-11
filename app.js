const express    =require("express"),
      bodyParser = require('body-parser'),
      mongoose   = require("mongoose"),
      request    = require('request'),
      app        =express();

mongoose.connect('mongodb://localhost:27017/nail', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false}).then(res=>{
    console.log("DB Connected!")
}).catch(err => {
console.log(Error, err.message);
})

var nailSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
})
const Nail=mongoose.model('Nail', nailSchema);

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.get("/",function(req,res){
    res.render("Home")
});

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

app.get("/collections",function(req,res){
    Nail.find({},function(err,allNails){
        if(err){
            console.log(err)
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

app.get("/about",function(req,res){
    res.render("about")
})

app.get("/new",function(req,res){
    res.render("new")
})
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost 3000`)
  })