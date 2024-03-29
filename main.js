require('dotenv').config();
const express=require("express")
const mongoose=require("mongoose");
const session=require('express-session');
const user=require('./models/users')
const app=express();
const PORT=process.env.PORT || 4000;


mongoose.connect(process.env.DB_URI);
const db=mongoose.connection;
db.on('error',(error)=>console.log(error));
db.once('open',()=>console.log("connected to DB"));

// middlewares
app.use(express.urlencoded({extended:true})); 
app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false 
}));
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next()
});
app.use(express.static('uploads'))
// set template engine
app.set('view engine', 'ejs');




// app.get("/",(req,res)=>{
//     res.send("Hello");
// })

app.use("",require('./routes/routs'))

app.listen(PORT,()=>{
    console.log(`listening at https://localhost:${PORT}`)
})