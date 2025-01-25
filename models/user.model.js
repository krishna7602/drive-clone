const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    },

    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    },

    password:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
    }
})


const user=mongoose.model('user',userSchema)

module.exports=user  


