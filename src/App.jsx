import { useState } from "react"
import { io } from "socket.io-client"
import Chat from "./component/Chat"

import './css/tailwind.css'

function App() {
  const socket = io("https://groupchat-socketio-backend-production.up.railway.app/")

  const [username, setUserName] = useState("")
  const [room, setRoom] = useState("")

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="flex flex-col items-start gap-6 p-6 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-white text-2xl font-bold">Join a room</h1>
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => setUserName(event.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md w-64"
        />
        <input
          type="text"
          placeholder="Room name"
          onChange={(event) => setRoom(event.target.value)}
          className="p-2 bg-gray-700 text-white rounded-md w-64"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-64"
        >
          Click to join
        </button>
      </div>
      <Chat socket={socket} username={username} room={room} />
    </div>
  )
}

export default App
