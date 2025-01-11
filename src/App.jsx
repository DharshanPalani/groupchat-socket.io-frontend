import { useState } from "react";
import { io } from "socket.io-client";
import Chat from "./component/Chat";

import "./css/tailwind.css";

function App() {
  const socket = io(
    "https://groupchat-socket-io-backend.vercel.app/"
  );
  // const socket = io("http://localhost:3001");

  const [username, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [inputValues, setInputValues] = useState({ username: "", room: "" });
  const [isJoined, setIsJoined] = useState(false);

  const joinRoom = () => {
    if (inputValues.username !== "" && inputValues.room !== "") {
      setUserName(inputValues.username);
      setRoom(inputValues.room);

      socket.emit("join_room", {
        username: inputValues.username,
        room: inputValues.room,
      });
      setIsJoined(true);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-900'>
      <div className='flex flex-col items-start gap-8 p-8 bg-gray-800 rounded-lg shadow-xl w-[400px]'>
        <h1 className='text-white text-3xl font-semibold text-center mb-6'>
          Join a room
        </h1>

        <input
          type='text'
          placeholder='Username'
          value={inputValues.username}
          onChange={(event) =>
            setInputValues({ ...inputValues, username: event.target.value })
          }
          className={`p-3 bg-gray-700 text-white rounded-md w-full mb-4 transition-all duration-300 ease-in-out ${isJoined ? "cursor-not-allowed bg-gray-600" : ""
            }`}
          readOnly={isJoined}
        />

        <input
          type='text'
          placeholder='Room name'
          value={inputValues.room}
          onChange={(event) =>
            setInputValues({ ...inputValues, room: event.target.value })
          }
          className={`p-3 bg-gray-700 text-white rounded-md w-full mb-6 transition-all duration-300 ease-in-out ${isJoined ? "cursor-not-allowed bg-gray-600" : ""
            }`}
          readOnly={isJoined}
        />

        <button
          onClick={joinRoom}
          disabled={isJoined}
          className={`w-full py-3 px-4 font-semibold text-lg text-white rounded-lg transition-all duration-300 ease-in-out ${isJoined
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {isJoined ? "Joined" : "Click to join"}
        </button>
      </div>
      <Chat socket={socket} username={username} room={room} />
    </div>
  );
}

export default App;
