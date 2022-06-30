const mongoose = require("mongoose")
const env = require("dotenv")
env.config() 
async function dbConnection() {
    try{
        await mongoose.connect(process.env.MONGO_DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            sslValidate: false
        })
        console.log("Database Connection")
    }catch(err){
        console.log(err)
    }
}

module.exports = dbConnection