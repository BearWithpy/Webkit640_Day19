const socket = new WebSocket(`ws://${window.location.host}`)

const msgList = document.querySelector("ul")
const nameForm = document.querySelector("#nickname")
const msgForm = document.querySelector("#message")

const JSONMessage = (type, payload) => {
    const message = { type, payload }
    return JSON.stringify(message)
}

socket.addEventListener("open", () => {
    console.log("Connected to server")
})

socket.addEventListener("close", () => {
    console.log("Disconnected to server")
})

socket.addEventListener("message", (msg) => {
    const li = document.createElement("li")
    li.innerText = msg.data
    msgList.append(li)
})

// setTimeout(() => {
//     socket.send("Hello I am browser")
// }, 10000)
const handleSubmit = (e) => {
    e.preventDefault()

    const input = msgForm.querySelector("input")
    socket.send(JSONMessage("newMessage", input.value))
    input.value = ""
}

const handleNicknameSubmit = (e) => {
    e.preventDefault()

    const nickname = nameForm.querySelector("input")
    socket["nickname"] = nickname.value

    socket.send(JSONMessage("nickName", socket["nickname"]))
    nickname.value = ""
}

msgForm.addEventListener("submit", handleSubmit)
nameForm.addEventListener("submit", handleNicknameSubmit)
