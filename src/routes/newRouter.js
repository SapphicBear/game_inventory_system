const { Router } = require("express");
const router = Router();
const controller = require("./../controllers/newController");

router.get("/", controller.getNew);

module.exports = router;