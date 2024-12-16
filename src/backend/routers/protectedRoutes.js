const express = require('express');
const { authorize } = require('../controllers/protectedController');
const { LogInAuthorization } = require('../middlewares/protectedMiddlewares');
const router = express.Router();

router.post('/isLoggedIn', LogInAuthorization, authorize)

module.exports = router;