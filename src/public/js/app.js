const socket = io()

const header = document.querySelector("header")
const room = document.querySelector("#room")
const chat = document.querySelector("#chat")
const nickName = document.querySelector("#nickname")
const box = document.querySelector("#box")
const title = document.querySelector(".login-wrapper > h1")
const newForm = document.getElementById("login-form")
const chatting = chat.querySelector("form")

header.hidden = true
chat.hidden = true

const saveNickname = () => {
    room.hidden = false
}

const sendMessage = (msg, nickname) => {
    const someone = document.createElement("div")
    someone.innerText = nickname
    someone.style.fontSize = "13px"
    someone.style.color = "black"

    const msgBox = document.createElement("div")
    const msgLine = document.createElement("div")

    msgBox.className = "msgBox"
    msgLine.className = "msgLine"

    msgBox.innerText = msg
    msgBox.style.display = "inline-block"

    msgLine.style.color = "white"

    msgLine.append(someone)
    msgLine.append(msgBox)

    box.append(msgLine)
    box.scrollTop = box.scrollHeight
}

const sendNotice = (msg) => {
    const div = document.createElement("div")

    div.innerText = msg
    div.style.backgroundColor = "#118bee"
    div.style.color = "#f1f1f1"
    div.style.marginTop = "5px"
    div.style.marginBottom = "5px"

    div.style.textAlign = "center"

    box.append(div)
    box.scrollTop = box.scrollHeight
}

const sendMyMessage = (msg) => {
    const me = document.createElement("div")
    me.innerText = "me"
    me.style.fontSize = "13px"
    me.style.color = "black"

    const msgBox = document.createElement("div")
    const msgLine = document.createElement("div")

    msgBox.className = "msgBox"
    msgLine.className = "msgLine"

    msgBox.innerText = msg
    msgBox.style.display = "inline-block"
    msgBox.style.border = "0"
    msgBox.style.backgroundColor = "#118bee"
    msgLine.style.textAlign = "right"
    msgLine.style.color = "white"

    msgLine.append(me)
    msgLine.append(msgBox)

    box.append(msgLine)
    box.scrollTop = box.scrollHeight
}

const handleSendMessage = (e) => {
    e.preventDefault()

    const msg = chatting.querySelector("input")
    socket.emit("message", msg.value, sendMessage)
    msg.value = ""
    box.scrollTop = box.scrollHeight
}

const handleSendMyMessage = (e) => {
    e.preventDefault()

    const msg = chatting.querySelector("input")
    socket.emit("message", msg.value, sendMyMessage)
    msg.value = ""
    box.scrollTop = box.scrollHeight
}

const showRoom = (_roomName) => {
    chat.hidden = false
    title.hidden = true
    newForm.hidden = true

    const roomNameHeader = chat.querySelector("h2")
    roomNameHeader.innerText = `Room - ${_roomName}`

    chatting.querySelector("input").focus()

    chatting.addEventListener("submit", handleSendMyMessage)
}

const handleNewForm = (e) => {
    e.preventDefault()
    console.log()

    socket.emit("nickname", nickName.value, saveNickname)
    socket.emit("room", room.value, showRoom)
}
newForm.addEventListener("submit", handleNewForm)

socket.on("greeting", (nickname) => {
    sendNotice("Someone has joined")

    // sendMessage(`${nickname} has joined`)
})

socket.on("goodbye", (nickname) => {
    sendNotice("Someone has left")

    // sendMessage(`${nickname} has left`)
})

socket.on("sendMessage", sendMessage)
