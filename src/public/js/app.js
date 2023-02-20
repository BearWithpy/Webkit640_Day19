const socket = io()

const room = document.querySelector("#room")
const chat = document.querySelector("#chat")
const nickName = document.querySelector("#nickname")

let roomName = room.querySelector("form")
const chatting = chat.querySelector("form")
const nicknameForm = nickName.querySelector("form")

chat.hidden = true
room.hidden = true

const handleRoomName = (e) => {
    e.preventDefault()

    const input = roomName.querySelector("input")
    roomName = input.value

    // socket.emit("room", { payload: input.value }, showRoom)
    socket.emit("room", input.value, showRoom)
}

const saveNickname = () => {
    room.hidden = false
    nickName.hidden = true
    chat.hidden = true

    roomName.querySelector("input").focus()
    roomName.addEventListener("submit", handleRoomName)
}

const sendMessage = (msg) => {
    const ul = chat.querySelector("ul")
    const li = document.createElement("li")

    li.innerText = msg
    li.style.listStyle = "none"
    ul.appendChild(li)
}

const sendMyMessage = (msg) => {
    const ul = chat.querySelector("ul")
    const li = document.createElement("li")

    li.innerText = msg
    li.style.listStyle = "none"
    li.style.textAlign = "right"
    ul.appendChild(li)
}

const handleNickName = (e) => {
    e.preventDefault()

    const input = nicknameForm.querySelector("input")
    const nick = input.value
    socket.emit("nickname", nick, saveNickname)
}

const handleSendMessage = (e) => {
    e.preventDefault()

    const msg = chatting.querySelector("input")
    socket.emit("message", msg.value, sendMessage)
    msg.value = ""
}

const handleSendMyMessage = (e) => {
    e.preventDefault()

    const msg = chatting.querySelector("input")
    socket.emit("message", msg.value, sendMyMessage)
    msg.value = ""
}

const showRoom = (_roomName) => {
    room.hidden = true
    chat.hidden = false
    nickName.hidden = true

    const roomNameHeader = chat.querySelector("h2")
    roomNameHeader.innerText = `Room - ${_roomName}`

    chatting.querySelector("input").focus()
    // chatting.addEventListener("submit", handleSendMessage)

    chatting.addEventListener("submit", handleSendMyMessage)
}

roomName.addEventListener("submit", handleRoomName)
nicknameForm.addEventListener("submit", handleNickName)

socket.on("greeting", (nickname) => {
    sendMessage("Someone has joined")
    // sendMessage(`${nickname} has joined`)
})

socket.on("goodbye", (nickname) => {
    sendMessage("Someone has left")
    // sendMessage(`${nickname} has left`)
})

socket.on("sendMessage", sendMessage)
