import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import "../css/tailwind.css";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  });

  return (
    <div className='w-[800px] h-[600px] bg-[#2c2f33] rounded-xl shadow-lg flex flex-col overflow-hidden text-white ml-96'>
      <div className='bg-[#23272a] text-white p-3 text-lg font-bold border-b border-[#1e2124] flex items-center justify-between'>
        <button
          className='bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-400'
          onClick={reloadPage}
        >
          Exit
        </button>
        <p>{room === "" ? "Chat" : room}</p>
      </div>
      <div className='flex-1 p-3 overflow-y-auto flex flex-col'>
        <ScrollToBottom className='flex flex-col gap-4'>
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className={`flex ${
                  username === messageContent.author
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                } max-w-[70%] gap-4 mb-4`}
                id={username === messageContent.author ? "you" : "other"}
              >
                {/* Profile pic for others' messages */}
                {username !== messageContent.author && (
                  <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs'>
                    {/* Profile Pic Placeholder */}
                    <img
                      src={`https://api.dicebear.com/6.x/avataaars/png?seed=${messageContent.author}`}
                      alt='profile-pic'
                      className='w-10 h-10 rounded-full'
                    />{" "}
                    {/* Placeholder using the first letter of the user namea */}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-lg bg-[#2c2f33] bg-opacity-80 ${
                    username === messageContent.author
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  } max-w-[85%]`}
                >
                  <div className='text-sm text-white leading-relaxed mb-2'>
                    {messageContent.message}
                  </div>
                  <div className='text-xs text-[#b9bbbe] flex gap-2'>
                    <p>{messageContent.time}</p>
                    <p>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='flex p-3 bg-[#23272a] border-t border-[#1e2124] items-center'>
        <input
          type='text'
          value={currentMessage}
          placeholder='Send a message'
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          className='flex-1 p-3 rounded-full bg-[#40444b] text-white text-sm outline-none'
        />
        <button
          onClick={sendMessage}
          className='bg-[#5865f2] text-white p-2.5 rounded-full ml-2 hover:bg-[#4752c4] focus:outline-none'
        >
          &#9658;
        </button>
      </div>
    </div>
  );
}

export default Chat;
