import React, { useState, useEffect } from "react";
import image from "../images/testimonials/avatar.png";

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  const API_BASE_URL =
    "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod";

  const customer = JSON.parse(localStorage.getItem("customer"));

  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || ""; //the current user's ID
  const WEBSOCKET_URL = `wss://0a1xxqdv9b.execute-api.us-east-1.amazonaws.com/production/?id=${USER_ID}`;

  useEffect(() => {
    fetchChatSessions(USER_ID);
    setupWebSocket();
  }, []);

  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages);
      markMessagesAsRead(activeChat.id);
    }
  }, [activeChat]);

  const fetchChatSessions = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      console.log(customer.AccessToken);
      const response = await fetch(
        `${API_BASE_URL}/v1/chat/sessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`, // Important!
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chat sessions");
      }
      const data = await response.json();
      console.log(data);
      setChats(Array.isArray(data) ? data : []); // Ensure data is an array
      if (data.length > 0) {
        setActiveChat(data[0]);
        setMessages(data[0].messages);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const newSocket = new WebSocket(WEBSOCKET_URL);

    newSocket.onopen = () => {
      console.log("WebSocket connected");
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "message" && message.event === "NEW") {
        fetchChatSessions(USER_ID);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(newSocket);

    return () => newSocket.close();
  };

  const sendWebSocketMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN && activeChat) {
      const messageObject = {
        action: "v1/chat",
        chatId: activeChat.id,
        senderId: USER_ID,
        messageContent: message,
      };
      socket.send(JSON.stringify(messageObject));
      setNewMessage("");
    }
  };

  const sendMessage = (message) => {
    sendWebSocketMessage(message);
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/chat/read/${chatId}`, {
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark messages as read");
      }
      fetchChatSessions(USER_ID);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteChatSession = async (chatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/chat/${chatId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete chat session");
      }
      fetchChatSessions(USER_ID);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex bg-[#F8F8FF] md:pt-52 md:px-32 pb-10 h-screen gap-10">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg rounded-xl p-4">
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
          {Array.isArray(chats) && chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  activeChat?.id === chat.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <img
                  src={image}
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
            ))
          ) : (
            <div>No chats available</div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat && (
        <div className="flex-1 bg-white shadow-lg rounded-xl p-6 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center mb-4">
            <div className="text-lg font-bold">{activeChat.name}</div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  msg.sender?.id === USER_ID ? "justify-end" : ""
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-xl ${
                    msg.sender?.id === USER_ID
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {msg.message}
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
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none px-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(newMessage)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
