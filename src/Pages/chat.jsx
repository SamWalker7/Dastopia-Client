import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import uuid for temporary client-side IDs
import { ArrowPathIcon } from "@heroicons/react/24/outline"; // Import HeroIcon

// SVG for a placeholder message icon
// Kept as SVG because there isn't a direct HeroIcon equivalent for a chat bubble placeholder
const ChatPlaceholderIcon = ({ className = "w-16 h-16" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H15.75m2.25-4.125a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H18m2.25 4.125c0 1.15-.19 2.23-.53 3.219L16.5 18a2.25 2.25 0 0 1-1.875 1.039V21.75l-1.581-1.581a1.5 1.5 0 0 0-1.14-.44L9.75 20.25a3.733 3.733 0 0 0-.45-1.495l-1.413 1.413zm-1.413-1.413L5.416 16.17A9.75 9.75 0 0 1 3 12.375V4.5c0-1.036.84-1.875 1.875-1.875h15C20.16 2.625 21 3.464 21 4.5v7.875c0 1.035-.84 1.875-1.875 1.875h-4.5Z"
    />
  </svg>
);

const ChatApp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]); // Standardized message format { id, senderId, content, timestamp, status, ... }

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false); // Loading for initial chat list fetch
  const [directChatLoading, setDirectChatLoading] = useState(false); // Loading specifically for fetch/create direct chat
  const [error, setError] = useState(null); // General error state

  const [socket, setSocket] = useState(null);
  const [chatIdToActivate, setChatIdToActivate] = useState(null);
  const [renteeIdFromParams, setRenteeIdFromParams] = useState(null);

  const messagesEndRef = useRef(null);

  // Use refs to hold latest state for callbacks without needing them as dependencies
  const activeChatRef = useRef(activeChat);
  const chatsRef = useRef(chats);
  const messagesRef = useRef(messages); // Keep messages ref updated
  const socketRef = useRef(socket); // Keep a ref for the socket instance too

  // Update refs whenever the state changes
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

  // --- API and User Configuration ---
  const API_BASE_URL =
    "https://oy0bs62jx8.execute-api.us-east-1.amazonaws.com/Prod";

  // API Endpoints based on provided Dart code (adjust if needed based on your actual backend)
  const SEND_MESSAGE_ENDPOINT = `${API_BASE_URL}/v1/chat`; // Corresponds to '/chat' via POST
  const MARK_AS_READ_ENDPOINT = `${API_BASE_URL}/v1/vehicle/read_messages`; // Corresponds to '/vehicle/read_messages' via PUT

  const customer = JSON.parse(localStorage.getItem("customer"));

  const USER_ID =
    customer?.username ||
    customer?.userAttributes?.find((attr) => attr.Name === "sub")?.Value ||
    "";
  const USER_FIRST_NAME =
    customer?.userAttributes?.find((attr) => attr.Name === "given_name")
      ?.Value || "customer";
  const USER_LAST_NAME =
    customer?.userAttributes?.find((attr) => attr.Name === "family_name")
      ?.Value || "User";
  const USER_BIO = "customer";

  // Construct WebSocket URL using the user's ID
  // Make sure this URL supports appending user ID as a query parameter
  const WEBSOCKET_URL = `wss://0a1xxqdv9b.execute-api.us-east-1.amazonaws.com/production/?id=${USER_ID}`;

  // --- Helper to format fetched messages ---
  // This formats messages received from the initial fetch API call
  const formatFetchedMessages = useCallback((messagesArray) => {
    if (!Array.isArray(messagesArray)) return [];
    const formatted = messagesArray.map((msg) => ({
      // Assume backend ID is the primary ID
      id: msg.id,
      senderId: msg.sender?.id, // Access sender ID via sender object
      content: msg.message, // Fetched messages use 'message' field
      timestamp: new Date(msg.created_at).getTime(), // Use created_at from fetch
      media_url: msg.media_url,
      is_read: msg.is_read,
      ttl: msg.ttl,
      status: "sent", // Assume fetched messages are already sent/delivered
    }));
    // Sort messages by timestamp to ensure correct order
    formatted.sort((a, b) => a.timestamp - b.timestamp);
    return formatted;
  }, []); // No dependencies needed

  // --- Helper to format messages received via WebSocket ---
  // This formats messages received in real-time via the WS connection
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
      content: messageData.messageContent, // WS messages use 'messageContent'
      timestamp: new Date(messageData.timestamp).getTime(), // Assuming WS provides timestamp
      media_url: messageData.media_url || "",
      is_read: messageData.is_read || false, // Assume WS provides read status
      ttl: messageData.ttl,
      status: "delivered", // Assume WS messages are delivered
    };
  }, []); // No dependencies needed

  // --- API Functions ---

  // Function to fetch all chat sessions for the current user (Admin)
  // Wrapped in useCallback because it's used in useEffect dependencies and other callbacks
  const fetchChatSessions = useCallback(
    async (userId) => {
      console.log("Fetching chat sessions for user:", userId);
      // Show loading spinner if there are no chats currently displayed
      if (chatsRef.current.length === 0) {
        setLoading(true);
      } else {
        // Show a subtle loading state on the refresh icon if chats are already loaded
        // The refresh icon already handles this animation based on `loading` state.
        setLoading(true); // Set loading true briefly even if list exists
      }

      setError(null); // Clear previous errors on new fetch

      if (!customer?.AccessToken) {
        console.warn(
          "Authentication token not found during fetchChatSessions."
        );
        setError("User not authenticated.");
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
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          console.error(
            "Failed to fetch chat sessions:",
            response.status,
            errorData
          );
          // If there are existing chats, only show error text below the list, not a full error page
          if (chatsRef.current.length > 0) {
            setError(
              `Failed to refresh chats: ${errorData.message || response.status}`
            );
          } else {
            // If no chats were loaded initially, show the full error page
            throw new Error(
              `Failed to load chats: ${response.status} - ${
                errorData.message || "Unknown Error"
              }`
            );
          }
        } else {
          const result = await response.json();
          console.log("Chat sessions data received:", result);

          if (result && result.success && Array.isArray(result.data)) {
            const chatsWithFormattedMessages = result.data.map((chat) => ({
              ...chat,
              messages: formatFetchedMessages(chat.messages),
            }));
            setChats(chatsWithFormattedMessages);
            console.log(
              "Chats state updated successfully after fetch with formatted messages."
            );
          } else {
            console.warn(
              "Fetch chat sessions response ok but 'data' field is not an array or success is false:",
              result
            );
            setChats([]); // Clear chats if data format is unexpected
            console.log("Chats state set to empty array after fetch issue.");
          }
          setError(null); // Clear any previous fetch error on successful load
        }
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
        setError(err.message); // Update error state
        // Only clear chats on error if there were no chats initially displayed
        if (chatsRef.current.length === 0) {
          setChats([]);
        }
        console.log("fetchChatSessions finished with error.");
      } finally {
        setLoading(false); // Always turn off main loading
        setDirectChatLoading(false); // Ensure direct chat loading is also off
        console.log("fetchChatSessions finally block.");
      }
    },
    [customer?.AccessToken, USER_ID, formatFetchedMessages] // Dependencies for fetchChatSessions
  );

  // Function to fetch or create a direct chat session with a specific target user
  // Wrapped in useCallback because it's used in useEffect dependencies
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
      setDirectChatLoading(true); // Use specific directChatLoading
      setError(null); // Clear previous errors on new attempt
      let foundOrCreatedChat = null;

      try {
        console.log("Attempting to fetch or create direct chat session:", {
          initiatorId,
          targetId,
          reservationId,
        });

        if (!customer?.AccessToken) {
          console.warn(
            "Authentication token not found during fetchChatSessionWithTargetUser."
          );
          setError("User not authenticated.");
          setDirectChatLoading(false);
          setChatIdToActivate(null);
          console.log(
            "fetchChatSessionWithTargetUser aborted due to missing auth token."
          );
          return;
        }

        if (!targetId) {
          console.error(
            "Target user ID is missing. Cannot check for existing chat."
          );
          setError("Target user ID missing. Cannot start chat.");
          setDirectChatLoading(false);
          setChatIdToActivate(null);
          console.log(
            "fetchChatSessionWithTargetUser aborted due to missing target ID."
          );
          return;
        }
        // --- Step 1: Check for an existing direct session ---
        console.log(
          `Checking for existing direct session between ${initiatorId} and ${targetId}`
        );
        const existingSessionResponse = await fetch(
          `${API_BASE_URL}/v1/chat/sessions/direct?participant1=${initiatorId}&participant2=${targetId}`,
          { headers: { Authorization: `Bearer ${customer.AccessToken}` } }
        );

        if (existingSessionResponse.ok) {
          const result = await existingSessionResponse.json();
          console.log("Existing session check response:", result);

          if (
            result &&
            result.success &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            foundOrCreatedChat = result.data[0];
            console.log("Existing chat session found:", foundOrCreatedChat.id);
            // Mark this chat's ID to be activated *after* fetching all chats
            setChatIdToActivate(foundOrCreatedChat.id);
            console.log(
              "Chat ID marked for activation:",
              foundOrCreatedChat.id
            );
          } else {
            console.log("No existing session found.");
          }
        } else if (existingSessionResponse.status === 404) {
          console.log(
            "Existing session check returned 404. No existing session found."
          );
        } else {
          const errorData = await existingSessionResponse
            .json()
            .catch(() => ({ message: "Failed to parse error response." }));
          console.error(
            "Error checking for existing chat session (non-404, non-2xx error):",
            existingSessionResponse.status,
            errorData
          );
          // If the check fails with a server error, set an error and stop
          setError(
            `Failed to check for existing chat: ${
              errorData.message || existingSessionResponse.status
            }`
          );
          setDirectChatLoading(false);
          setChatIdToActivate(null); // Clear activation intent on error
          console.log(
            "fetchChatSessionWithTargetUser aborted due to existing chat check error."
          );
          return; // Stop here on error
        }

        // --- Step 2: Create a new session ONLY IF one was not found ---
        if (!foundOrCreatedChat) {
          console.log(
            "No existing session found, attempting to create a new one."
          );
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
              .catch(() => ({ message: "Failed to parse error response" }));
            console.error(
              "Failed to create new chat session:",
              newSessionResponse.status,
              errorData
            );
            throw new Error(
              `Failed to create chat: ${newSessionResponse.status} - ${
                errorData.message || "Unknown Error"
              }`
            );
          }

          const result = await newSessionResponse.json();
          console.log("New session created response:", result);

          if (
            result &&
            result.success &&
            result.session &&
            typeof result.session === "object" &&
            result.session !== null
          ) {
            foundOrCreatedChat = result.session;
            console.log("Newly created chat session:", foundOrCreatedChat.id);
            setChatIdToActivate(foundOrCreatedChat.id); // Mark this chat's ID for activation
            console.log(
              "New chat ID marked for activation:",
              foundOrCreatedChat.id
            );
          } else {
            console.error(
              "New session response ok but 'session' field is missing or success is false:",
              result
            );
            throw new Error(
              "Failed to get new chat session data from response."
            );
          }
        }

        // --- Step 3: After finding or creating the chat, fetch all chats ---
        console.log("Fetching all chat sessions after handling direct chat.");
        // This ensures the sidebar lists the new/found chat and its messages are available
        // Wait for this to complete before finishing the direct chat flow
        await fetchChatSessions(USER_ID); // Pass USER_ID to fetch sessions for the customer
        console.log(
          "fetchChatSessionWithTargetUser finished, fetchChatSessions completed."
        );
      } catch (err) {
        console.error("Error in fetchChatSessionWithTargetUser:", err);
        setError(err.message); // Update error state for UI
        setDirectChatLoading(false); // Turn off loading
        setChatIdToActivate(null); // Clear activation intent on error
        // Do NOT clear activeChat/messages here, the activation effect handles cleaning up if the list is empty
        console.log("fetchChatSessionWithTargetUser finished with error.");
      } finally {
        // directChatLoading is turned off in catch or after fetchChatSessions completes
        console.log("fetchChatSessionWithTargetUser finally block.");
      }
    },
    [
      customer?.AccessToken,
      USER_ID,
      fetchChatSessions, // Include fetchChatSessions as dependency since it's called
    ] // Dependencies
  );

  const deleteChatSession = useCallback(
    async (chatId) => {
      if (!window.confirm("Are you sure you want to delete this chat?")) {
        return;
      }

      try {
        console.log("Deleting chat session with ID:", chatId);
        setError(null); // Clear previous errors

        if (!customer?.AccessToken) {
          console.warn(
            "Authentication token not found during deleteChatSession."
          );
          setError("User not authenticated.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/v1/chat/${chatId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${customer.AccessToken}` },
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          console.error(
            "Failed to delete chat session:",
            response.status,
            errorData
          );
          throw new Error(
            `Failed to delete chat session: ${response.status} - ${
              errorData.message || "Unknown Error"
            }`
          );
        }

        console.log("Chat session deleted successfully:", chatId);

        // Refetch all sessions after deletion to update the list
        await fetchChatSessions(USER_ID); // Pass USER_ID
        console.log("deleteChatSession finished, fetchChatSessions completed.");

        // If the deleted chat was the active one, clear active chat state
        if (activeChatRef.current?.id === chatId) {
          console.log("Deleted active chat, clearing activeChat state.");
          setActiveChat(null);
          setMessages([]); // Clear messages for the deleted chat
          setChatIdToActivate(null); // Clear activation intent as well
          console.log("Active chat cleared after deletion.");
        } else {
          console.log(
            "Deleted non-active chat. No need to change activeChat state."
          );
        }
        setError(null); // Clear error on successful deletion
      } catch (err) {
        setError(err.message); // Update error state for UI
        console.error("Error deleting chat session:", err);
        alert(`Failed to delete chat: ${err.message}`); // Simple user feedback
        console.log("deleteChatSession finished with error.");
      }
    },
    [customer?.AccessToken, USER_ID, fetchChatSessions] // fetchChatSessions added as dependency
  );

  // --- Mark Chat As Read Function ---
  // Wrapped in useCallback because it's used in useEffect dependencies and WebSocket onmessage
  const markChatAsRead = useCallback(
    async (chatId) => {
      if (!chatId || !USER_ID || !customer?.AccessToken) {
        console.warn(
          "Cannot mark chat as read: Missing chat ID, user ID, or auth token."
        );
        // Don't set a user-visible error for this internal function failure
        return;
      }
      console.log(
        `Attempting to mark chat session ${chatId} as read for user ${USER_ID}.`
      );
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
          // Log the error but don't necessarily block UI or show a big error message
          // as marking as read is a background task.
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          console.error(
            `Failed to mark chat ${chatId} as read:`,
            response.status,
            errorData
          );
          // You could add a subtle notification here if needed
        } else {
          console.log(`Chat session ${chatId} marked as read successfully.`);
          // As per Dart code, refetch sessions to update unread counts in the sidebar
          // Use .then().catch() or await, depending on whether subsequent actions depend on the refetch finishing
          fetchChatSessions(USER_ID).catch((err) =>
            console.error("Error refetching chats after marking as read:", err)
          );
        }
      } catch (err) {
        console.error(`Network error marking chat ${chatId} as read:`, err);
        // You could add a subtle notification here if needed
      }
    },
    [customer?.AccessToken, USER_ID, fetchChatSessions, MARK_AS_READ_ENDPOINT] // fetchChatSessions added as dependency
  );

  // --- WebSocket Setup Effect (Remains for Receiving Messages) ---
  // This effect handles the WebSocket lifecycle independently
  useEffect(() => {
    console.log("WebSocket useEffect triggered.");
    console.log(
      "socketRef.current status on trigger:",
      socketRef.current?.readyState
    );

    if (!USER_ID) {
      console.warn("USER_ID not available. Cannot setup WebSocket.");
      // Ensure socket is closed and state is null if USER_ID becomes unavailable
      if (
        socketRef.current &&
        socketRef.current.readyState < WebSocket.CLOSING
      ) {
        console.log("Closing WebSocket due to missing USER_ID.");
        socketRef.current.close(1000, "User ID missing");
      }
      // No need to call setSocket(null) here, onclose will handle it
      return; // Exit effect if USER_ID is missing
    }

    // Define the connectWebSocket function *inside* the effect
    // This function will handle creating a NEW socket instance and setting up listeners
    const connectWebSocket = () => {
      console.log(`Attempting to connect WebSocket to ${WEBSOCKET_URL}`);

      // Check if a socket is already connecting or open via the ref before creating a new one
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.CONNECTING ||
          socketRef.current.readyState === WebSocket.OPEN)
      ) {
        console.log(
          "WebSocket already exists and is connecting or open via ref. Skipping creation attempt."
        );
        return; // Do not create a new socket instance
      }

      console.log(
        `Attempting to create NEW WebSocket instance to ${WEBSOCKET_URL}`
      );
      const newSocket = new WebSocket(WEBSOCKET_URL);
      // Do NOT set socket state here immediately. Set it only on successful 'onopen'.
      // This prevents effect re-runs from a transient 'socket is not null' state before it's fully connected.

      newSocket.onopen = () => {
        console.log("WebSocket connected successfully");
        setSocket(newSocket); // *** Set the socket state here on success ***
        setError(null); // Clear network errors on successful connection
      };

      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("WebSocket message received:", message);

          // Handle incoming new messages from *other* users
          // We are using HTTP POST for sending our own messages now,
          // so we should ignore WS messages where senderId is our USER_ID
          if (
            message.type === "message" &&
            message.event === "NEW" && // Assuming 'NEW' event for new messages
            message.data &&
            message.data.chatId &&
            message.data.senderId &&
            message.data.messageContent !== undefined && // Check for message content existence
            message.data.senderId !== USER_ID // <<< IMPORTANT: Only process messages from others
          ) {
            const newMessageData = message.data;
            const targetChatId = newMessageData.chatId;

            // Format the incoming WS message
            const formattedNewMessage = formatWebSocketMessage(newMessageData);
            if (!formattedNewMessage) {
              console.warn(
                "Received invalid message structure from WS:",
                newMessageData
              );
              return; // Skip if formatting failed
            }

            // Check if the message is for the currently active chat using ref
            if (
              activeChatRef.current &&
              targetChatId === activeChatRef.current.id
            ) {
              console.log(
                "New message for active chat received via WS, appending:",
                formattedNewMessage
              );
              // Update the messages state using the functional form
              setMessages((prevMessages) => {
                // Check if the message is already present (shouldn't be if senderId !== USER_ID filter works,
                // but defensive check is good)
                if (
                  formattedNewMessage.id &&
                  prevMessages.some((msg) => msg.id === formattedNewMessage.id)
                ) {
                  console.log(
                    `Duplicate WS message ID ${formattedNewMessage.id} received (or senderId filter issue), skipping append.`
                  );
                  return prevMessages;
                }
                const updatedMessages = [...prevMessages, formattedNewMessage];
                // Keep messages sorted if needed, though appending usually maintains order
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp); // Re-sort just in case
                return updatedMessages;
              });
              // If a new message arrives for the *active* chat from another user, mark it as read immediately
              // This assumes the backend handles "read" state for incoming messages as well.
              // This might be redundant if the backend marks incoming messages for the active user as read automatically.
              // Decide based on backend behavior. For now, let's call markAsRead.
              markChatAsRead(targetChatId); // Mark the active chat as read
            } else {
              console.log(
                `New message received via WS for chat ID ${targetChatId}. This is not the active chat. Refetching sessions to update sidebar.`
              );
              // If a message arrives for a non-active chat, refetch sessions to update unread counts in the sidebar
              fetchChatSessions(USER_ID).catch(console.error); // Pass USER_ID
            }
          } else if (message.data?.senderId === USER_ID) {
            // This is a message sent by the current user, likely an echo from the server.
            // We are handling our own sent messages via optimistic updates and HTTP POST confirmation,
            // so we *ignore* WS echoes of our own messages to avoid duplicates or status conflicts.
            console.log(
              "Received WS message from self, ignoring as HTTP POST handles sends:",
              message
            );
          } else {
            console.log(
              "Received non-message or unexpected message structure via WS:",
              message
            );
            if (message.message === "Internal server error") {
              console.error(
                "Backend reported Internal server error over WebSocket."
              );
            }
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
        console.log("WebSocket disconnected", event.code, event.reason);
        setSocket(null); // Clear socket state when it closes

        if (!event.wasClean && event.code !== 1000) {
          console.warn(
            "WebSocket closed uncleanly or due to error. Attempting to reconnect in 3s..."
          );
          // Inform user only if not currently trying to open a direct chat which might cause transient issues
          if (!directChatLoading) {
            setError("Chat connection lost. Reconnecting...");
          }
          // Schedule the *local* connectWebSocket function for this effect instance
          setTimeout(connectWebSocket, 3000);
        } else {
          console.log("WebSocket closed cleanly.");
          setError(null); // Clear connection error on clean close
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Update error state, but avoid overwriting direct chat loading error
        if (!directChatLoading) {
          setError("Chat connection error. Please wait for reconnect...");
        }
      };

      // Return the socket instance created in this call for the cleanup function
      return newSocket;
    };

    // Start the connection attempt. The socket state is managed inside connectWebSocket.
    const socketInstanceForCleanup = connectWebSocket();

    // Cleanup function: close the socket instance that was returned by connectWebSocket in *this specific effect run*.
    return () => {
      console.log("WebSocket useEffect cleanup: Closing socket if needed.");
      // Check if the socket instance from *this effect run's creation* is still open/connecting
      if (
        socketInstanceForCleanup &&
        socketInstanceForCleanup.readyState !== WebSocket.CLOSING &&
        socketInstanceForCleanup.readyState !== WebSocket.CLOSED
      ) {
        console.log("Closing WebSocket cleanly during cleanup.");
        socketInstanceForCleanup.close(
          1000,
          "Component Unmount/Dependency Change"
        ); // Clean close
      }
      console.log("WebSocket useEffect cleanup finished.");
      // Note: setSocket(null) is handled by the onclose handler triggered by socketInstanceForCleanup.close()
    };
  }, [
    USER_ID,
    WEBSOCKET_URL,
    fetchChatSessions,
    directChatLoading,
    markChatAsRead,
    formatWebSocketMessage,
  ]); // Added formatWebSocketMessage dependency

  // --- Send Message Via HTTP POST (Handles Optimistic Update) ---
  const sendMessageViaHttp = useCallback(
    async (chatId, senderId, text, tempId, mediaUrl = "") => {
      console.log(
        `Attempting to send message via HTTP POST to chat ${chatId} with tempId ${tempId}:`,
        text
      );

      if (!customer?.AccessToken) {
        console.warn(
          "Authentication token not found during sendMessageViaHttp."
        );
        setError("User not authenticated. Cannot send message.");
        // Mark the optimistic message as failed
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
            Authorization: `Bearer ${customer.AccessToken}`, // Use customer token for sending
          },
          body: JSON.stringify({
            chatId: chatId,
            senderId: senderId,
            messageContent: text, // Matches backend expected field
            mediaUrl: mediaUrl,
          }),
        });

        if (response.status !== 201) {
          // Expecting 201 Created as per Dart code
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          console.error(
            `Failed to send message (HTTP status ${response.status}) for tempId ${tempId}:`,
            errorData
          );
          const errorMessage =
            errorData.message ||
            `Failed to send message (status ${response.status})`;
          setError(errorMessage);
          // Mark optimistic message as failed
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === tempId
                ? { ...msg, status: "failed", error: errorMessage }
                : msg
            )
          );
          // Even on 400, if the backend *did* save it before erroring,
          // a subsequent fetch might show it. Refetching here is okay but maybe noisy.
          // Let's only refetch on *success* to confirm the message is now in the list.
        } else {
          // *** SUCCESS CASE (Status 201) ***
          const result = await response.json();
          console.log(
            `Message sent successfully via HTTP for tempId ${tempId}:`,
            result
          );

          // Assuming the backend returns the created message object in 'data' field
          if (result && result.success && result.data) {
            const serverMessageData = result.data;
            // Format the server message into our standardized format
            const formattedServerMessage = {
              id: serverMessageData.id, // Use server ID
              senderId: serverMessageData.sender?.id || senderId,
              content: serverMessageData.message, // The response likely contains 'message' field
              timestamp: new Date(serverMessageData.created_at).getTime(), // Use created_at from response
              media_url: serverMessageData.media_url,
              is_read: serverMessageData.is_read,
              ttl: serverMessageData.ttl,
              status: "sent", // Or 'delivered' depending on backend lifecycle
            };

            // Update the optimistic message in the state with the server data
            setMessages((prevMessages) => {
              // Find the optimistic message by its temporary ID
              const index = prevMessages.findIndex((msg) => msg.id === tempId);
              if (index > -1) {
                console.log(
                  `Replacing optimistic message ${tempId} with server message ${formattedServerMessage.id}.`
                );
                const updatedMessages = [...prevMessages];
                updatedMessages[index] = formattedServerMessage;
                // Re-sort just in case the server timestamp is very different from client timestamp
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                return updatedMessages;
              } else {
                // This case should ideally not happen if optimistic update always runs first
                // but as a fallback, add the server message if the temp one wasn't found.
                // Add a check to prevent adding if the server ID is already present (e.g., from WS echo that arrived first)
                if (
                  formattedServerMessage.id &&
                  prevMessages.some(
                    (msg) => msg.id === formattedServerMessage.id
                  )
                ) {
                  console.log(
                    `Server message ${formattedServerMessage.id} already exists in state (tempId ${tempId} not found). Skipping append.`
                  );
                  return prevMessages; // Message already exists (e.g., WS arrived before HTTP response was processed)
                }
                console.warn(
                  `Optimistic message with tempId ${tempId} not found in state. Appending server message ${formattedServerMessage.id} as fallback.`
                );
                const updatedMessages = [
                  ...prevMessages,
                  formattedServerMessage,
                ];
                updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
                return updatedMessages;
              }
            });

            setError(null); // Clear any previous error on successful send confirmation

            // --- Call fetchChatSessions here on successful send ---
            // This will update the sidebar, potentially showing the latest message there
            console.log("Message sent successfully, refetching chat sessions.");
            // Note: This is async and doesn't block the message display update in the active window (handled by optimistic update)
            fetchChatSessions(USER_ID).catch((err) =>
              console.error(
                "Error refetching chats after successful send:",
                err
              )
            );
          } else {
            // Backend returned 201 but the 'data' field was missing or success was false
            console.error(
              "Message sent response ok (201) but 'data' field missing or success is false:",
              result
            );
            const errorMessage =
              "Failed to get sent message data from response.";
            setError(errorMessage); // Show an error because we couldn't confirm the message details
            // Mark the optimistic message as failed because we didn't get the server ID/timestamp
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === tempId
                  ? {
                      ...msg,
                      status: "failed",
                      error: "Server response missing message data",
                    }
                  : msg
              )
            );
            // Even in this scenario, a subsequent fetch *might* show the message if the backend saved it.
            // Refetching here is still probably a good idea to potentially reconcile the list state.
            fetchChatSessions(USER_ID).catch((err) =>
              console.error(
                "Error refetching chats after failed data parse:",
                err
              )
            );
          }
        }
      } catch (err) {
        // This catch block handles network errors or errors thrown from non-201 status codes
        console.error(
          `Error sending message via HTTP for tempId ${tempId}:`,
          err
        );
        const errorMessage = err.message || "Failed to send message.";
        // Update error state for UI
        setError(errorMessage);
        // Mark optimistic message as failed
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId
              ? { ...msg, status: "failed", error: errorMessage }
              : msg
          )
        );
        // Consider refetching here too? It's less certain the message saved on network error.
        // For now, let's only refetch on confirmed success (201).
      }
      // Do NOT clear newMessage here, the outer sendMessage does that on optimistic add
    },
    [customer?.AccessToken, USER_ID, SEND_MESSAGE_ENDPOINT, fetchChatSessions] // fetchChatSessions is now a dependency
  );

  const sendMessage = useCallback(
    (message) => {
      fetchChatSessions(USER_ID);
      const trimmedMessage = message.trim();
      if (trimmedMessage && activeChat?.id && USER_ID) {
        const tempId = `client:${uuidv4()}`; // Generate a unique client-side ID

        // 1. Add message to state optimistically
        const optimisticMessage = {
          id: tempId,
          senderId: USER_ID,
          content: trimmedMessage,
          timestamp: Date.now(), // Use client timestamp for immediate display
          media_url: "",
          is_read: true, // Your message is read by you
          ttl: undefined,
          status: "sending", // Status 'sending' for optimistic update
        };

        // IMPORTANT: Use functional update AND clear input *before* the async call
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, optimisticMessage];
          updatedMessages.sort((a, b) => a.timestamp - b.timestamp);
          return updatedMessages;
        });
        setNewMessage(""); // Clear input field immediately
        setError(null); // Clear any previous error when starting a new send

        // 2. Send message via HTTP POST asynchronously
        // Pass the tempId so sendMessageViaHttp can find and update the optimistic message
        sendMessageViaHttp(activeChat.id, USER_ID, trimmedMessage, tempId);
      } else if (!activeChat?.id) {
        // Set error if no chat is selected when trying to send
        setError("Please select a chat to send messages.");
        console.warn("Attempted to send message with no active chat.");
      } else if (!USER_ID) {
        // Set error if user ID is missing when trying to send
        setError("User ID is not available. Cannot send message.");
        console.warn("Attempted to send message with missing USER_ID.");
      } else {
        // Handle case where message is empty or just whitespace
        console.log("Attempted to send empty message.");
      }
    },
    [sendMessageViaHttp, activeChat?.id, USER_ID] // Dependencies for sendMessage
  );

  // --- Effects ---

  // Effect to handle initial data fetching or direct chat setup from URL params
  useEffect(() => {
    console.log("Main data fetching useEffect triggered based on URL/User.");
    if (!USER_ID) {
      console.warn("USER_ID is not available. Cannot fetch chats.");
      setError("User not authenticated. Please log in as customer.");
      setLoading(false);
      setDirectChatLoading(false);
      setChats([]);
      setActiveChat(null);
      setMessages([]);
      setChatIdToActivate(null);
      setRenteeIdFromParams(null);
      console.log("Main data fetching useEffect aborted: USER_ID missing.");
      return;
    }

    const params = new URLSearchParams(location.search);
    const targetUserId = params.get("renteeId");
    const reservationId = params.get("reservationId");
    const targetUserFirstName = params.get("given_name");
    const targetUserLastName = params.get("family_name");

    console.log("targetUserId (from renteeId param):", targetUserId);

    // Clear any previous auto-activation intent when URL changes
    setChatIdToActivate(null);
    setRenteeIdFromParams(targetUserId); // Store this for conditional error messages

    if (targetUserId) {
      console.log(`Direct chat requested with target ID: ${targetUserId}`);
      fetchChatSessionWithTargetUser(
        USER_ID,
        USER_FIRST_NAME,
        USER_LAST_NAME,
        USER_BIO, // Initiator (customer) info
        targetUserId,
        targetUserFirstName, // Target user info from URL
        targetUserLastName,
        "User", // Default bio for target user from URL
        reservationId
      );
    } else {
      console.log(
        "No renteeId param found. Fetching all chat sessions for customer."
      );
      fetchChatSessions(USER_ID);
    }

    // Cleanup function for this effect
    return () => {
      console.log("Main data fetching useEffect cleanup.");
      // If USER_ID becomes empty (e.g., logout), clear states
      // Check against the USER_ID constant captured in this effect's closure
      if (!USER_ID) {
        console.log(
          "Main data fetching useEffect cleanup: Clearing state due to missing USER_ID."
        );
        setChats([]);
        setActiveChat(null);
        setMessages([]);
        setChatIdToActivate(null);
        setRenteeIdFromParams(null);
        setError(null);
      }
      // Consider adding cleanup for any ongoing async operations if cancellation is supported
    };

    // Dependencies: Values that, if changed, should re-run this effect to fetch data.
    // Includes location.search (for URL changes), USER_ID (if customer changes),
    // and the memoized callback functions it directly calls.
    // customer?.AccessToken is needed by the fetch functions.
  }, [
    location.search,
    USER_ID,
    USER_FIRST_NAME,
    USER_LAST_NAME,
    USER_BIO,
    customer?.AccessToken, // Include token as dependency for fetching calls
    fetchChatSessions, // Include useCallback functions
    fetchChatSessionWithTargetUser, // Include useCallback functions
  ]);

  // Effect to handle activating a specific chat after the chat list has been fetched
  useEffect(() => {
    console.log("Chat activation useEffect triggered.");
    console.log(
      "Current chats state IDs:",
      chats.map((c) => c.id)
    );
    console.log("Current chatIdToActivate:", chatIdToActivate);
    console.log("Current renteeIdFromParams:", renteeIdFromParams); // Use state here
    console.log("Current activeChat ID:", activeChat?.id);

    // Logic Order:
    // 1. If a specific chat ID was marked for activation (chatIdToActivate is set) AND that chat exists in the list: activate it.
    // 2. If no specific chat was marked for activation (chatIdToActivate is null/undefined) AND there are chats AND no chat is currently active: activate the first one.
    // 3. Otherwise (no chats, or direct chat failed to find/create AND there are other chats, or active chat is already set), do nothing or clear if chats become empty.

    if (chatIdToActivate && Array.isArray(chats) && chats.length > 0) {
      console.log(
        `Attempting to find chat with ID ${chatIdToActivate} in chats list.`
      );
      const chatToSet = chats.find((chat) => chat.id === chatIdToActivate);
      if (chatToSet) {
        console.log(
          `Attempting to activate chat with ID: ${chatIdToActivate}. Found it.`
        );
        // Only update if it's a different chat than currently active to prevent infinite loop
        if (activeChat?.id !== chatToSet.id) {
          console.log("Setting active chat and messages from found chat.");
          // Messages are already formatted and sorted in the chats state by fetchChatSessions
          setActiveChat(chatToSet);
          setMessages(chatToSet.messages || []); // Set messages for the activated chat
          setError(null); // Clear any general error when a chat is successfully activated

          // --- Call Mark As Read when a chat is activated by chatIdToActivate ---
          markChatAsRead(chatToSet.id);
        } else {
          console.log(
            "Chat ID to activate is already the active chat. No state change needed."
          );
          // If it's the same chat, ensure messages state is up-to-date from the latest chats fetch
          const currentActiveChatInList = chats.find(
            (chat) => chat.id === activeChat.id
          );
          if (currentActiveChatInList) {
            // Messages are already formatted and sorted by fetchChatSessions
            // Check if the messages array content/length has changed before updating state
            if (
              currentActiveChatInList.messages.length !== messages.length ||
              currentActiveChatInList.messages.some((msg, i) =>
                messages[i] ? msg.id !== messages[i].id : true
              )
            ) {
              console.log(
                "Updating messages for the currently active chat based on latest fetch."
              );
              setMessages(currentActiveChatInList.messages || []);
            } else {
              console.log(
                "Messages array for active chat is unchanged, skipping state update."
              );
            }
          } else {
            console.warn(
              "Active chat was not found in the latest chats list during activation effect update."
            );
            // This case should be rare if fetchChatSessions works correctly and the chat wasn't deleted.
            // If it happens, maybe clear active chat? Or rely on chats.length === 0 check later?
          }
          setError(null); // Clear any general error
        }
        // IMPORTANT: Clear chatIdToActivate *after* successfully setting the chat state
        // This prevents this effect from running again with the same chatIdToActivate value
        // when activeChat state updates, thus avoiding a loop.
        console.log(`Clearing chatIdToActivate (${chatIdToActivate}).`);
        setChatIdToActivate(null);
      } else {
        console.warn(
          `Chat with ID ${chatIdToActivate} not found in the fetched chats. Cannot auto-activate.`
        );
        // Clear chatIdToActivate if the chat isn't found in the current chats list
        console.log(
          `Clearing chatIdToActivate (${chatIdToActivate}) because chat was not found in the list.`
        );
        setChatIdToActivate(null);
        // Don't auto-select the first chat here if a specific one was requested and not found.
      }
    } else if (
      chatIdToActivate === null &&
      Array.isArray(chats) &&
      chats.length > 0 &&
      !activeChat
    ) {
      // No specific chat requested (or request failed/cleared), no chat currently active, and chats are loaded.
      // Automatically activate the first chat in the list.
      console.log(
        "No specific chat requested, no active chat. Activating the first chat by default."
      );
      const firstChat = chats[0];
      // Messages are already formatted and sorted in the chats state by fetchChatSessions
      setActiveChat(firstChat);
      setMessages(firstChat.messages || []);
      setError(null);
      // --- Call Mark As Read when the first chat is auto-activated ---
      markChatAsRead(firstChat.id);
    } else if (Array.isArray(chats) && chats.length === 0 && activeChat) {
      // If the chats list becomes empty while a chat is active, clear the active chat.
      console.log("Chats list is empty, clearing active chat.");
      setActiveChat(null);
      setMessages([]);
      setChatIdToActivate(null);
    } else if (Array.isArray(chats) && chats.length > 0 && activeChat) {
      // If chats are loaded, a chat is active, but it's NOT the one requested by chatIdToActivate (which is now null)
      // This handles the case where a direct chat fails/isn't found but the customer has other chats.
      // We just keep the current active chat. No action needed.
      console.log(
        "Chats loaded, active chat exists, and no specific chat requested. Maintaining current active chat."
      );
      // Also ensure the messages for the active chat are up-to-date from the latest chats fetch
      const currentActiveChatInList = chats.find(
        (chat) => chat.id === activeChat.id
      );
      if (currentActiveChatInList) {
        // Messages are already formatted and sorted by fetchChatSessions
        // Only update if the messages list has changed (e.g., new messages arrived via WS or another fetch)
        // A simple length check avoids unnecessary updates if messages are identical
        if (
          currentActiveChatInList.messages.length !== messages.length ||
          currentActiveChatInList.messages.some((msg, i) =>
            messages[i] ? msg.id !== messages[i].id : true
          )
        ) {
          console.log(
            "Updating messages for the currently active chat based on latest fetch."
          );
          setMessages(currentActiveChatInList.messages || []);
        } else {
          console.log(
            "Messages array for active chat is unchanged, skipping state update."
          );
        }
      } else {
        // The active chat was not found in the new list (e.g., deleted) - this case is handled by the previous condition
        console.log(
          "Active chat not found in the latest chats list. Should be handled by chats.length === 0 condition."
        );
      }
    } else {
      console.log(
        "Chat activation useEffect: No action needed based on current state."
      );
    }
  }, [chats, chatIdToActivate, activeChat, messages.length, markChatAsRead]); // Include markChatAsRead dependency

  useEffect(() => {
    // Scroll to the bottom whenever messages update and the chat window is visible
    // Delay slightly to allow potential DOM updates
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current && activeChat) {
        // Only scroll if a chat is active
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0); // Use a 0ms timeout to wait for the DOM to potentially update

    return () => clearTimeout(timeoutId); // Cleanup the timeout on re-render or unmount
  }, [messages, activeChat]); // Include activeChat as dependency

  // Memoized function to get the display name for a chat
  const getChatDisplayName = useCallback(
    (chat) => {
      if (!chat) return "Loading Chat...";

      // Ensure chat.participants is an array before trying to find
      if (!Array.isArray(chat.participants)) {
        console.warn(
          `Chat object for ID ${chat.id} has no valid participants array.`,
          chat
        );
        // Fallback if participants is not a valid array
        return `Chat ${chat.id}` || "Unnamed Chat";
      }

      // Attempt to find the participant who is NOT the current user (customer)
      const otherParticipant = chat.participants.find((p) => p.id !== USER_ID);

      // If otherParticipant was NOT found (find returned undefined or null)
      if (!otherParticipant) {
        // Check if there's *any* participant. If not, it's a weird chat.
        if (chat.participants.length === 0) {
          console.warn(
            `Chat object for ID ${chat.id} has an empty participants array.`
          );
          return `Chat ${chat.id} (No Participants)` || "Unnamed Chat";
        }
        // If participants exist but *none* match the criteria (id !== USER_ID),
        // this likely means the only participant is the USER_ID itself (chat with self).
        // Handle this case
        console.warn(
          `Could not find participant other than USER_ID (${USER_ID}) in chat ID ${chat.id}. Assuming chat with self.`
        );
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
        return `Chat ${chat.id} (Self)`; // Fallback for chat with self
      }

      // If otherParticipant WAS found, try to build the name
      const firstName = otherParticipant.first_name;
      const lastName = otherParticipant.last_name;

      // Build the full name string, filtering out any falsy values (null, undefined, empty string)
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

      if (fullName) {
        return fullName; // Return the formatted full name
      }

      // Fallback if otherParticipant was found, but names were missing/empty strings/null/undefined
      console.warn(
        `Participant names (first_name, last_name) missing/empty for chat ID ${chat.id}, participant ID ${otherParticipant.id}. Falling back to ID.`
      );
      return otherParticipant.id; // Fallback to ID if participant object exists but names are empty
    },
    [USER_ID] // getChatDisplayName depends on USER_ID to identify the "other" participant
  );

  // Helper function to get the participant object by ID from the current active chat
  const getParticipantById = useCallback(
    (participantId) => {
      if (!activeChat || !Array.isArray(activeChat.participants)) {
        return null;
      }
      return activeChat.participants.find((p) => p.id === participantId);
    },
    [activeChat]
  ); // Depends on activeChat

  // --- Render Logic ---

  const showInitialLoading =
    loading && chats.length === 0 && !activeChat && !directChatLoading;
  const showDirectChatLoading = directChatLoading && !activeChat;
  // Show placeholder if no chat is selected AND we are not currently loading a direct chat
  const showChatWindowPlaceholder = !activeChat && !showDirectChatLoading;

  const isInputDisabled =
    !socket ||
    socket.readyState !== WebSocket.OPEN || // Still need WS connection status for input
    !activeChat || // Needs an active chat
    directChatLoading; // Disabled while setting up direct chat
  // Send button disabled if input is empty or input is disabled
  const isSendDisabled = !newMessage.trim() || isInputDisabled;

  if (showInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4">
        {" "}
        {/* Use div with Tailwind classes */}
        {/* Simple Tailwind Spinner (replace with a more complex one if desired) */}
        <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <div className="text-gray-700 text-lg mt-4">Loading chats...</div>{" "}
        {/* Use div with Tailwind typography */}
      </div>
    );
  }

  // Display a persistent error if fetching chats completely failed and no chats are loaded
  if (
    error &&
    chats.length === 0 &&
    !loading &&
    !directChatLoading &&
    !activeChat
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col bg-gray-50 p-4 text-red-600">
        {" "}
        {/* Use div with Tailwind classes */}
        <div className="text-xl font-semibold">Error Loading Chats</div>{" "}
        {/* Use div with Tailwind typography */}
        <div className="text-red-600 mt-2 text-center">{error}</div>{" "}
        {/* Use div with Tailwind typography */}
        <button
          onClick={() => fetchChatSessions(USER_ID)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || directChatLoading} // Prevent multiple retries
        >
          Retry Loading Chats
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 md:pt-20 md:p-8 rounded-xl overflow-hidden shadow-xl">
      {" "}
      {/* Main Container Styling */}
      {/* Sidebar - Chat List */}
      <div className="w-1/4 bg-white rounded-l-xl p-4 flex flex-col border-r border-gray-200">
        {" "}
        {/* Sidebar Styling */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          {" "}
          {/* Added bottom border explicitly */}
          <div className="text-2xl font-bold text-gray-800">Chats</div>{" "}
          {/* Use div with Tailwind Typography */}
          {/* Refresh Button */}
          <button
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fetchChatSessions(USER_ID)}
            disabled={loading || directChatLoading}
            title="Refresh Chats"
          >
            {/* Use the HeroIcon component */}
            <ArrowPathIcon
              className={`w-6 h-6 text-gray-600 ${
                loading || directChatLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
        {/* Optional Tab Section - Keeping for now */}
        {/* Note: Removed redundant border-b pb-2 here as it's now on the header */}
        <div className="flex justify-between mb-4">
          <button
            className={`flex-1 text-center p-2 text-sm ${
              activeTab === "All"
                ? "text-black font-semibold border-b-2 border-black" // Apply active state border
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("All")} // Tab functionality is basic
          >
            All Chats
          </button>
          {/* Add other tabs like "Groups" here if needed */}
          {/* <button className="flex-1 text-center p-2 text-sm text-gray-600 hover:text-gray-800">Groups</button> */}
        </div>
        {/* Loading or Error states for sidebar */}
        {(loading ||
          (directChatLoading && Array.isArray(chats) && chats.length === 0)) &&
          !error && (
            <div className="flex justify-center items-center min-h-[100px]">
              {" "}
              {/* Use div with Tailwind classes */}
              {/* Simple Tailwind Spinner */}
              <div className="w-5 h-5 border-2 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        {error &&
          !loading &&
          !directChatLoading &&
          Array.isArray(chats) &&
          chats.length > 0 && (
            <div className="text-center text-red-500 text-sm mb-4">
              Error listing chats: {error}
            </div>
          )}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {" "}
          {/* Added custom-scrollbar class */}
          {Array.isArray(chats) && chats.length > 0
            ? chats.map((chat) => {
                if (!chat || !chat.id) {
                  console.warn("Skipping chat item due to missing ID:", chat);
                  return null;
                }
                // Ensure participants array exists and is valid before mapping
                if (!Array.isArray(chat.participants)) {
                  console.warn(
                    `Skipping chat ${chat.id} in list render: participants is not an array.`,
                    chat
                  );
                  return null; // Skip rendering chats without valid participants array
                }

                // Find the participant who is not the current user (customer)
                const otherParticipant = chat.participants.find(
                  (p) => p.id !== USER_ID
                );
                const avatarUrl = otherParticipant?.avatar; // Access the avatar URL
                const displayChat_name = getChatDisplayName(chat);

                // Latest message is already formatted and sorted in the chats state
                const latestMessage =
                  Array.isArray(chat.messages) && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1] // Get the last message after sorting by timestamp
                    : null;

                const lastMessageContent = latestMessage
                  ? latestMessage.content
                  : "No messages yet"; // Use standardized 'content'
                const lastMessageTimestamp = latestMessage
                  ? latestMessage.timestamp
                  : null; // Use standardized 'timestamp'

                // Check if there are any unread messages for the current user in this chat
                // This assumes the backend returns 'is_read' status per message, or you need a different API field
                // If the backend returns an unread_count on the chat session, use that instead.
                const hasUnread =
                  Array.isArray(chat.messages) &&
                  chat.messages.some(
                    (msg) => msg.senderId !== USER_ID && !msg.is_read // Message is from someone else and is not read
                  );

                return (
                  <div
                    key={chat.id}
                    className={`flex items-center p-3 mb-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
                      activeChat?.id === chat.id
                        ? "bg-blue-100"
                        : "bg-gray-50 hover:bg-gray-100" // Highlight active chat
                    }`}
                    onClick={() => {
                      console.log("Chat sidebar clicked:", chat.id);
                      if (activeChat?.id !== chat.id) {
                        setActiveChat(chat);
                        // Messages are already formatted and sorted in the chats state
                        setMessages(chat.messages || []); // Set messages for the clicked chat
                        setError(null); // Clear any general error when a chat is successfully activated
                        // --- Call Mark As Read when a chat is manually selected ---
                        markChatAsRead(chat.id);
                      } else {
                        // If clicking the already active chat, just ensure messages are updated from latest fetch
                        const currentActiveChatInList = chats.find(
                          (c) => c.id === activeChat.id
                        );
                        if (currentActiveChatInList) {
                          setMessages(currentActiveChatInList.messages || []);
                        }
                        console.log(
                          "Clicked active chat, messages state should already be up-to-date from fetch."
                        );
                      }
                      setChatIdToActivate(null); // Clear activation intent if user clicks manually
                    }}
                  >
                    {/* Profile Picture / Avatar */}
                    <div className="w-12 h-12 rounded-full mr-4 object-cover flex-shrink-0 shadow-sm">
                      {" "}
                      {/* Increased margin, added shadow */}
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayChat_name || "Avatar"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl rounded-full">
                          {displayChat_name
                            ? displayChat_name.charAt(0).toUpperCase()
                            : "?"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-semibold text-sm text-gray-800 truncate flex items-center">
                        {" "}
                        {/* Adjusted font/color */}
                        {displayChat_name}
                        {/* Unread indicator */}
                        {hasUnread && (
                          <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {" "}
                            {/* Changed to red for unread */}
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs truncate mt-0.5">
                        {" "}
                        {/* Adjusted spacing */}
                        {lastMessageContent}
                      </div>
                    </div>
                    {lastMessageTimestamp && (
                      <div className="text-gray-400 text-xs ml-2 flex-shrink-0 self-start">
                        {" "}
                        {/* Adjusted alignment */}
                        {!isNaN(new Date(lastMessageTimestamp).getTime())
                          ? new Date(lastMessageTimestamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </div>
                    )}
                  </div>
                );
              })
            : !loading &&
              !directChatLoading &&
              Array.isArray(chats) &&
              chats.length === 0 && (
                <div className="text-center text-gray-500 mt-8 text-sm">
                  No chats available
                </div>
              )}
        </div>
      </div>
      {/* Chat Window - Render only if a chat is selected or loading direct chat */}
      {showChatWindowPlaceholder ? (
        <div className="flex-1 bg-white rounded-r-xl p-6 flex flex-col items-center justify-center text-gray-500 border-l border-gray-200">
          {" "}
          {/* Added border */}
          {showDirectChatLoading ? (
            <div className="flex flex-col items-center">
              {/* Simple Tailwind Spinner */}
              <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
              <div className="text-gray-700 text-lg">
                Loading or creating chat...
              </div>{" "}
              {/* Use div with Tailwind typography */}
              {/* Use div with Tailwind typography and color classes */}
              {error && renteeIdFromParams && (
                <div className="mt-4 text-red-600 text-center text-sm">
                  Error setting up chat with rentee: {error}
                </div>
              )}
              {error && !renteeIdFromParams && (
                <div className="mt-4 text-red-600 text-center text-sm">
                  Error: {error}
                </div>
              )}
            </div>
          ) : (
            // Placeholder when no chat is selected
            <>
              <ChatPlaceholderIcon className="w-16 h-16 mb-4 text-gray-400" />{" "}
              {/* Use the SVG component */}
              <div className="text-gray-600 text-lg text-center">
                Select a chat from the sidebar to view messages
              </div>{" "}
              {/* Use div with Tailwind typography */}
              {/* Use div with Tailwind typography and color classes */}
              {error &&
                renteeIdFromParams &&
                !loading &&
                !directChatLoading &&
                !activeChat &&
                Array.isArray(chats) &&
                chats.length > 0 && (
                  <div className="mt-4 text-red-600 text-center text-sm">
                    Could not find or create a chat with the specified user.
                    Error: {error}. Please try selecting an existing chat.
                  </div>
                )}
              {error &&
                renteeIdFromParams &&
                !loading &&
                !directChatLoading &&
                !activeChat &&
                Array.isArray(chats) &&
                chats.length === 0 && (
                  <div className="mt-4 text-red-600 text-center text-sm">
                    Could not set up chat with the specified user. Error:{" "}
                    {error}. No other chats available.
                  </div>
                )}
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-r-xl p-6 flex flex-col border-l border-gray-200">
          {/* Show general error if chat window is active but there's a non-loading error */}
          {/* Changed color to green to indicate it's not a blocking error for the chat itself */}
          {error && !showDirectChatLoading && (
            <div className="text-center text-green-600 mb-4 text-sm">
              {" "}
              {/* Changed to green */}
              Info: {error}
            </div>
          )}
          <div className="flex items-center mb-4 border-b pb-4">
            <div className="text-xl font-bold text-gray-800 flex-1">
              {" "}
              {/* Adjusted font size/weight/color */}
              {getChatDisplayName(activeChat)}
            </div>
            {/* Delete button commented out as in previous code */}
            {/* {activeChat?.id && (
              <button
                className="ml-auto text-red-500 hover:text-red-700 text-sm p-1 rounded-md hover:bg-red-100 transition duration-150 ease-in-out" // Adjusted rounding
                onClick={() => deleteChatSession(activeChat.id)}
                title="Delete Chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.924a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.14-2.006-2.292a48.078 48.078 0 0 0-1.91-.148 48.078 48.078 0 0 0-1.91.148C9.11 2.55 8.2 3.51 8.2 4.694v.916m12 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1-.75-.75m6.75 0H12"
                />
              </svg>
              </button>
            )} */}
          </div>

          {/* Messages Display Area */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2 custom-scrollbar">
            {" "}
            {/* Increased space, added custom-scrollbar */}
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                // Use standardized fields for sender ID, content, and timestamp
                const senderId = msg.senderId;
                const isSentByCurrentUser = senderId === USER_ID;
                const senderParticipant = getParticipantById(senderId);
                // Fallback name if participant details aren't found in the activeChat object
                const senderName = senderParticipant
                  ? [senderParticipant.first_name, senderParticipant.last_name]
                      .filter(Boolean)
                      .join(" ") || senderId
                  : senderId || "Unknown Sender"; // Fallback to ID or Unknown

                return (
                  <div
                    key={msg.id || `msg-${index}`}
                    className={`flex my-4 ${
                      isSentByCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end ${
                        isSentByCurrentUser ? "flex-row-reverse" : ""
                      }`}
                    >
                      {" "}
                      {/* Reverse flex for received message layout */}
                      {/* Avatar */}
                      {(isSentByCurrentUser
                        ? getParticipantById(USER_ID)?.avatar
                        : senderParticipant?.avatar) && (
                        <img
                          src={
                            isSentByCurrentUser
                              ? getParticipantById(USER_ID)?.avatar
                              : senderParticipant?.avatar
                          }
                          alt={isSentByCurrentUser ? "You" : senderName}
                          className={`w-8 h-8 rounded-full object-cover shadow-sm flex-shrink-0 ${
                            isSentByCurrentUser ? "ml-2" : "mr-2"
                          }`}
                        />
                      )}
                      <div
                        className={`max-w-[200px] md:max-w-[500px] p-3 rounded-xl shadow-sm break-words flex flex-col ${
                          // Adjusted max-width for responsiveness
                          isSentByCurrentUser
                            ? "bg-blue-600 text-white rounded-br-none" // Darker blue for sent
                            : "bg-gray-200 text-gray-800 rounded-bl-none" // Lighter gray for received, darker text
                        } ${
                          msg.status === "failed" ? "border border-red-500" : ""
                        }`}
                      >
                        {msg.content} {/* Use standardized content field */}
                        {/* Sending status */}
                        {msg.status === "sending" && (
                          <div className="text-[10px] mt-1 text-blue-300 self-end">
                            Sending...
                          </div> // Status aligned to end
                        )}
                        {msg.status === "failed" && (
                          <div
                            className="text-[10px] mt-1 text-red-400 self-end"
                            title={msg.error}
                          >
                            Failed!
                          </div> // Status aligned to end
                        )}
                        {/* Timestamp */}
                        {msg.timestamp &&
                          !isNaN(new Date(msg.timestamp).getTime()) && (
                            <div
                              className={`text-[10px] mt-1 ${
                                isSentByCurrentUser
                                  ? "text-blue-300" // Lighter timestamp for sent
                                  : "text-gray-500" // Darker timestamp for received
                              } self-end`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 italic mt-8 text-sm">
                No messages yet. Start the conversation!
              </div>
            )}
            {/* Ref for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Buttons */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {/* Add more quick replies as needed */}
            {[
              "Let's do it!",
              "Great!",
              "When are you available?",
              "Sounds good",
            ].map((reply, index) => (
              <button
                key={index}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 text-sm flex-shrink-0 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed" // Adjusted quick reply styling
                onClick={() => sendMessage(reply)}
                disabled={isSendDisabled}
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input Area */}
          <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-inner">
            {" "}
            {/* Adjusted padding/rounding */}
            <input
              type="text"
              placeholder={
                isInputDisabled
                  ? !socket ||
                    (socket.readyState !== WebSocket.OPEN &&
                      socket.readyState !== WebSocket.CONNECTING)
                    ? "Chat service unavailable" // Socket not open/connecting
                    : "Connecting to chat service..." // Socket connecting
                  : !activeChat
                  ? "Select a chat to type" // No chat selected
                  : "Type your message..." // Ready to type
              }
              className="flex-1 bg-transparent outline-none px-3 text-sm text-gray-800 placeholder-gray-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(newMessage)}
              disabled={isInputDisabled}
            />
            <button
              className="ml-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              onClick={() => sendMessage(newMessage)}
              disabled={isSendDisabled}
              title="Send Message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 transform rotate-90"
              >
                <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 109.817 109.817 0 0 0 3.58-1.139L15.15 18a.75.75 0 0 0 1.404-.128 9.74 9.74 0 0 0 5.634-4.35.75.75 0 0 0 0-.752 9.74 9.74 0 0 0-5.634-4.35.75.75 0 0 0-1.404-.128L7.065 3.544a109.817 109.817 0 0 0-3.58-1.139Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
