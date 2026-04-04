const db = require("./../../db/queries");
const { body, validationResult } = require("express-validator");
const links = require("./links");

async function getNew(req, res) {
    const consoles = await db.getAllConsoles();
    const studios = await db.getAllStudios();
    res.render("new", { links: links, consoles: consoles, errors: "" , studios: studios});
}
const postNew = [
    body("game_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name of game must be specified."),
    body("studio_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Studio name must be specified."),
    body("genre")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Genre must be specified."),
    body("release_year")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Date must be a number")
        .isLength({ min: 1 })
        .withMessage("Year must be specified."),
    body("console")
        .trim()
        .escape()
        .toArray()
        .isLength({ min: 1 })
        .withMessage("Console must be specified."),
    body("in_stock")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Ammount in stock must be a number.")
        .isLength({ min: 1 })
        .withMessage("Ammount in Stock must be set."),
    body("price")
        .trim()
        .escape()
        .isNumeric()
        .withMessage("Price must be a number.")
        .isLength({ min: 1 })
        .withMessage("Price must be set."),

        async (req, res, next) => {
            const errors = validationResult(req);
            const studios = await db.getAllStudios();
            const consoles = await db.getAllConsoles();
            const game = {
                    game_name: req.body.game_name,
                    studio_name: req.body.studio_name,
                    genre: req.body.genre,
                    release_year : req.body.release_year,
                    console: req.body.console,
                    in_stock: req.body.in_stock,
                    price: req.body.price
                    };
            console.log(game);
                if (!errors.isEmpty()) {
                    res.render("new", 
                        { 
                            errors: errors.array(), 
                            links: links,
                            consoles: consoles,
                            studios: studios,
                            game: game,
                        });
                } else {
                    await db.postNewItem(game);
                    res.redirect("/");
                }
            },
];
module.exports = {
    getNew,
    postNew
};