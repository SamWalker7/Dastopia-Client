import React, { useState } from "react";

// Sample chat data
const chats = [
  {
    id: 1,
    name: "Athalia Putri",
    message: "Hello is the car available",
    time: "Today",
    unreadCount: 1,
    avatar: "/path-to-avatar.jpg", // Replace with actual avatar path
    messages: [
      { type: "received", text: "Hello, is the car available?" },
      { type: "sent", text: "That looks so good!" },
      { type: "sent", text: "or we could make this?" },
    ],
  },
  {
    id: 2,
    name: " Putri",
    message: "Hello is the car available",
    time: "Today",
    unreadCount: 1,
    avatar: "/path-to-avatar.jpg", // Replace with actual avatar path
    messages: [
      { type: "received", text: "Hello, is the car available?" },
      { type: "sent", text: "That looks so good!" },
      { type: "sent", text: "or we could make this?" },
      { type: "received", text: " is the car available?" },
    ],
  },
  // Add more chat data here
];

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeChat, setActiveChat] = useState(chats[0]); // Default to the first chat
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const sendMessage = (message) => {
    if (message.trim() === "") return;
    setActiveChat((prev) => ({
      ...prev,
      messages: [...prev.messages, { type: "sent", text: message }],
    }));
    setNewMessage("");
  };

  return (
    <div className="flex h-screen pt-40 bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg rounded-l-xl p-4">
        {/* Tabs */}
        <div className="flex justify-between mb-4">
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "All"
                ? "text-black font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("All")}
          >
            All
          </button>
          <button
            className={`flex-1 text-center p-2 ${
              activeTab === "Chat Support"
                ? "text-black font-bold border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Chat Support")}
          >
            Chat Support
          </button>
        </div>

        {/* Chat List */}
        <div>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                activeChat.id === chat.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setActiveChat(chat)}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="font-bold text-sm">{chat.name}</div>
                <div className="text-gray-500 text-xs">{chat.message}</div>
              </div>
              <div className="text-gray-400 text-xs">{chat.time}</div>
              {chat.unreadCount > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-white shadow-lg rounded-r-xl p-6 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center mb-4">
          <div className="text-lg font-bold">{activeChat.name}</div>
          {/* Optional: Add more actions to the header */}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4">
          {activeChat.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.type === "sent" ? "justify-end" : ""
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-xl ${
                  msg.type === "sent"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Predefined Quick Replies */}
        <div className="flex space-x-2 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            onClick={() => sendMessage("Let's do it!")}
          >
            Let's do it!
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            onClick={() => sendMessage("Great!")}
          >
            Great!
          </button>
        </div>

        {/* Chat Input */}
        <div className="flex items-center bg-gray-100 p-3 rounded-full shadow-inner">
          <button className="text-gray-500 mx-2 text-xl">+</button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none px-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(newMessage)}
          />
          <button
            className="text-gray-500 mx-2 text-xl"
            onClick={() => sendMessage(newMessage)}
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
