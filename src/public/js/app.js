const socket = io()

const header = document.querySelector("header")
const room = document.querySelector("#room")
const chat = document.querySelector("#chat")
const nickName = document.querySelector("#nickname")
const box = document.querySelector("#box")

const title = document.querySelector(".login-wrapper > h1")

const newForm = document.getElementById("login-form")

// let roomName = room.querySelector("form")
const chatting = chat.querySelector("form")
// const nicknameForm = nickName.querySelector("form")

header.hidden = true
chat.hidden = true
// room.hidden = true

const handleRoomName = (e) => {
    e.preventDefault()

    const input = roomName.querySelector("input")
    roomName = input.value

    // socket.emit("room", { payload: input.value }, showRoom)
    socket.emit("room", input.value, showRoom)
}

const saveNickname = () => {
    room.hidden = false
}

const sendMessage = (msg) => {
    const ul = chat.querySelector("ul")
    const li = document.createElement("li")

    li.innerText = msg
    li.style.listStyle = "none"
    ul.appendChild(li)
    box.appendChild(ul)
    box.scrollTop = box.scrollHeight
}

const sendNotice = (msg) => {
    const ul = chat.querySelector("ul")
    const li = document.createElement("li")
    const div = document.createElement("div")

    div.innerText = msg
    div.style.backgroundColor = "#118bee"
    div.style.color = "#ffffff"
    li.style.listStyle = "none"
    li.style.textAlign = "center"
    li.appendChild(div)
    ul.appendChild(li)
    box.appendChild(ul)
    box.scrollTop = box.scrollHeight
}

const sendMyMessage = (msg) => {
    const ul = chat.querySelector("ul")
    const li = document.createElement("li")

    li.innerText = msg
    li.style.listStyle = "none"
    li.style.textAlign = "right"
    ul.appendChild(li)
    box.appendChild(ul)
}

const handleNickName = (e) => {
    e.preventDefault()

    socket.emit("nickname", nick, saveNickname)
}

// roomName.addEventListener("submit", handleRoomName)
// nicknameForm.addEventListener("submit", handleNickName)

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
    console.log(box.scrollHeight)
    box.scrollTop = box.scrollHeight
}

const showRoom = (_roomName) => {
    chat.hidden = false
    title.hidden = true
    newForm.hidden = true

    const roomNameHeader = chat.querySelector("h2")
    roomNameHeader.innerText = `Room - ${_roomName}`

    chatting.querySelector("input").focus()
    // chatting.addEventListener("submit", handleSendMessage)

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
    box.scrollTop = box.scrollHeight
    // sendMessage(`${nickname} has joined`)
})

socket.on("goodbye", (nickname) => {
    sendNotice("Someone has left")
    box.scrollTop = box.scrollHeight
    // sendMessage(`${nickname} has left`)
})

socket.on("sendMessage", sendMessage)
