

//Object.keys(require.cache).forEach(function (key) {
    //delete require.cache[key];
//});

const express = require('express');
const { sendMessage, getMessages, getConversations, getHeaderData } = require('../controllers/messageController');
const { LogInAuthorization } = require('../middlewares/protectedMiddlewares');


const router = express.Router();

// Define the routes
router.post('/send/:id', LogInAuthorization, sendMessage);
router.get('/conversation/:id',LogInAuthorization, getMessages);
router.get('/conversations', LogInAuthorization, getConversations);
router.get('/getHeaderData/:id', getHeaderData)


module.exports = router;
