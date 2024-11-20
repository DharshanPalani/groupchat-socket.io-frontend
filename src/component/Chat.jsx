import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import '../css/tailwind.css'

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
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="w-[400px] h-[600px] bg-[#2c2f33] rounded-xl shadow-lg flex flex-col overflow-hidden text-white">
      <div className="bg-[#23272a] text-white p-3 text-center text-lg font-bold border-b border-[#1e2124]">
        <p>Chat</p>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col">
        <ScrollToBottom className="flex flex-col gap-4">
          {messageList.map((messageContent) => {
            return (
              <div
                className={`flex ${username === messageContent.author ? 'ml-auto flex-row-reverse' : 'mr-auto'} max-w-[70%] gap-2 mb-2`} id={username === messageContent.author ? "you" : "other"}>
                <div>
                  <div className="text-sm leading-relaxed mb-1">{messageContent.message}</div>
                  <div className="text-xs text-[#b9bbbe] flex gap-2">
                    <p>{messageContent.time}</p>
                    <p>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="flex p-3 bg-[#23272a] border-t border-[#1e2124] items-center">
        <input
          type="text" value={currentMessage} placeholder="Send a message" 
          onChange={(event) => setCurrentMessage(event.target.value)} 
          onKeyPress={(event) => event.key === "Enter" && sendMessage()} className="flex-1 p-3 rounded-full bg-[#40444b] text-white text-sm outline-none" />
        <button onClick={sendMessage} className="bg-[#5865f2] text-white p-2.5 rounded-full ml-2 hover:bg-[#4752c4] focus:outline-none">&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
