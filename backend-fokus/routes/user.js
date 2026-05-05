const express = require("express");
const { verifyToken } = require("../middlewares/verify");
const userController = require("../controllers/userController");
const {
  formCekUsername,
  formDataDiri,
  formPin,
  formEmail,
  formOTP,
} = require("../middlewares/validation");
const route = express.Router();

route.get("/detail", verifyToken, userController.getDetail);
route.post(
  "/user-available",
  verifyToken,
  formCekUsername,
  userController.getUserAvailable,
);
route.post(
  "/user-update",
  verifyToken,
  formDataDiri,
  userController.updateDataUser,
);
route.post("/user-pin", verifyToken, formPin, userController.updatePinUser);
route.post("/sentmail", formEmail, userController.sentMailForgotPassword);
route.post("/otp", formOTP, userController.cekOTPFOrgotPassword);
route.post("/password", userController.updatePasswordUser);

module.exports = route;
