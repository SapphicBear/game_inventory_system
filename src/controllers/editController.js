const db = require("./../../db/queries");
const { body, validationResult } = require("express-validator");
const links = require("./links");


async function getEdit(req, res) {
    const game = await db.getSelectedGame(req.params);
    let temp = game[0].console[0];
    const consoles = await db.remainingConsoles(temp);
    res.render("edit", { links: links, game: game, errors: "", consoles: consoles });
}

const updateEdit = [
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
        .withMessage("Console(s) must be specified."),
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
        const consoles = await db.remainingConsoles(req.body.console);
        const errors = validationResult(req);
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
                    game: [game],
                    consoles: consoles,
                });
                return;
        }
        await db.updateGameInfo(game);
        res.redirect("/");
    },
];

module.exports = {
    getEdit,
    updateEdit
};