import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';


const socket = io('https://chat-r311.onrender.com/', {
  transports: ["websocket"],
});

export const DisplayUsers = (prop) =>{
const navigate = useNavigate();

  if(!localStorage.getItem('token')){
    navigate('/Login')
  }
  
  const Navigate = (user) =>{
navigate(`/conversation/${user}`)
  }

  const renderUsers = () =>{
    return prop.userList.map((user) =>{
      return <div key={user._id} 
          className="UserCard">
        <div className="pfp">
          <img src='https://i.ibb.co/zPRHxcV/profile.jpg' alt="pfp" />
        </div>
        <button
          onClick={()=>Navigate(user._id)}>
         <span>
           {user.name}
         </span>
        </button>
      </div>
    })
  };


  return(
    <>
      {renderUsers()}
    </>
  )
};

export const DisplayMessages = () =>{

  const  { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const lastMessageRef = useRef(null);
    useEffect(()=>{
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  },[messages])
  useEffect(() => {
      const fetchDbMessages = async () =>{
    const res = await axios.get(`/api/message/conversation/${id}`,
    {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
    )
    console.log(res.data?.messages)
  setUsername(res.data?.me);
  setMessages([...messages, ...res.data.messages])
      }
    fetchDbMessages();
  },[id])
  

  const renderMessages = ()=>{
    if (messages.length === 0 || !messages){
      return (
        <div className="empty-chat">
    <div className="chat-logo"><i className="bi bi-chat-square-fill"/></div>
  <div>start chat</div>
  </div>
        )
    }
    return messages.map((msg, index) =>{ 
      const formattedDate = new Date(msg.createdAt).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
      
      return(
        <div
        key={msg._id}
        className={`message ${msg.senderName === username ? "sender" : "receiver"}`}
      >
        <div className="message-header">{msg.senderName}</div>
        <p>{msg.message}</p>
        <div className="date">
          {formattedDate}
        </div>
          {index === messages.length - 1 && (
            <div ref={lastMessageRef}></div>
          )}
      </div>
    )
  })
  }

  return(
    <>
      {renderMessages()}
    </>
  )
}