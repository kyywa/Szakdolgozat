import { Component, useContext, useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";
import moment from "moment";

import ScrollToBottom from "react-scroll-to-bottom";
import swal from "sweetalert";

import "../Messages.css";

const MessagesContext = React.createContext([]);
const MenuContext = React.createContext();

const authToken = Cookies.get("authToken");

axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

export default class Messages extends Component {
  constructor() {
    super();

    this.state = {
      messages: [],
      menuContent: undefined,
    };

    this.pushMessage = (message) => {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, message],
      }));
    };

    this.updateMessages = (messages) => {
      this.setState((state) => ({
        ...state,
        messages: messages,
      }));
    };

    this.setMenuContent = (menuContent) => {
      this.setState((state) => ({
        ...state,
        menuContent: menuContent,
      }));
    };
  }

  componentDidMount() {
    // For auto login
    const authToken = Cookies.get("authToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

    axios
      .get("https://localhost:7172/api/Messages/GetAllMessages")
      .then((response) => {
        this.setState((state) => ({
          ...state,
          messages: response.data.map((message) => ({
            ...message,
            date: new Date(message.date),
          })),
        }));
      })
      .catch(() => {
        swal("Oops", "Error while requests messages", "error");
      });
  }

  render() {
    return (
      <MenuContext.Provider
        value={{
          setMenuContent: this.setMenuContent,
        }}
      >
        <MessagesContext.Provider
          value={{
            messages: this.state.messages,
            pushMessage: this.pushMessage,
            updateMessages: this.updateMessages,
          }}
        >
          <div className="message-container">
            <div className="outlet">
              <div className="menu">{this.state.menuContent}</div>
              <div className="outlet-content">
                <Outlet />
              </div>
            </div>
          </div>
        </MessagesContext.Provider>
      </MenuContext.Provider>
    );
  }
}

// View all message

export function AllMessages() {
  const navigate = useNavigate();
  const { setMenuContent } = useContext(MenuContext);
  const { messages } = useContext(MessagesContext);
  const [username] = useState(decodeToken(Cookies.get("authToken")).username);

  function decodeToken(token) {
    const tokenBody = token.split(".")[1];
    return JSON.parse(atob(tokenBody));
  }

  function openCorrespondence(username) {
    navigate(`/messages/single-message/${username}`);
  }

  function createCorrespondences() {
    const correspondences = new Map();

    messages.forEach((message) => {
      if (message.sender.toLowerCase() !== username.toLowerCase()) {
        if (!correspondences.has(message.sender)) {
          const searchedUsername = message.sender;
          const relevantMessages = messages
            .filter(
              (message) =>
                message.sender === searchedUsername ||
                message.receiver === searchedUsername
            )
            .sort(function (a, b) {
              return a.date - b.date;
            });
          correspondences.set(searchedUsername, {
            username: searchedUsername,
            messageCount: relevantMessages.length,
            lastMessageDate: relevantMessages[relevantMessages.length - 1].date,
          });
        }
      } else {
        if (!correspondences.has(message.receiver)) {
          const searchedUsername = message.receiver;
          const relevantMessages = messages
            .filter(
              (message) =>
                message.sender === searchedUsername ||
                message.receiver === searchedUsername
            )
            .sort(function (a, b) {
              return a.date - b.date;
            });

          correspondences.set(searchedUsername, {
            username: searchedUsername,
            messageCount: relevantMessages.length,
            lastMessageDate: relevantMessages[relevantMessages.length - 1].date,
          });
        }
      }
    });

    const result = [];
    correspondences.forEach((correspondence) => {
      result.push(correspondence);
    });

    result.sort(function (a, b) {
      return b.lastMessageDate - a.lastMessageDate;
    });

    return result;
  }

  useEffect(() => {
    setMenuContent(
      <div>
        <button
          className="menu-button left"
          onClick={() => navigate("/messages/create-message")}
        >
          New Message
        </button>
      </div>
    );
  }, []);

  return (
    <div className="text-white correspondences-container">
      <ul className="correspondence-box d-flex flex-column gap-3">
        {createCorrespondences().map((correspondence, index) => (
          <li
            className="correspondence d-flex flex-column"
            key={index}
            onClick={() => openCorrespondence(correspondence.username)}
          >
            <div className="d-flex justify-content-between">
              <div>{correspondence.username}</div>
              <div>{moment(correspondence.lastMessageDate).format("LLL")}</div>
            </div>
            <div className="d-flex justify-content-between">
              <div>{correspondence.messageCount} messages</div>
              <div>
                {moment(correspondence.lastMessageDate, "YYYYMMDD").fromNow()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CreateMessage() {
  const navigate = useNavigate();
  const { pushMessage } = useContext(MessagesContext);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const { setMenuContent } = useContext(MenuContext);

  const [searhedUsers, setSearchedUsers] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const handleReceiverChange = (event) => {
    const keyword = event.target.value;
    setReceiver(keyword);
    setIsFocus(true);

    if (keyword.length > 2) {
      axios
        .get(`https://localhost:7172/api/Player/GetPlayerList?input=${keyword}`)
        .then((response) => {
          setSearchedUsers(response.data);
        })
        .catch(() => {
          setSearchedUsers([]);
        });
    } else {
      setSearchedUsers([]);
    }
  };

  const handleReceiverFocus = () => {
    setIsFocus(true);
  };

  function handleReceiverOutsideClick(event) {
    if (event.target.id !== "blurable") {
      setIsFocus(false);
    }
  }

  const updateReceiverInput = (username) => {
    setReceiver(username);
    setSearchedUsers([]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const searchedUserslist = () => {
    const list = searhedUsers.map((username, index) => {
      const keywordStartIndex = username
        .toLowerCase()
        .indexOf(receiver.toLowerCase());
      const keywordLastIndex = keywordStartIndex + receiver.length;

      const startSection = username.substring(0, keywordStartIndex);
      const highlightedSection = username.substring(
        keywordStartIndex,
        keywordLastIndex
      );
      const endSection = username.substring(keywordLastIndex);

      return (
        <li key={index} onClick={() => updateReceiverInput(username)}>
          {startSection}
          <i className="text-highlight">{highlightedSection}</i>
          {endSection}
        </li>
      );
    });
    return list;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const createdMessage = {
      receiver: receiver,
      message: message,
    };

    axios
      .post("https://localhost:7172/api/Messages/CreateMessage", createdMessage)
      .then((response) => {
        let message = response.data;
        message = { ...message, date: new Date(message.date) };

        pushMessage(message);
        setMessage("");
        setIsFocus(false);

        swal("Succeess", "Message send successfully.", "success");
      })
      .catch((error) => {
        if (error.response.data.includes("No user with this username.")) {
          swal("Oops", "No user with this username.", "error");
        } else if (
          error.response.data.includes("You can't send message to you.")
        ) {
          swal("Oops", "You can't send a message to yourself.", "error");
        } else {
          swal("Oops", "An unknown error occured.", "error");
        }
      });
  };

  useEffect(() => {
    window.addEventListener("click", handleReceiverOutsideClick);

    setMenuContent(
      <div>
        <button
          className="menu-button right"
          onClick={() => navigate("/messages")}
        >
          X
        </button>
      </div>
    );

    return () => {
      window.removeEventListener("click", handleReceiverOutsideClick);
    };
  }, []);

  return (
    <form className="create-message-form text-white" onSubmit={handleSubmit}>
      <div className="search-box">
        <div className="custom-input-group">
          <div className="label">Receiver's username</div>
          <input
            id="blurable"
            type="text"
            value={receiver}
            onChange={handleReceiverChange}
            onFocus={handleReceiverFocus}
            autoComplete="off"
          ></input>
        </div>

        <ul id="blurable" className={!isFocus ? "d-none" : ""}>
          {searchedUserslist()}
        </ul>
      </div>
      <textarea
        className="message-area"
        value={message}
        onChange={handleMessageChange}
        autoComplete="off"
      ></textarea>
      <button
        className="menu-button"
        type="submit"
        disabled={message.length === 0}
      >
        Send message
      </button>
    </form>
  );
}

// Single message
export function SingleMessage() {
  const navigate = useNavigate();
  const { messages, pushMessage, updateMessages } = useContext(MessagesContext);
  const { username } = useParams();
  const [messagesByConversation, setMessagesByConversation] = useState([]);
  const [response, setResponse] = useState("");
  const { setMenuContent } = useContext(MenuContext);

  const [loginedUsername] = useState(
    decodeToken(Cookies.get("authToken")).username
  );

  function decodeToken(token) {
    const tokenBody = token.split(".")[1];
    return JSON.parse(atob(tokenBody));
  }

  const handleChange = (event) => {
    setResponse(event.target.value);
  };

  const submitMessage = () => {
    const createdMessage = {
      receiver: username,
      message: response,
    };

    axios
      .post("https://localhost:7172/api/Messages/CreateMessage", createdMessage)
      .then((response) => {
        let message = response.data;
        message = { ...message, date: new Date(message.date) };

        pushMessage(message);
        setResponse("");
      })
      .catch(() => {
        swal("Oops", "An unknow error occured.", "error");
      });
  };

  const deleteConversation = () => {
    axios
      .delete(
        `https://localhost:7172/api/Messages/DeleteConversation?partnerUsername=${username}`
      )
      .then(() => {
        const messagesWithoutDeleted = messages.filter(
          (message) =>
            message.receiver !== username && message.sender !== username
        );
        updateMessages(messagesWithoutDeleted);

        navigate("/messages");
        swal("Success", "Conversation deleted successfully.", "success");
      })
      .catch(() => {
        swal("Oops", "An unknow error occured.", "error");
      });
  };

  useEffect(() => {
    const messagesByConversation = messages
      .filter(
        (message) =>
          message.receiver === username || message.sender === username
      )
      .map((message) => ({
        ...message,
        date: new Date(message.date),
      }))
      .sort((a, b) => {
        return a.date - b.date;
      });

    setMessagesByConversation(messagesByConversation);
  }, [messages, username]);

  useEffect(() => {
    setMenuContent(
      <div>
        <p>{username}</p>
        <button
          className="menu-button right"
          onClick={() => navigate("/messages")}
        >
          X
        </button>
      </div>
    );
  }, []);

  return (
    <div className="text-white chat-container">
      <ScrollToBottom className="ul" debounce={0}>
        {messagesByConversation.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === loginedUsername
                ? "align-items-end text-end li"
                : "align-items-start text-start li"
            }
          >
            <div className="w-75">{message.message}</div>
            <div
              className={
                message.sender === loginedUsername
                  ? "d-flex gap-2 message-date w-75 justify-content-end"
                  : "d-flex gap-2 message-date w-75 justify-content-start"
              }
            >
              <div>
                {moment(message.date).format("MMMM Do YYYY, h:mm:ss a")}
              </div>
              <div>{message.sender}</div>
            </div>
          </div>
        ))}
      </ScrollToBottom>
      <div className="response-box">
        <textarea
          className="message-area"
          value={response}
          onChange={handleChange}
          autoComplete="off"
        ></textarea>
        <button
          type="submit"
          className="menu-button"
          style={{ height: "100%" }}
          onClick={submitMessage}
          disabled={response.length === 0}
        >
          Send
        </button>
        <button
          type="submit"
          onClick={deleteConversation}
          className="menu-button"
          style={{ height: "100%" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash-fill"
            viewBox="0 0 16 16"
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}