const { MongoStore } = require("connect-mongo");

const express        = require("express"),
      bodyParser     = require('body-parser'),
      app            = express(),
      methodOverride = require("method-override"),
      mongoose       =require("mongoose"),
      session        =require("express-session"),
      flash          =require("connect-flash"),
      path           =require("path"),
      showRoutes     =require("./routes/showRoutes"),
      subscribeRoutes=require("./routes/subscribeRoute"),
      userRoutes     =require("./routes/userRoutes"),
      passport       = require("passport"),
      localStrategy  =require("passport-local"),
      MongoDBStore = require('connect-mongo')(session);
      User           =require("./models/User");
      require("dotenv").config();

      const localurl =process.env.DATABASE ||"mongodb://localhost/nail" 
    mongoose.connect(localurl,{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false}).then(res=>{
        console.log("DB Connected!")
    }).catch(err => {
    console.log(Error, err.message);
    })

    const secret = process.env.SECRET || 'notagoodsecret';

    const store = new MongoDBStore({
        url:localurl,
        secret,
        touchAfter: 24 *60 *60
    })
    
    store.on("error",function(e){
        console.log("session store error",e)
    })

const sessionConfig = {
    store,
    name:"session",
    secret,
    saveUninitialized: true,
    resave: true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge: 1000 *60*60*24*7
    }

}
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(session(sessionConfig))
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

const PORT =process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost ${PORT}`)
  });