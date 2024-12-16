import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DisplayUsers } from '../components/homeComponents'
import { io } from "socket.io-client";
import axios from 'axios';

const socket = io('https://chat-r311.onrender.com', {
  transports: ["websocket"],
});

const Home = () =>{

  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [queryResult, setQueryResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

const handleSearch = async (e) => {

  setSearchTerm(e.target.value);

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())
);
setQueryResult(filteredUsers);
};

  const fetchUsers = async () =>{
    try{
      const res = await axios.get('/api/message/conversations',
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      },
    );
    setUsers(res.data?.users || []);
    setQueryResult(res.data?.users || []);
    }catch{
      setUsers([])
    }
  };
  

    const logout = () => {
localStorage.removeItem("token");
    Navigate("/Login");
  };

  const Connect = () => {
    socket.on("connection", () => {
      console.log("Connected to the server:", socket.id);
    });
    socket.emit("register", { email });
  };
  
  const authorize = async () => {
    const res = await axios.post("/api/protected/isloggedIn",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

    useEffect(() => {
    if (!token) {
      logout();
    } else {
      authorize();
      fetchUsers();
    }
  }, [token]);

  useEffect(()=>{
    if (email){
      Connect();
    }else{
      console.log("Authorizing")
      authorize();
    }
  }, [email]);
  
  return(
    <div>
      <div>
        <h2>WhatsApp</h2>
        <span className="logout">
          <p>logout</p><button className="logout-btn" onClick={logout}><i className="bi bi-door-open-fill"/>
          </button>
        </span>
        email: {email}
      </div>
      <div>
        <input
      className="search"
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearch}
    />
      </div>
      <div>
        {
          !queryResult.length || !users ? <p>No users found</p> : <DisplayUsers userList={queryResult} />
        }
      </div>
    </div>
  )
}
export default Home;