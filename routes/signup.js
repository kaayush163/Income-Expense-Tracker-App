const express = require("express");
const router = express.Router();
const userController = require('../controllers/signup');
const expenseController = require('../controllers/expense');

const authenticatemiddleware = require('../middleware/auth');

router.post('/add-user', userController.postUser);
router.post('/add-login', userController.postlogin);
router.get('/download',authenticatemiddleware.authenticate,expenseController.downloadexpense);

module.exports = router;