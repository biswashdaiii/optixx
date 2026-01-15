const express = require('express');
const router = express.Router();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { generateSignature, verifyPayment } = require('../controllers/esewa');

router.post('/esewa/generateSignature/:userId', requireSignin, isAuth, generateSignature);
router.get('/esewa/verify', verifyPayment);

router.param('userId', userById);

module.exports = router;
