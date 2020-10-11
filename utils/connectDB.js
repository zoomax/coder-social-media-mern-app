const mongoose = require("mongoose") ; 

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGOOSE_URI ,  { 
            useCreateIndex : true , 
            useUnifiedTopology : true, 
            useNewUrlParser : true
        })
        console.log("DB connected successfully") ; 
    } catch (error) {
        console.log(error.message) ; 
    }
}

module.exports = connectDB ; 