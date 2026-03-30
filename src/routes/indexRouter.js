const { Router } = require("express");
const router = Router();
const controller = require("./../controllers/indexController");

router.get("/", controller.indexGet);
router.get("/consoles", controller.getFilterConsole);
router.get("/genres", controller.getFilterGenre);

module.exports = router;