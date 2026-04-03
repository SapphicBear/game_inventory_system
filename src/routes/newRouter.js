const { Router } = require("express");
const router = Router();
const controller = require("./../controllers/newController");

router.get("/", controller.getNew);
router.post("/", controller.postNew);

module.exports = router;