const express =require("express");
const app=express();

app.set('view engine', 'ejs');

app.get("/",function(req,res){
    res.render("Home")
});

app.get("/collections",function(req,res){
    res.render("Collections")
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