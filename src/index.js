const http = require("http")
const express = require("express")
const app = express()
const router = express.Router()

const server = http.createServer(app)

const { Server } = require("socket.io")
const io = new Server(server)

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
router.route("/*").get((req, res) => res.redirect("/"))

app.use("/", router)

io.on("connection", (socket) => {
    socket.onAny((e) => {
        console.log("socket event: ", e)
    })

    socket.on("nickname", (nickname, saveNickname) => {
        socket["nickname"] = nickname
        saveNickname(nickname)
    })

    socket.on("room", (roomName, showRoom) => {
        socket.join(roomName)
        showRoom(roomName)

        socket.to(roomName).emit("greeting", socket["nickname"])

        socket.on("message", (msg, sendMessage) => {
            msg = `${msg}`
            socket
                .to(roomName)
                .emit(
                    "sendMessage",
                    msg,
                    socket["nickname"],
                    sendMessage(msg, socket["nickname"])
                )
        })
    })

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => {
            socket.to(room).emit("goodbye")
        })
    })
})

server.listen(app.get("port"), () => {
    console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get("port"))
})
