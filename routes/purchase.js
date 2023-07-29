const express = require("express");

const purchaseController = require("../controllers/purchase");
const userauthentication = require('../middleware/auth');

const router = express.Router();


router.get("/premiummembership", userauthentication.authenticate , purchaseController.purchasepremium);  

router.post("/updatetransaction", userauthentication.authenticate, purchaseController.updateTransaction);


module.exports = router;