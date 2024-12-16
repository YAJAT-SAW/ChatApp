import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { io } from "socket.io-client";
import { DisplayMessages } from '../components/homeComponents'

//SOCKET INTIALIZATION
const ENDPOINT =
  'https://chat-r311.onrender.com';
const socket = io(ENDPOINT, {
  transports: ["websocket"],
});

const Conversation = () => {

  const Navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [headerName, setHeaderName] = useState('loading...');
  const [headerIcon, setHeaderIcon] = useState('https://i.ibb.co/zPRHxcV/profile.jpg')
  const lastMessageRef = useRef(null);

  const getUserData = async () =>{
    const res = await axios.get(`/api/message/getHeaderData/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
      }
    })
    setHeaderName(res.data?.name || 'loading...')
setHeaderIcon(res.data?.icon || 'https://i.ibb.co/zPRHxcV/profile.jpg')
  }
    const authorize = async () => {
    const res = await axios.post("/api/protected/isloggedIn",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res.data?.authorized === false) {
      logout();
    }
    console.log(res);
  setEmail(res.data?.email);
  setUsername(res.data?.name);
  };
  const handleSubmit = async () => {
    if(message){
axios.post(`/api/message/send/${id}`,
      {
        message: message,
      },
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    )
    }
    setMessage('');
  };
  useEffect(()=>{
    getUserData();
  },[])
  useEffect(()=>{
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[messages])
  useEffect(()=>{
    authorize();
    
  },[])
  useEffect(()=>{
    if(email) {
      socket.emit("register", { email });
  }
    else {
    console.log('Authorising')
    }
  },[email])
  useEffect(()=>{
    socket.on("Message", (NewMessage) => {
  setMessages((prevMessages) => [...prevMessages, NewMessage]);
  console.log(messages)
    });
    

    return () => {
    socket.off("Message");
  };
  },[])

  const renderMessages = () =>{
    return messages.map((msg, index) =>{ const formattedDate = new Date(msg.createdAt).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
                                 return (
      <div
        key={msg._id}
        className={`message ${msg.senderName === username ? "sender" : "receiver"}`}
      >
        <div className="message-header">{msg.senderName}</div>
        <p>{msg.message}</p>
        <div className="date">{formattedDate}</div>
        {index === messages.length - 1 && (
            <div ref={lastMessageRef}></div>
          )}
      </div>
    )})
  }

  //MAIN JSX
  return (
    <>
      <div className="header">
        <span className="back">
          <button
            className="back-btn"
            onClick={()=>Navigate('/')}
            >
            <i class="bi bi-arrow-left-short" />
          </button>
        </span>
        <span className="headerIcon">
          <img src={headerIcon} className="headerImg"/>
        </span>
        <span>
          {headerName}
        </span>
      </div>
      <div className="messages">
        <DisplayMessages />
        {renderMessages()}
      </div>
      <div className="input-section">
      <div className="input-container">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
    />
    <button onClick={handleSubmit}>
      <i className="bi bi-send" />
    </button>
  </div>
      </div>
    </>
  );
};

export default Conversation;
