const socket = io()

const room = document.querySelector("#room")
const chat = document.querySelector("#chat")
let roomName = room.querySelector("form")
const chatting = chat.querySelector("form")

chat.hidden = true

const showRoom = (userRoomName) => {
    room.hidden = true
    chat.hidden = false

    const roomNameHeader = chat.querySelector("h2")
    roomNameHeader.innerText = `Room - ${roomName}`
}

const handleRoomName = (e) => {
    e.preventDefault()

    const input = roomName.querySelector("input")
    roomName = input.value

    socket.emit("room", { payload: input.value }, showRoom)
}

roomName.addEventListener("submit", handleRoomName)
