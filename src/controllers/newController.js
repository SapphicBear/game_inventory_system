const db = require("./../../db/queries");
const { body, validationResult } = require("express-validator");
const links = require("./links");

async function getNew(req, res) {
    const consoles = await db.getAllConsoles();
    const studios = await db.getAllStudios();
    res.render("new", { links: links, consoles: consoles, errors: "" , studios: studios});
}
const postNew = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name of game must be specified."),
    body("studio")
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
                const consoles = await db.getAllConsoles();
                const game = {
                    game_name: req.body.name,
                    id: req.body.id,
                    studio_name: req.body.studio,
                    genre: req.body.genre,
                    release_year : req.body.release_year,
                    console: req.body.console,
                    in_stock: req.body.in_stock,
                    price: req.body.price
                };
                if (!errors.isEmpty()) {
                    res.render("edit", 
                        { 
                            errors: errors.array(), 
                            links: links,
                            consoles: consoles,
                        });
                        return;
                }
                await db.postNewItem(game);
                res.redirect("/");
            },
];
module.exports = {
    getNew,
    postNew
};