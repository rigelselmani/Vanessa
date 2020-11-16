const express        = require("express"),
      bodyParser     = require('body-parser'),
      app            = express(),
      methodOverride = require("method-override"),
      mongoose       =require("mongoose"),
      session        =require("express-session"),
      showRoutes     =require("./routes/showRoutes"),
      subscribeRoutes=require("./routes/subscribeRoute"),
      userRoutes     =require("./routes/userRoutes");

    mongoose.connect('mongodb://localhost:27017/nail', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false}).then(res=>{
        console.log("DB Connected!")
    }).catch(err => {
    console.log(Error, err.message);
    })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(session({resave: true,saveUninitialized: true,secret:'notagoodsecret'}))

app.use("/nails",showRoutes);
app.use("/nails",subscribeRoutes);
app.use("/",userRoutes);

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost 3000`)
  })