const http = require("http")
const express = require("express")
const app = express()
const router = express.Router()

const server = http.createServer(app)
const WebSocket = require("ws")
const { PassThrough } = require("stream")
// const { Server } = require("socket.io")
// const io = new Server(server)

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))

// 어딘지 꼭 확인 할 것!!!!!!
// console.log(__dirname)

process.env.PORT = 3003
app.set("port", process.env.PORT || 3001)

// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

router.route("/").get((req, res) => res.render("home"))

app.use("/", router)

const webSocketServer = new WebSocket.Server({ server })

const sockets = []
const handleConnection = (socket) => {
    sockets.push(socket)
    socket.on("open", () => {
        console.log("Connected")
    })
    socket.on("message", (msg) => {
        msg = JSON.parse(msg)

        switch (msg.type) {
            case "newMessage":
                sockets.forEach((each) =>
                    each.send(`${socket.nickName}: ${msg.payload.toString()}`)
                )
                break
            case "nickName":
                socket["nickName"] = msg.payload
                break

            default:
                break
        }
    })
    socket.on("close", () => {
        console.log("Disconnected")
    })
    // socket.send("Hello This is server!!")
}

webSocketServer.on("connection", handleConnection)

server.listen(app.get("port"), () => {
    console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get("port"))
})
