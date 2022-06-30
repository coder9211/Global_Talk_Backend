const express = require("express") 
const env = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app = express()
const dbConnection = require("./database/dbConnection")
const socketServer = require("./socket_server/socketServer")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
const userRouter = require("./router/userRouter")

// environment variables 
env.config() 

// database connection
dbConnection() 

// using cors in backend
app.use(cors({ origin: true, credentials: true }))

app.use(cookieParser())

// using express.json for json 
app.use(express.json())

app.use("/api",userRouter)

const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
})

// socket server
socketServer(server)