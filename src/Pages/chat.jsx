import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"; // Added EllipsisVerticalIcon

const ChatPlaceholderIcon = ({ className = "w-16 h-16" }) => (
  <ChatBubbleLeftEllipsisIcon className={`${className} text-gray-400`} />
);

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const ChatApp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  // true: show list, false: show chat window (on mobile)
  const [mobileViewSate, setMobileViewState] = useState("list"); // 'list' or 'chat'

  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // For initial full chat list fetch
  const [directChatLoading, setDirectChatLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null); // For errors on actions like delete

  const [socket, setSocket] = useState(null);
  const [chatIdToActivate, setChatIdToActivate] = useState(null);
  const [renteeIdFromParams, setRenteeIdFromParams] = useState(null); // To know if a direct chat was initiated

  const messagesEndRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const chatsRef = useRef(chats);
  const messagesRef = useRef(messages);
  const socketRef = useRef(socket);

  // Context Menu for Chat Item (Mobile and Desktop)
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    chatId: null,
  });

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  useEffect(() => {
    chatsRef.current = chats;
  }, [chats]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        // If resizing to desktop
        setMobileViewState("list"); // Reset to default behavior (both visible)
      }
      // If resizing to mobile, current mobileViewState ('list' or 'chat') persists
    };
    const debouncedHandleResize = debounce(handleResize, 200);
    window.addEventListener("resize", debouncedHandleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  const API_BASE_URL =
    "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod";
  const SEND_MESSAGE_ENDPOINT = `${API_BASE_URL}/v1/chat`;
  const MARK_AS_READ_ENDPOINT = `${API_BASE_URL}/v1/vehicle/read_messages`;

  const customer = useMemo(
    () => JSON.parse(localStorage.getItem("customer")) || {},
    []
  );
  const USER_ID = useMemo(
    () =>
      customer?.username ||
      customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value ||
      "",
    [customer]
  );
  const USER_FIRST_NAME = useMemo(
    () =>
      customer?.userAttributes?.find((attr) => attr.Name === "given_name")
        ?.Value || "Customer",
    [customer]
  );
  const USER_LAST_NAME = useMemo(
    () =>
      customer?.userAttributes?.find((attr) => attr.Name === "family_name")
        ?.Value || "User",
    [customer]
  );
  const USER_BIO = "customer"; // Assuming static for now
  const WEBSOCKET_URL = useMemo(
    () =>
      `wss://0a1xxqdv9b.execute-api.us-east-1.amazonaws.com/production/?id=${USER_ID}`,
    [USER_ID]
  );

  const formatFetchedMessages = useCallback((messagesArray) => {
    if (!Array.isArray(messagesArray)) return [];
    const formatted = messagesArray.map((msg) => ({
      id: msg.id,
      senderId: msg.sender?.id,
      content: msg.message,
      timestamp: new Date(msg.created_at).getTime(),
      media_url: msg.media_url,
      is_read: msg.is_read,
      ttl: msg.ttl,
      status: "sent", // Fetched messages are considered sent
    }));
    // Ensure messages are sorted by timestamp
    formatted.sort((a, b) => a.timestamp - b.timestamp);
    return formatted;
  }, []);

  const formatWebSocketMessage = useCallback((messageData) => {
    if (
      !messageData ||
      messageData.messageContent === undefined ||
      !messageData.senderId
    )
      return null;
    return {
      id: messageData.id || `ws-msg-${Date.now()}-${Math.random()}`, // Use provided ID or generate fallback
      senderId: messageData.senderId,
      content: messageData.messageContent,
      timestamp: new Date(messageData.timestamp).getTime(), // Assuming WS provides timestamp
      media_url: messageData.media_url || "",
      is_read: messageData.is_read || false,
      ttl: messageData.ttl,
      status: "delivered", // WS messages are delivered to this client
    };
  }, []);

  const fetchChatSessions = useCallback(
    async (userId, isRefresh = false) => {
      console.log(
        `Fetching chat sessions for user: ${userId}, isRefresh: ${isRefresh}`
      );
      if (!isRefresh && chatsRef.current.length === 0) {
        setLoading(true); // Full loading only if list is empty and not a refresh
      } else if (isRefresh) {
        // Potentially a more subtle loading indicator for refresh
        // For now, main loading state will show if not empty for refresh too
        setLoading(true);
      }
      setError(null);
      setActionError(null);

      if (!customer?.AccessToken) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        setDirectChatLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_BASE_URL}/v1/chat/sessions/${userId}`,
          { headers: { Authorization: `Bearer ${customer.AccessToken}` } }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            message: "Failed to parse error response from server.",
          }));
          const errorMsg = `Failed to load chats: ${response.status} - ${
            errorData.message || "Unknown server error."
          }`;
          // If it's a refresh and list exists, show error in a less intrusive way
          if (isRefresh && chatsRef.current.length > 0)
            setError(`Refresh failed: ${errorData.message || response.status}`);
          else throw new Error(errorMsg); // Full error for initial load failure
        } else {
          const result = await response.json();
          if (result && result.success && Array.isArray(result.data)) {
            const chatsWithFormattedMessages = result.data.map((chat) => ({
              ...chat,
              messages: formatFetchedMessages(chat.messages),
            }));
            // Sort chats by the timestamp of their latest message, descending (most recent chat first)
            chatsWithFormattedMessages.sort((a, b) => {
              const lastMsgA =
                a.messages.length > 0
                  ? a.messages[a.messages.length - 1].timestamp
                  : 0;
              const lastMsgB =
                b.messages.length > 0
                  ? b.messages[b.messages.length - 1].timestamp
                  : 0;
              return lastMsgB - lastMsgA;
            });
            setChats(chatsWithFormattedMessages);
          } else {
            setChats([]); // Clear chats if data format is unexpected
            if (!isRefresh) setError("No chat data found or invalid format.");
          }
          if (isRefresh) setError(null); // Clear refresh error on success
        }
      } catch (err) {
        setError(err.message);
        if (!isRefresh && chatsRef.current.length === 0) setChats([]);
      } finally {
        setLoading(false);
        setDirectChatLoading(false);
      }
    },
    [customer?.AccessToken, formatFetchedMessages]
  );

  const fetchChatSessionWithTargetUser = useCallback(
    async (
      initiatorId,
      initiatorFirst_name,
      initiatorLast_name,
      initiatorBio,
      targetId,
      targetFirst_name,
      targetLast_name,
      targetBio,
      reservationId
    ) => {
      setDirectChatLoading(true);
      setError(null);
      setActionError(null);
      let foundOrCreatedChat = null;
      try {
        if (!customer?.AccessToken) {
          setError("User not authenticated.");
          setDirectChatLoading(false);
          setChatIdToActivate(null);
          return;
        }
        if (!targetId) {
          setError("Target user ID missing. Cannot initiate chat.");
          setDirectChatLoading(false);
          setChatIdToActivate(null);
          return;
        }

        const existingSessionResponse = await fetch(
          `${API_BASE_URL}/v1/chat/sessions/direct?participant1=${initiatorId}&participant2=${targetId}`,
          { headers: { Authorization: `Bearer ${customer.AccessToken}` } }
        );
        if (existingSessionResponse.ok) {
          const result = await existingSessionResponse.json();
          if (
            result &&
            result.success &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            foundOrCreatedChat = result.data[0];
            setChatIdToActivate(foundOrCreatedChat.id);
          }
        } else if (existingSessionResponse.status !== 404) {
          // Handle errors other than "not found"
          const errorData = await existingSessionResponse
            .json()
            .catch(() => ({ message: "Failed to parse error from server." }));
          setError(
            `Failed to check for existing chat: ${
              errorData.message || existingSessionResponse.status
            }`
          );
          setDirectChatLoading(false);
          setChatIdToActivate(null);
          return;
        }

        if (!foundOrCreatedChat) {
          // If no existing session, create one
          const requestBody = {
            type: "direct",
            participantIds: [initiatorId, targetId],
            reservation_id: reservationId,
          };
          const newSessionResponse = await fetch(
            `${API_BASE_URL}/v1/chat/create/chatSessions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${customer.AccessToken}`,
              },
              body: JSON.stringify(requestBody),
            }
          );
          if (!newSessionResponse.ok) {
            const errorData = await newSessionResponse
              .json()
              .catch(() => ({ message: "Failed to parse error from server." }));
            throw new Error(
              `Failed to create chat session: ${newSessionResponse.status} - ${
                errorData.message || "Unknown server error."
              }`
            );
          }
          const result = await newSessionResponse.json();
          if (
            result &&
            result.success &&
            result.session &&
            typeof result.session === "object" &&
            result.session !== null
          ) {
            foundOrCreatedChat = result.session;
            setChatIdToActivate(foundOrCreatedChat.id);
          } else {
            throw new Error(
              "Failed to get newly created chat session data from response."
            );
          }
        }
        // After finding or creating, fetch all sessions to update the list which will trigger activation
        await fetchChatSessions(USER_ID, true); // true for isRefresh
      } catch (err) {
        setError(err.message);
        setDirectChatLoading(false);
        setChatIdToActivate(null);
      } finally {
        // setDirectChatLoading(false) is handled by fetchChatSessions' finally block now
      }
    },
    [customer?.AccessToken, USER_ID, fetchChatSessions]
  );

  const deleteChatSession = useCallback(
    async (chatId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this chat? This action cannot be undone."
        )
      )
        return;
      setActionError(null); // Clear previous action errors
      try {
        if (!customer?.AccessToken) {
          setActionError("User not authenticated.");
          return;
        }
        const response = await fetch(`${API_BASE_URL}/v1/chat/${chatId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${customer.AccessToken}` },
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error from server." }));
          throw new Error(
            `Failed to delete chat: ${response.status} - ${
              errorData.message || "Unknown server error."
            }`
          );
        }
        // Refetch all sessions to update the list
        await fetchChatSessions(USER_ID, true); // true for isRefresh
        // If the deleted chat was active, clear it
        if (activeChatRef.current?.id === chatId) {
          setActiveChat(null);
          setMessages([]);
          setChatIdToActivate(null);
        }
        // Optionally show success message or rely on list update
      } catch (err) {
        setActionError(err.message); // Set specific action error
        alert(`Failed to delete chat: ${err.message}`); // User feedback
      }
    },
    [customer?.AccessToken, USER_ID, fetchChatSessions]
  );

  const markChatAsRead = useCallback(
    async (chatId) => {
      if (!chatId || !USER_ID || !customer?.AccessToken) {
        console.warn("Cannot mark chat as read: Missing required info.");
        return;
      }
      try {
        const response = await fetch(`${MARK_AS_READ_ENDPOINT}/${chatId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customer.AccessToken}`,
          },
          body: JSON.stringify({ currentUserId: USER_ID }),
        });
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error from server." }));
          console.error(
            `Failed to mark chat ${chatId} as read:`,
            response.status,
            errorData
          );
        } else {
          // Refetch sessions to update unread counts in the sidebar after marking as read
          fetchChatSessions(USER_ID, true).catch((err) =>
            console.error("Error refetching chats after marking as read:", err)
          ); // true for isRefresh
        }
      } catch (err) {
        console.error(
          `Network error occurred while marking chat ${chatId} as read:`,
          err
        );
      }
    },
    [customer?.AccessToken, USER_ID, fetchChatSessions, MARK_AS_READ_ENDPOINT]
  );

  useEffect(() => {
    // WebSocket Setup
    if (!USER_ID || !WEBSOCKET_URL.endsWith(USER_ID)) {
      // Ensure URL uses current USER_ID
      if (
        socketRef.current &&
        socketRef.current.readyState < WebSocket.CLOSING
      ) {
        socketRef.current.close(1000, "User ID changed or missing");
      }
      return;
    }
    const connectWebSocket = () => {
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.CONNECTING ||
          socketRef.current.readyState === WebSocket.OPEN)
      )
        return; // Already connected or connecting
      const newSocket = new WebSocket(WEBSOCKET_URL);
      newSocket.onopen = () => {
        console.log("WebSocket connected");
        setSocket(newSocket);
        setError(null);
      }; // Clear general error on connect
      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (
            message.type === "message" &&
            message.event === "NEW" &&
            message.data &&
            message.data.chatId &&
            message.data.senderId &&
            message.data.messageContent !== undefined &&
            message.data.senderId !== USER_ID
          ) {
            const newMessageData = message.data;
            const targetChatId = newMessageData.chatId;
            const formattedNewMessage = formatWebSocketMessage(newMessageData);
            if (!formattedNewMessage) {
              console.warn(
                "Received invalid WS message structure:",
                newMessageData
              );
              return;
            }

            // Update messages if it's the active chat
            if (
              activeChatRef.current &&
              targetChatId === activeChatRef.current.id
            ) {
              setMessages((prevMessages) => {
                if (
                  formattedNewMessage.id &&
                  prevMessages.some((msg) => msg.id === formattedNewMessage.id)
                )
                  return prevMessages; // Avoid duplicates
                const updatedMessages = [...prevMessages, formattedNewMessage];
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp); // Ensure order
                return updatedMessages;
              });
              markChatAsRead(targetChatId); // Mark active chat as read on new message
            } else {
              // If message is for a non-active chat, refetch sessions to update unread count & sort order
              fetchChatSessions(USER_ID, true).catch(console.error); // true for isRefresh
            }
          } else if (message.data?.senderId === USER_ID) {
            /* Ignore self-sent message echoes */
          } else {
            console.log(
              "Received non-message or unexpected WS structure:",
              message
            );
          }
        } catch (e) {
          console.error(
            "Error processing WebSocket message:",
            e,
            "Raw Data:",
            event.data
          );
        }
      };
      newSocket.onclose = (event) => {
        setSocket(null); // Clear socket state
        if (!event.wasClean && event.code !== 1000) {
          // If not a clean close (e.g., component unmount)
          if (!directChatLoading)
            setError("Chat connection lost. Reconnecting..."); // Show error only if not in direct chat loading
          setTimeout(connectWebSocket, 3000 + Math.random() * 2000); // Retry with jitter
        } else {
          if (!directChatLoading) setError(null);
        } // Clear connection error on clean close unless direct chat error exists
      };
      newSocket.onerror = (errorEvent) => {
        if (!directChatLoading)
          setError("Chat connection error. Will attempt to reconnect.");
      }; // General WS error
      return newSocket; // Return for cleanup
    };
    const socketInstanceForCleanup = connectWebSocket(); // Attempt connection
    return () => {
      // Cleanup
      if (
        socketInstanceForCleanup &&
        socketInstanceForCleanup.readyState !== WebSocket.CLOSING &&
        socketInstanceForCleanup.readyState !== WebSocket.CLOSED
      ) {
        socketInstanceForCleanup.close(
          1000,
          "Component Unmount/Dependency Change"
        );
      }
    };
  }, [
    USER_ID,
    WEBSOCKET_URL,
    fetchChatSessions,
    directChatLoading,
    markChatAsRead,
    formatWebSocketMessage,
  ]);

  const sendMessageViaHttp = useCallback(
    async (chatId, senderId, text, tempId, mediaUrl = "") => {
      // Clear any previous message-specific error on new attempt
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempId ? { ...msg, error: undefined } : msg
        )
      );

      if (!customer?.AccessToken) {
        setError("User not authenticated. Cannot send message."); // General error
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? { ...msg, status: "failed", error: "Authentication Error" }
              : msg
          )
        );
        return;
      }
      try {
        const response = await fetch(SEND_MESSAGE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customer.AccessToken}`,
          },
          body: JSON.stringify({
            chatId: chatId,
            senderId: senderId,
            messageContent: text,
            mediaUrl: mediaUrl,
          }),
        });
        if (response.status !== 201) {
          // HTTP 201 Created is typical for successful POST
          const errorData = await response.json().catch(() => ({
            message: "Failed to parse server error response.",
          }));
          const errorMessage =
            errorData.message ||
            `Failed to send message (status ${response.status})`;
          // Set error on the specific message
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempId
                ? { ...msg, status: "failed", error: errorMessage }
                : msg
            )
          );
        } else {
          const result = await response.json();
          if (result && result.success && result.data) {
            const serverMessageData = result.data;
            const formattedServerMessage = {
              id: serverMessageData.id,
              senderId: serverMessageData.sender?.id || senderId,
              content: serverMessageData.message,
              timestamp: new Date(serverMessageData.created_at).getTime(),
              media_url: serverMessageData.media_url,
              is_read: serverMessageData.is_read,
              ttl: serverMessageData.ttl,
              status: "sent",
            }; // Or 'delivered'
            setMessages((prevMessages) => {
              const index = prevMessages.findIndex((msg) => msg.id === tempId);
              if (index > -1) {
                // Found optimistic message, replace it
                const updatedMessages = [...prevMessages];
                updatedMessages[index] = formattedServerMessage;
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                return updatedMessages;
              } else {
                // Optimistic message not found (should be rare)
                if (
                  formattedServerMessage.id &&
                  prevMessages.some(
                    (msg) => msg.id === formattedServerMessage.id
                  )
                )
                  return prevMessages; // Already exists (e.g. WS echo)
                const updatedMessages = [
                  ...prevMessages,
                  formattedServerMessage,
                ];
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                return updatedMessages;
              }
            });
            // No general error needed for successful send, message status handles it
            fetchChatSessions(USER_ID, true).catch(console.error); // Refresh sidebar on successful send (isRefresh = true)
          } else {
            // 201 but unexpected response body
            const errorMessage =
              "Message sent, but server response was malformed.";
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === tempId
                  ? { ...msg, status: "failed", error: errorMessage }
                  : msg
              )
            );
            fetchChatSessions(USER_ID, true).catch(console.error); // Still refresh, backend might have saved it
          }
        }
      } catch (err) {
        // Network error or other JS error
        const errorMessage =
          err.message || "Failed to send message due to a network error.";
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? { ...msg, status: "failed", error: errorMessage }
              : msg
          )
        );
      }
    },
    [customer?.AccessToken, USER_ID, SEND_MESSAGE_ENDPOINT, fetchChatSessions]
  );

  const sendMessage = useCallback(
    (messageContent) => {
      const trimmedMessage = messageContent.trim();
      if (trimmedMessage && activeChat?.id && USER_ID) {
        const tempId = `client:${uuidv4()}`; // Unique client-side temporary ID
        const optimisticMessage = {
          id: tempId,
          senderId: USER_ID,
          content: trimmedMessage,
          timestamp: Date.now(),
          media_url: "",
          is_read: true,
          ttl: undefined,
          status: "sending",
        };

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, optimisticMessage];
          updatedMessages.sort((a, b) => a.timestamp - b.timestamp); // Ensure order
          return updatedMessages;
        });
        setNewMessage(""); // Clear input field immediately
        setError(null); // Clear any general error when attempting to send

        sendMessageViaHttp(activeChat.id, USER_ID, trimmedMessage, tempId);
        // Fetch sessions to update sidebar (e.g., last message preview) immediately after optimistic send
        // This doesn't wait for HTTP response, provides faster sidebar feedback
        fetchChatSessions(USER_ID, true).catch(console.error);
      } else if (!activeChat?.id) {
        setError("Please select a chat to send your message.");
      } else if (!USER_ID) {
        setError("User ID is missing. Cannot send message.");
      }
      // Empty message case is handled by isSendDisabled on button
    },
    [sendMessageViaHttp, activeChat?.id, USER_ID, fetchChatSessions]
  );

  useEffect(() => {
    // Initial data fetch / direct chat from URL
    if (!USER_ID) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      setDirectChatLoading(false);
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      setChatIdToActivate(null);
      setRenteeIdFromParams(null);
      return;
    }
    const params = new URLSearchParams(location.search);
    const targetUserIdFromUrl = params.get("renteeId") || params.get("userId2");
    const reservationIdFromUrl =
      params.get("reservationId") || params.get("bookingId");
    const targetUserFirstNameFromUrl = params.get("given_name");
    const targetUserLastNameFromUrl = params.get("family_name");

    setChatIdToActivate(null); // Clear previous activation intent
    setRenteeIdFromParams(targetUserIdFromUrl); // Store for context

    if (targetUserIdFromUrl) {
      fetchChatSessionWithTargetUser(
        USER_ID,
        USER_FIRST_NAME,
        USER_LAST_NAME,
        USER_BIO,
        targetUserIdFromUrl,
        targetUserFirstNameFromUrl,
        targetUserLastNameFromUrl,
        "User",
        reservationIdFromUrl
      );
    } else {
      fetchChatSessions(USER_ID, false); // false for isRefresh, it's initial load
    }
    // Cleanup on unmount or if USER_ID changes
    return () => {
      if (!USER_ID) {
        setChats([]);
        setActiveChat(null);
        setMessages([]);
        setChatIdToActivate(null);
        setRenteeIdFromParams(null);
        setError(null);
      }
    };
  }, [
    location.search,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_BIO,
    customer?.AccessToken,
    fetchChatSessions,
    fetchChatSessionWithTargetUser,
  ]); // Dependencies

  useEffect(() => {
    // Chat activation logic
    if (chatIdToActivate && Array.isArray(chats) && chats.length > 0) {
      const chatToSet = chats.find((chat) => chat.id === chatIdToActivate);
      if (chatToSet) {
        if (activeChat?.id !== chatToSet.id) {
          // Activate if not already active
          setActiveChat(chatToSet);
          setMessages(chatToSet.messages || []);
          setError(null);
          markChatAsRead(chatToSet.id);
          if (isMobileView) setMobileViewState("chat"); // Switch to chat view on mobile
        } else {
          // If already active, ensure messages are current (e.g., after a fetch)
          const currentActiveChatInList = chats.find(
            (chat) => chat.id === activeChat.id
          );
          if (
            currentActiveChatInList &&
            (currentActiveChatInList.messages.length !== messages.length ||
              currentActiveChatInList.messages.some((msg, i) =>
                messages[i] ? msg.id !== messages[i].id : true
              ))
          ) {
            setMessages(currentActiveChatInList.messages || []);
          }
        }
        setChatIdToActivate(null); // Clear activation intent
      } else {
        setChatIdToActivate(null); /* Chat to activate not found */
      }
    } else if (
      chatIdToActivate === null &&
      Array.isArray(chats) &&
      chats.length > 0 &&
      !activeChat &&
      !isMobileView
    ) {
      // Auto-activate first chat on desktop if no specific chat is requested and none is active
      const firstChat = chats[0];
      setActiveChat(firstChat);
      setMessages(firstChat.messages || []);
      setError(null);
      markChatAsRead(firstChat.id);
    } else if (Array.isArray(chats) && chats.length === 0 && activeChat) {
      // No chats left, clear active
      setActiveChat(null);
      setMessages([]);
      setChatIdToActivate(null);
      if (isMobileView) setMobileViewState("list"); // Go back to list on mobile if active chat disappears
    } else if (Array.isArray(chats) && chats.length > 0 && activeChat) {
      // Active chat exists, ensure its messages are up-to-date
      const currentActiveChatInList = chats.find(
        (chat) => chat.id === activeChat.id
      );
      if (currentActiveChatInList) {
        if (
          currentActiveChatInList.messages.length !== messages.length ||
          currentActiveChatInList.messages.some((msg, i) =>
            messages[i] ? msg.id !== messages[i].id : true
          )
        ) {
          setMessages(currentActiveChatInList.messages || []);
        }
      } else {
        // Active chat no longer in list (e.g. deleted by another session)
        setActiveChat(null);
        setMessages([]);
        if (isMobileView) setMobileViewState("list");
      }
    }
  }, [
    chats,
    chatIdToActivate,
    activeChat,
    messages.length,
    markChatAsRead,
    isMobileView,
  ]); // isMobileView added

  useEffect(() => {
    // Scroll to bottom of messages
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current && activeChat)
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 150); // Small delay
    return () => clearTimeout(timeoutId);
  }, [messages, activeChat]);

  const getChatDisplayName = useCallback(
    (chat) => {
      if (!chat) return "Loading Chat...";
      if (!Array.isArray(chat.participants))
        return `Chat ${chat.id?.substring(0, 8)}` || "Unnamed Chat"; // Show partial ID if needed
      const otherParticipant = chat.participants.find((p) => p.id !== USER_ID);
      if (!otherParticipant) {
        // Chat with self or participant data missing
        const selfParticipant = chat.participants.find((p) => p.id === USER_ID);
        if (selfParticipant?.first_name || selfParticipant?.last_name) {
          const selfFullName = [
            selfParticipant.first_name,
            selfParticipant.last_name,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();
          if (selfFullName) return `${selfFullName} (You)`;
        }
        return `Chat ${chat.id?.substring(0, 8)} (Self)`;
      }
      const fullName = [otherParticipant.first_name, otherParticipant.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();
      return fullName || otherParticipant.id; // Fallback to ID if name parts are empty
    },
    [USER_ID]
  );

  const getParticipantById = useCallback(
    (participantId) => {
      if (!activeChat || !Array.isArray(activeChat.participants)) return null;
      return activeChat.participants.find((p) => p.id === participantId);
    },
    [activeChat]
  );

  // Conditional rendering states
  const showInitialLoadingSpinner =
    loading && chats.length === 0 && !activeChat && !directChatLoading;
  const showDirectChatLoadingView = directChatLoading && !activeChat;
  // Show placeholder if no chat is selected AND we are not currently loading a direct chat specifically
  const showChatWindowPlaceholder = !activeChat && !showDirectChatLoadingView;

  // Input disabled states
  const isSocketUnavailable = !socket || socket.readyState !== WebSocket.OPEN;
  const isInputCompletelyDisabled =
    isSocketUnavailable || !activeChat || directChatLoading;
  const isSendButtonDisabled = !newMessage.trim() || isInputCompletelyDisabled;

  // Context Menu Handlers
  const handleChatContextMenu = (event, chatId) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, chatId });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, chatId: null });
  };

  useEffect(() => {
    // Close context menu on click outside
    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  if (showInitialLoadingSpinner) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 border-solid rounded-full animate-spin"></div>
        <p className="text-gray-700 text-lg mt-4">Loading chats...</p>
      </div>
    );
  }
  // Full page error if initial load fails completely
  if (
    error &&
    chats.length === 0 &&
    !loading &&
    !directChatLoading &&
    !activeChat
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4 text-red-600">
        <p className="text-xl font-semibold">Error Loading Chats</p>
        <p className="mt-2 text-center">{error}</p>
        <button
          onClick={() => fetchChatSessions(USER_ID, false)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || directChatLoading}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleChatSelect = (chat) => {
    if (activeChat?.id !== chat.id) {
      // Only if selecting a different chat
      setActiveChat(chat);
      setMessages(chat.messages || []); // Messages are already formatted
      setError(null); // Clear general error
      setActionError(null); // Clear action error
      markChatAsRead(chat.id);
      if (isMobileView) {
        setMobileViewState("chat"); // Switch to chat view on mobile
      }
    } else {
      // If clicking the already active chat, ensure messages are up-to-date from 'chats'
      const currentActiveChatInList = chats.find((c) => c.id === activeChat.id);
      if (currentActiveChatInList)
        setMessages(currentActiveChatInList.messages || []);
    }
    setChatIdToActivate(null); // Clear any pending auto-activation
  };

  return (
    <div className="flex h-screen bg-gray-100 md:pt-20 md:p-4 lg:p-8 md:rounded-xl overflow-hidden shadow-xl">
      {/* Chat List Sidebar */}
      <div
        className={`
        ${isMobileView && mobileViewSate !== "list" ? "hidden" : "flex"} 
        ${isMobileView ? "w-full h-full" : "w-full sm:w-2/5 md:w-1/3 lg:w-1/4"} 
        bg-white ${
          isMobileView ? "" : "md:rounded-l-xl"
        } p-3 md:p-4 flex-col border-r border-gray-200 transition-transform duration-300 ease-in-out
      `}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <p className="text-xl md:text-2xl font-bold text-gray-800">Chats</p>
          <button
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
            onClick={() => fetchChatSessions(USER_ID, true)}
            disabled={loading || directChatLoading}
            title="Refresh Chats"
          >
            <ArrowPathIcon
              className={`w-5 h-5 md:w-6 md:h-6 text-gray-600 ${
                (loading && chats.length > 0) ||
                (directChatLoading && chats.length > 0)
                  ? "animate-spin"
                  : ""
              }`}
            />
          </button>
        </div>

        {/* Loading spinner for list content (not full page) */}
        {loading &&
          chats.length === 0 &&
          !error && ( // Only if list is empty and no error
            <div className="flex justify-center items-center flex-1">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        {/* Error message within sidebar if applicable */}
        {error &&
          !loading &&
          chats.length > 0 && ( // Error during refresh
            <p className="text-center text-red-500 text-xs md:text-sm mb-2 p-2 bg-red-50 rounded-md">
              {error}
            </p>
          )}
        {actionError && (
          <p className="text-center text-red-500 text-xs md:text-sm mb-2 p-2 bg-red-50 rounded-md">
            {actionError}
          </p>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {" "}
          {/* Relies on browser scrollbar */}
          {chats.length > 0
            ? chats.map((chat) => {
                if (!chat || !chat.id || !Array.isArray(chat.participants))
                  return null; // Basic validation
                const otherParticipant = chat.participants.find(
                  (p) => p.id !== USER_ID
                );
                const avatarUrl = otherParticipant?.avatar; // Assuming avatar URL is in participant object
                const displayChat_name = getChatDisplayName(chat);
                const latestMessage =
                  Array.isArray(chat.messages) && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1]
                    : null;
                const lastMessageContent = latestMessage
                  ? latestMessage.content
                  : "No messages yet";
                const lastMessageTimestamp = latestMessage
                  ? latestMessage.timestamp
                  : null;
                const hasUnread =
                  Array.isArray(chat.messages) &&
                  chat.messages.some(
                    (msg) => msg.senderId !== USER_ID && !msg.is_read
                  );

                return (
                  <div
                    key={chat.id}
                    className={`flex items-center p-2.5 md:p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out relative group ${
                      activeChat?.id === chat.id
                        ? "bg-blue-100 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => handleChatSelect(chat)}
                    onContextMenu={(e) => handleChatContextMenu(e, chat.id)}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 object-cover flex-shrink-0 shadow-sm">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayChat_name || "Avatar"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg md:text-xl rounded-full">
                          {displayChat_name
                            ? displayChat_name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-sm text-gray-800 truncate flex items-center">
                        {displayChat_name}
                        {hasUnread && (
                          <span className="ml-2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs truncate mt-0.5">
                        {latestMessage?.senderId === USER_ID ? "You: " : ""}
                        {lastMessageContent}
                      </p>
                    </div>
                    {lastMessageTimestamp && (
                      <div className="text-gray-400 text-[10px] md:text-xs ml-2 flex-shrink-0 self-start pt-1">
                        {!isNaN(new Date(lastMessageTimestamp).getTime())
                          ? new Date(lastMessageTimestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : ""}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChatContextMenu(e, chat.id);
                      }}
                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity md:hidden" // Show on hover/focus on mobile too if tap-hold is not intuitive
                      aria-label="Chat options"
                    >
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                );
              })
            : !loading &&
              !directChatLoading &&
              chats.length === 0 && ( // Only show "No chats" if not loading
                <div className="text-center text-gray-500 mt-8 text-sm p-4">
                  <ChatBubbleLeftEllipsisIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                  No active chats.
                  {renteeIdFromParams && !error && (
                    <span className="block mt-1 text-xs">
                      Could not find or create a chat for the requested user.
                    </span>
                  )}
                </div>
              )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 text-sm"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking menu items
        >
          <button
            onClick={() => {
              deleteChatSession(contextMenu.chatId);
              closeContextMenu();
            }}
            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete Chat
          </button>
          {/* Add more context menu options here if needed */}
        </div>
      )}

      {/* Chat Window */}
      <div
        className={`
        ${isMobileView && mobileViewSate !== "chat" ? "hidden" : "flex"}
        flex-1 ${
          isMobileView ? "w-full h-full fixed inset-0 z-20" : "md:rounded-r-xl"
        } 
        bg-white p-3 md:p-4 lg:p-6 flex-col ${
          isMobileView ? "" : "border-l border-gray-200"
        } transition-transform duration-300 ease-in-out
      `}
      >
        {showChatWindowPlaceholder ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-4">
            {
              isMobileView && mobileViewSate === "list" && (
                <p className="text-lg">Select a chat</p>
              ) /* Placeholder on mobile if list is shown and no active chat */
            }
            {!isMobileView && ( // Desktop placeholder
              <>
                <ChatPlaceholderIcon className="w-20 h-20 mb-4" />
                <p className="text-gray-600 text-lg text-center">
                  Select a chat to start messaging
                </p>
              </>
            )}
            {showDirectChatLoadingView ? ( // This will show if directChatLoading is true and !activeChat
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-200 border-solid rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 text-base md:text-lg">
                  Loading or creating chat...
                </p>
                {/* Specific error for direct chat failure */}
                {error && renteeIdFromParams && (
                  <p className="mt-2 text-red-500 text-xs md:text-sm">
                    Error setting up chat: {error}
                  </p>
                )}
              </div>
            ) : (
              // Error placeholder if direct chat was initiated, failed, and no other chats available.
              error &&
              renteeIdFromParams &&
              chats.length === 0 &&
              !loading && (
                <p className="mt-4 text-red-500 text-center text-sm">
                  Could not set up chat. Error: {error}
                </p>
              )
            )}
          </div>
        ) : (
          <>
            {" "}
            {/* Actual Chat Window Content */}
            <div className="flex items-center mb-3 md:mb-4 border-b pb-3">
              {isMobileView && (
                <button
                  onClick={() => setMobileViewState("list")}
                  className="mr-2 p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
              )}
              <p className="text-md md:text-lg lg:text-xl font-semibold text-gray-800 flex-1 truncate">
                {getChatDisplayName(activeChat)}
              </p>
              {/* Context menu for active chat (e.g., delete) - optional */}
              {activeChat && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChatContextMenu(e, activeChat.id);
                  }}
                  className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  aria-label="Active chat options"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Info/Error messages for the active chat window */}
            {error && !isSocketUnavailable && !showDirectChatLoadingView && (
              <p className="text-center text-green-600 mb-2 text-xs md:text-sm p-1 bg-green-50 rounded-md">
                Info: {error}
              </p>
            )}
            {actionError && (
              <p className="text-center text-red-500 mb-2 text-xs md:text-sm p-1 bg-red-50 rounded-md">
                {actionError}
              </p>
            )}
            <div className="flex-1 overflow-y-auto mb-3 md:mb-4 space-y-2.5 md:space-y-3 p-1 md:p-2">
              {" "}
              {/* Relies on browser scrollbar */}
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const senderId = msg.senderId;
                  const isSentByCurrentUser = senderId === USER_ID;
                  // Avatar logic can be simplified if not showing avatars in bubbles
                  // const senderParticipant = getParticipantById(senderId);
                  // const senderName = senderParticipant ? [senderParticipant.first_name, senderParticipant.last_name].filter(Boolean).join(" ") || senderId : senderId || "Unknown";
                  return (
                    <div
                      key={msg.id}
                      className={`flex my-1.5 md:my-2 ${
                        isSentByCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-end max-w-[80%] sm:max-w-[75%] md:max-w-[70%] lg:max-w-[65%]`}
                      >
                        {" "}
                        {/* No flex-direction reverse, just alignment */}
                        <div
                          className={`px-3 py-2 md:px-3.5 md:py-2.5 rounded-2xl shadow-sm break-words flex flex-col text-sm md:text-base leading-snug ${
                            isSentByCurrentUser
                              ? "bg-blue-600 text-white rounded-br-lg"
                              : "bg-gray-200 text-gray-800 rounded-bl-lg"
                          } ${
                            msg.status === "failed" ? "ring-1 ring-red-500" : ""
                          }`}
                        >
                          {msg.content}
                          {/* Message Status and Timestamp */}
                          <div className="flex items-center justify-end mt-1 pt-0.5">
                            {msg.status === "sending" && (
                              <span className="text-[9px] md:text-[10px] text-blue-300 mr-1.5">
                                Sending...
                              </span>
                            )}
                            {msg.status === "failed" && (
                              <span
                                className="text-[9px] md:text-[10px] text-red-300 mr-1.5"
                                title={msg.error || "Failed to send"}
                              >
                                Failed!
                              </span>
                            )}
                            {msg.timestamp &&
                              !isNaN(new Date(msg.timestamp).getTime()) && (
                                <span
                                  className={`text-[9px] md:text-[10px] ${
                                    isSentByCurrentUser
                                      ? "text-blue-200"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 italic mt-8 text-sm">
                  No messages yet. Be the first!
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Quick Replies - simplified */}
            {activeChat && (
              <div className="flex space-x-1.5 md:space-x-2 mb-2 md:mb-3 overflow-x-auto pb-1 md:pb-1.5">
                {["Yes!", "No", "Okay", "Thanks!"].map((reply) => (
                  <button
                    key={reply}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-full hover:bg-gray-200 text-xs md:text-sm flex-shrink-0 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() => sendMessage(reply)}
                    disabled={isInputCompletelyDisabled}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center bg-gray-100 p-2 md:p-2.5 rounded-xl shadow-inner">
              <input
                type="text"
                placeholder={
                  isInputCompletelyDisabled
                    ? isSocketUnavailable
                      ? "Chat service unavailable"
                      : directChatLoading
                      ? "Loading chat..."
                      : "Select a chat"
                    : "Type your message..."
                }
                className="flex-1 bg-transparent outline-none px-2 md:px-3 text-sm md:text-base text-gray-800 placeholder-gray-500 disabled:cursor-not-allowed"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !isSendButtonDisabled &&
                  sendMessage(newMessage)
                }
                disabled={isInputCompletelyDisabled}
              />
              <button
                className="ml-2 md:ml-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:bg-gray-400 transition"
                onClick={() => sendMessage(newMessage)}
                disabled={isSendButtonDisabled}
                title="Send Message"
              >
                <PaperAirplaneIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
