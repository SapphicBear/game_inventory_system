const { Router } = require("express");
const router = Router();
const controller = require("./../controllers/editController");

router.get("/:id", controller.getEdit);
router.post("/", controller.updateEdit);

module.exports = router;