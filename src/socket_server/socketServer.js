const socket = require("socket.io")
const userCollection = require("../models/userCollection")

const socketServer = (server) => {
    console.log("Hello Socket")
    const io = socket(server, {
        cors: {
            origin: "http://localhost:3000"
        }
    })

    let obj = {}
    const socketIdSave = (userId, socketId) => {
        if (userId) {
            obj[userId] = socketId
            return obj
        }
    }

    const sendRequest = (friendId, userId) => { 
        return obj[friendId]
        // const userFind = await userCollection.findOne({ _id: userId })

        // if (userFind) {
        //     const friendFind = await userCollection.findOneAndUpdate({ _id: friendId }, {
        //         $pull: {
        //             "friendRequest": {
        //                 _id: userFind._id,
        //                 fullName: userFind.fullName,
        //                 email: userFind.email,
        //                 userName: userFind.userName
        //             }
        //         }
        //     })
        //     if(friendFind) return { friendFind, userFind }
        // }
    }

    io.on("connection", (socket) => {
        io.emit("welcome", "Welocome to the Global Talk!")

        socket.on("userInfo", userId => {
            console.log("Helo")
            const userObject = socketIdSave(userId, socket.id)
            console.log(userObject)
        })

        socket.on("friendRequest", (friendId, userId) => {
            const socketId = sendRequest(friendId, userId)
            // console.log(socketId)
            io.to(socketId).emit("giveRequest",`send a friend request`)
        })
    })
}

// crslBInm3EAv7650AAAD
// CiCVyzJafyznj7lzAAAe

module.exports = socketServer