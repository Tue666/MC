const express = require("express");
const router = express.Router();

const { AccountController } = require("../app/controllers/account.controller");
const uploadImage = require("../app/middlewares/upload-image.middleware");
const verifyToken = require("../app/middlewares/verify-token.middleware");

router.patch(
  "/avatar",
  verifyToken,
  uploadImage(false).single("avatar"),
  AccountController.updateAvatar
);
router.post("/sign-in", AccountController.signIn);
router.post("/sign-up", AccountController.signUp);
router.get("/refresh-token", AccountController.refreshToken);
router.get("/verify-token", verifyToken, AccountController.verifyToken);
router.get("/profile", verifyToken, AccountController.getProfile);

module.exports = router;
