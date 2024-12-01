import React, { useEffect, useState, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "../css/tailwind.css";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString(),
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  const exitRoom = () => {
    window.location.reload();
    socket.emit("exit_room", { username, room });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div className='w-[800px] h-[600px] bg-[#2c2f33] rounded-xl shadow-lg flex flex-col overflow-hidden text-white ml-96'>
      <div className='bg-[#23272a] text-white p-3 text-lg font-bold border-b border-[#1e2124] flex items-center justify-between'>
        <button
          className='bg-gray-600 text-white py-1 px-3 rounded-md hover:bg-gray-400'
          onClick={exitRoom}
        >
          Exit
        </button>
        <p>{room === "" ? "Chat" : room}</p>
      </div>
      <div className='flex-1 p-3 overflow-y-auto flex flex-col'>
        <div className='flex flex-col gap-4'>
          {messageList.map((messageContent, index) => {
            return messageContent.author === "System" ? (
              <div
                key={index}
                className='w-full text-center text-gray-400 text-sm italic'
              >
                {messageContent.message}
              </div>
            ) : (
              <div
                key={index}
                className={`flex ${
                  username === messageContent.author
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                } max-w-[70%] gap-4 mb-4`}
                id={username === messageContent.author ? "you" : "other"}
              >
                {username !== messageContent.author && (
                  <div className='w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs'>
                    <img
                      src={`https://api.dicebear.com/6.x/avataaars/png?seed=${messageContent.author}`}
                      alt='profile-pic'
                      className='w-10 h-10 rounded-full'
                    />
                  </div>
                )}
                <div
                  className={`p-4 rounded-lg bg-[#2c2f33] bg-opacity-80 ${
                    username === messageContent.author
                      ? "rounded-br-none"
                      : "rounded-bl-none"
                  } max-w-[98%]`}
                >
                  <div className='text-sm text-white leading-relaxed mb-2'>
                    {messageContent.message}
                  </div>
                  <div className='text-xs text-[#b9bbbe] flex gap-2'>
                    {/* <p>{messageContent.time}</p> */}
                    <p>{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className='flex p-3 bg-[#23272a] border-t border-[#1e2124] items-center relative'>
        <input
          type='text'
          value={currentMessage}
          placeholder='Send a message'
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          className='flex-1 p-3 rounded-full bg-[#40444b] text-white text-sm outline-none'
        />
        <button
          className='bg-[#5865f2] text-white p-2.5 rounded-full ml-2 hover:bg-[#4752c4] focus:outline-none'
          onClick={() => setEmojiPickerVisible((prev) => !prev)}
        >
          ☺
        </button>
        {emojiPickerVisible && (
          <div className='absolute bottom-[60px] right-[75px] z-10'>
            <Picker
              data={data}
              onEmojiSelect={(emoji) =>
                setCurrentMessage((prev) => prev + emoji.native)
              }
            />
          </div>
        )}
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
