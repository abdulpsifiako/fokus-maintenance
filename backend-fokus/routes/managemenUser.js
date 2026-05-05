const express = require("express");
const { verifyToken, isAdmin } = require("../middlewares/verify");
const managementUser = require("../controllers/managementUser");
const route = express.Router();

route.post(
  "/update-user",
  verifyToken,
  isAdmin,
  managementUser.updatDetailUser
);
route.post("/delete-user", verifyToken, isAdmin, managementUser.deleteUser);

module.exports = route;
