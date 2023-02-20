const http = require("http")
const express = require("express")
const app = express()
const cors = require("cors")
const router = express.Router()
const cookieParser = require("cookie-parser")
const expressSession = require("express-session")
const multer = require("multer")
const fs = require("fs")

const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
process.env.PORT = 3003
app.set("port", process.env.PORT || 3001)

app.use(cookieParser())
app.use(
    expressSession({
        secret: "my key",
        resave: true,
        saveUninitialized: true,
    })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
app.use("/uploads", express.static(__dirname + "/uploads"))

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "uploads")
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "_" + file.originalname)
    },
})

let upload = multer({
    storage: storage,
    limit: {
        files: 10,
        fileSize: 1024 * 1024 * 1024,
    },
})

/////// router -------
var messages = []
app.get("/recieve", function (req, resp) {
    if (req.query.size >= messages.length) {
        resp.end()
    } else {
        var res = {
            total: messages.length,
            messages: messages.slice(req.query.size),
        }
        resp.end(JSON.stringify(res))
    }
})
app.get("/send", function (req, res) {
    messages.push({
        sender: req.query.sender,
        message: req.query.message,
    })
    res.end()
})

let count = 0
let responseData = {}

router.route("/count").get((req, res) => {
    count++
    let date = new Date()
    responseData = {
        cnt: count,
        dateStr: `${date.getFullYear()}-${
            date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${String(
            date.getSeconds()
        ).padStart(2, "0")}`,
        date: date,
    }
    res.end(JSON.stringify(responseData))
})

router.route("/count/:cnt").get((req, res) => {
    // 전역변수 count와 파라미터로 전달된 값이 다르면 responseData 반환
    let { cnt } = req.params
    if (count !== Number(cnt)) {
        res.end(JSON.stringify(responseData))
    } else {
        res.end()
    }
})

router.route("/process/photo").post(upload.array("photo", 1), (req, res) => {
    console.log("POST - /process/photo 호출 ...")
    console.log(req.files)

    res.end("file upload!")
})

router.route("/home").get((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" })
    res.write("<h1>길동이의 홈페이지</h1>")
    res.end()
})

io.sockets.on("connection", (socket) => {
    // console.log("socket connected!")
    // console.dir(socket);

    socket.emit("news", "hello world!")
    socket.on("Hello", (data) => {
        console.log("client : ", data)
    })

    // 접속된 모든 소켓에 전달
    io.sockets.emit("this", { will: "be received by everyone" })

    // private msg - 소켓 매개변수 이용
    // 객체를 받을 때
    // socket.on("private message", (obj) => {
    //     console.log(`from:${obj.from} \nmsg:${obj.msg}`)
    // })

    socket.on("private message", (from, msg) => {
        console.log(`from: ${from} \nmsg: ${msg}`)
    })
})

app.use("/", router)

/////// error handler -----
var expressErrorHandler = require("express-error-handler")
var errorHandler = expressErrorHandler({
    static: {
        404: "./public/404.html",
    },
})
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

server.listen(app.get("port"), () => {
    console.log("Node.js 서버 실행 중 ... http://localhost:" + app.get("port"))
})

////////// socket.io Event Handler
