const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const { getIo } = require('../config/io');

exports.sendMessage = async (req, res) =>{
  console.log('send message called')
  try{
  const io = getIo();
  const { id } = req.params;
  const { message } = req.body;

  console.log(id, message)
    
  const myId = req.user.id;
  const receiver = await User.findById(id);
  const sender = await User.findById(myId);
  if (!receiver || !myId) {
      return res.status(404).json({ message: "Receiver not found" });
  }

  const mySocket = sender.socketId;
  const currentMsg = await Message.create({
    sender: myId,
    receiver: id,
    message: message,
    senderName: sender.name,
    receiverName: receiver.name,
  });
  io.to(mySocket).emit('Message', {
        sender: myId,
        receiver: id,
        message: message,
        _id: currentMsg._id,
        senderName: currentMsg.senderName,
        receiverName: currentMsg.receiverName,
        createdAt: currentMsg.createdAt,
      });

    const receiverSocket = receiver.socketId;

   if(receiverSocket){
io.to(receiverSocket).emit('Message', {
        sender: myId,
        receiver: id,
        message: message,
        _id: currentMsg._id,
        senderName: currentMsg.senderName,
        receiverName: currentMsg.receiverName,
        createdAt: currentMsg.createdAt,
      });
         }
    
  res.status(200).json({ message: "Message sent successfully" });
  }catch(error){
res.status(500).json({message: "Error sending message", error: error.message})
  }
}

exports.getMessages = async (req, res) =>{
  try{
    const { id } = req.params;
    const myId = req.user.id;
    const me = await User.findById(myId);
    console.log(myId)
    console.log(id)
    const receiver = await User.findById(id);
    if(!receiver){
res.status(404).json({message: "Chat Not Found"})
    }
    const messages = await Message.find({
      $or:  [
        { sender: myId, receiver: id },
        { sender: id, receiver: myId }
      ]
    })

    res.status(200).json({messages, me: me.name})
  }catch(error){
res.status(500).json({message: "Error fetching messages", error: error.message})
  }
};

exports.getConversations = async (req, res) =>{
  const MyId = req.user.id;
  try{
    const users = await User.find({_id: { $ne: MyId }});
    res.status(200).json({users})
  }catch{
    res.status(500).json({message: "Error fetching users", error: error.message})
  }
}

exports.getHeaderData = async (req, res) => {
  const { id } = req.params;
  const user = User.findById(id)
  res.status(200).json({
    name: user.name,
    icon: user.icon || null
  })
}
