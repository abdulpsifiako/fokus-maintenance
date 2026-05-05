const express = require("express");
const tryOutControlle = require("../controllers/tryOutControlle");
const { verifyToken, isAdmin } = require("../middlewares/verify");
const route = express.Router();

route.post("/create", verifyToken, isAdmin, tryOutControlle.createTO);
route.get("/get", tryOutControlle.getTryout);
route.get("/admin-get", verifyToken, isAdmin, tryOutControlle.adminTryout);
route.post("/update/:id", verifyToken, isAdmin, tryOutControlle.updateTO);
route.post("/delete/:id", verifyToken, isAdmin, tryOutControlle.deleteTO);
route.get(
  "/tryout-nilai/:tryout_id",
  verifyToken,
  isAdmin,
  tryOutControlle.exportNilaiTryout,
);

module.exports = route;
