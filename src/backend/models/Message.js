const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  receiverName: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
