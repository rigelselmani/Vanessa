const express        = require("express"),
      bodyParser     = require('body-parser'),
      app            = express(),
      methodOverride = require("method-override"),
      mongoose       =require("mongoose"),
      session        =require("express-session"),
      flash          =require("connect-flash")
      showRoutes     =require("./routes/showRoutes"),
      subscribeRoutes=require("./routes/subscribeRoute"),
      userRoutes     =require("./routes/userRoutes"),
      passport       = require("passport"),
      localStrategy  =require("passport-local"),
      User           =require("./models/User");

    mongoose.connect('mongodb://localhost:27017/nail', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,useFindAndModify:false}).then(res=>{
        console.log("DB Connected!")
    }).catch(err => {
    console.log(Error, err.message);
    })

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(session({resave: true,saveUninitialized: true,secret:'notagoodsecret'}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser =req.user;
    res.locals.success = req.flash("success");
    res.locals.error =req.flash("error");
    next();
})

app.use("/",showRoutes);
app.use("/",subscribeRoutes);
app.use("/",userRoutes);

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost 3000`)
  })