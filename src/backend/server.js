// DEPENDENCIES AND FILES{
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
app.use(express.json());
const cors = require('cors');
app.use(cors())
const { Server } = require("socket.io");
const User = require('./models/User');
const { ioCreate } = require('./config/io');
const path = require('path');
//}

//IMPORTING THE ROUTES AND MIDDLEWARES{
const authRoutes = require('./routers/authRoutes');
const protectedMiddleware = require('./middlewares/protectedMiddlewares').LogInAuthorization;
const protectedRoutes = require('./routers/protectedRoutes')
const messageRoutes = require('./routers/messageRoutes');
//}

//CONNECTING THE DATABASE{
const DBconnect = require('./config/db');
DBconnect();
//}


//ROUTES{
  //-Auth Routes{
    app.use('/api/auth', authRoutes);
  //}
  //-Protected Routes{
    app.use('/api/protected', protectedRoutes);
  //}
  //-Message Routes{
    app.use('/api/message', protectedMiddleware, messageRoutes);
  //}
//}


//STARTING THE SERVER AND INITIALIZING SOCKET{
const port = 5000;
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => {
  console.log('server started on port ' +"0.0.0.0:"+ port);
})

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const io = ioCreate(server);
//}

//SOCKET CONNECTIONS FOR TESTING{
 io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
 

   socket.on("register", async (user)=>{
         try {
     console.log(user)
     const thisUser = await User.findOneAndUpdate({email:user.email}, { socketId: socket.id }, {new: true});
      console.log(`Socket ID ${socket.id} linked to user ${user.email}`);
    } catch (err) {
      console.error("Error updating socket ID:", err);
    }
  }); 

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
 });


//EXPORTS{
module.exports = io;
//}