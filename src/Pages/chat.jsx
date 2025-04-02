import React, { useState, useEffect } from "react";
import image from "../images/testimonials/avatar.png";
import { useLocation } from "react-router-dom";

const ChatApp = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [renteeIdFromParams, setRenteeIdFromParams] = useState(null);

  const API_BASE_URL =
    "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod";

  const customer = JSON.parse(localStorage.getItem("customer"));

  const USER_ID =
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value || "";
  const WEBSOCKET_URL = `wss://0a1xxqdv9b.execute-api.us-east-1.amazonaws.com/production/?id=${USER_ID}`;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const renteeId = params.get("renteeId");
    const reservationId = params.get("reservationId");
    if (renteeId) {
      setRenteeIdFromParams(renteeId);
      fetchChatSessionWithRentee(USER_ID, renteeId, reservationId);
    } else {
      fetchChatSessions(USER_ID);
    }
    setupWebSocket();
  }, [location.search, USER_ID]);

  const fetchChatSessions = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching chat sessions for user:", userId);
      const response = await fetch(
        `${API_BASE_URL}/v1/chat/sessions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Failed to fetch chat sessions:",
          response.status,
          errorData
        );
        throw new Error(`Failed to fetch chat sessions: ${response.status}`);
      }
      const data = await response.json();
      console.log("Chat sessions data:", data);
      setChats(Array.isArray(data) ? data : []);
      if (data.length > 0 && !renteeIdFromParams) {
        setActiveChat(data[0].data); // Corrected line
        setMessages(data[0].data.messages || []);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching chat sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatSessionWithRentee = async (
    ownerId,
    renteeId,
    reservationId
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching/creating direct chat session:", {
        ownerId,
        renteeId,
        reservationId,
      });
      const existingSessionResponse = await fetch(
        `${API_BASE_URL}/v1/chat/sessions/direct?participant1=${ownerId}&participant2=${renteeId}`,
        {
          headers: {
            Authorization: `Bearer ${customer.AccessToken}`,
          },
        }
      );

      if (existingSessionResponse.ok) {
        const existingSessionData = await existingSessionResponse.json();
        console.log("Existing session found:", existingSessionData);
        if (
          existingSessionData &&
          existingSessionData.success &&
          existingSessionData.data &&
          existingSessionData.data.length > 0
        ) {
          setActiveChat(existingSessionData.data[0]); // Corrected line
          setChats(existingSessionData.data);
          setMessages(existingSessionData.data[0].messages || []);
          return;
        }
      } else if (existingSessionResponse.status !== 404) {
        const errorData = await existingSessionResponse.json();
        console.error(
          "Error checking for existing chat session:",
          existingSessionResponse.status,
          errorData
        );
        throw new Error(
          `Failed to check for existing chat session: ${existingSessionResponse.status}`
        );
      } else {
        console.log("No existing session found, creating new one.");
      }

      const newSessionResponse = await fetch(
        `${API_BASE_URL}/v1/chat/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customer.AccessToken}`,
          },
          body: JSON.stringify({
            type: "direct",
            participants: [{ id: ownerId }, { id: renteeId }],
            reservationId: reservationId,
          }),
        }
      );

      if (!newSessionResponse.ok) {
        const errorData = await newSessionResponse.json();
        console.error(
          "Failed to create new chat session:",
          newSessionResponse.status,
          errorData
        );
        throw new Error(
          `Failed to create new chat session: ${newSessionResponse.status}`
        );
      }

      const newSessionData = await newSessionResponse.json();
      console.log("New session created:", newSessionData);
      if (newSessionData && newSessionData.success && newSessionData.data) {
        setActiveChat(newSessionData.data); // Corrected line
        setChats([newSessionData.data]);
        setMessages([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching/creating chat session:", err);
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
  useEffect(() => {
    console.log("Active Chat Data:", {
      ...activeChat,
      participants: activeChat?.participants,
    }); // Keep this for the overall structure
    if (activeChat?.participants) {
      console.log("Participants:", activeChat.participants); // Add this to see the participants array
    }
    if (activeChat && activeChat.messages) {
      setMessages(activeChat.messages);
    } else if (activeChat && !activeChat.messages) {
      console.warn("Active chat does not have messages:", activeChat);
      setMessages([]);
    } else {
      setMessages([]);
    }
  }, [activeChat]);
  const sendWebSocketMessage = (message) => {
    console.log("activeChat in sendWebSocketMessage:", activeChat);
    console.log(
      "WebSocket readyState:",
      socket ? socket.readyState : "Socket not initialized"
    ); // Added log
    if (
      socket &&
      socket.readyState === WebSocket.OPEN &&
      activeChat &&
      activeChat.id
    ) {
      const messageObject = {
        action: "v1/chat",
        chatId: activeChat.id,
        senderId: USER_ID,
        messageContent: message,
      };
      console.log("Message object being sent:", messageObject); // Added log
      socket.send(JSON.stringify(messageObject));
      setNewMessage("");
    } else if (!activeChat || !activeChat.id) {
      console.warn(
        "Cannot send message: No active chat or chat ID is undefined."
      );
    }
  };
  const sendMessage = (message) => {
    sendWebSocketMessage(message);
  };

  const deleteChatSession = async (chatId) => {
    try {
      console.log("Deleting chat session with ID:", chatId);
      const response = await fetch(`${API_BASE_URL}/v1/chat/${chatId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Failed to delete chat session:",
          response.status,
          errorData
        );
        throw new Error(`Failed to delete chat session: ${response.status}`);
      }
      console.log("Chat session deleted successfully:", chatId);
      fetchChatSessions(USER_ID);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting chat session:", err);
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
          {Array.isArray(chats) ? ( // Added check here
            chats.length > 0 ? (
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
            )
          ) : (
            <div>Loading chats...</div> // Or some other appropriate message
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
