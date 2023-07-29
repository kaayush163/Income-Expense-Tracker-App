const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense');
const userauthentication = require('../middleware/auth');

router.get('/get-expense', userauthentication.authenticate ,expenseController.getExpense);   

router.get('/get-update-totalbalance', userauthentication.authenticate ,expenseController.getUpdateExpense);

router.post('/add-expense', userauthentication.authenticate, expenseController.postExpense);

router.delete('/delete-expense/:expenseId', userauthentication.authenticate, expenseController.deleteExpense);

router.put('/edit-expense/:expenseId',userauthentication.authenticate, expenseController.editExpense);

module.exports = router;