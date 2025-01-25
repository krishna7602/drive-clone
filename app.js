const express=require('express')
const app=express()
const userRouter=require('./routes/user.routes')
const dotenv=require('dotenv')
const connectToDB=require('./config/db')
const cookieParser=require('cookie-parser')
const indexRouter=require('./routes/index.route')
const fs = require('fs');
const path = require('path');
const router = express.Router();

dotenv.config();
connectToDB()



app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use('/',indexRouter)

app.set('view engine','ejs')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/user',userRouter)

app.listen('5000',()=>{
    console.log("server is running on port number 3000")
}) 