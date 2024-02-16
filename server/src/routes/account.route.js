const express = require("express");
const router = express.Router();

const accountController = require("../app/controllers/account.controller");
const verifyToken = require("../app/middlewares/verifyToken.middleware");

router.post("/sign-in", accountController.signIn);
router.post("/sign-up", accountController.signUp);
router.get("/refresh-token", accountController.refreshToken);
router.get("/verify-token", verifyToken, accountController.verifyToken);

module.exports = router;
