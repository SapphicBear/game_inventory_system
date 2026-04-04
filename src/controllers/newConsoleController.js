const db = require("./../../db/queries");
const { body, validationResult } = require("express-validator");
const links = require("./links");

async function getNewConsole(req, res) {
    res.render("new-console", { links: links, errors: "" });
}
const postNewConsole = [

    body("name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a name of the console."),
    body("release_year")
        .escape()
        .trim()
        .isNumeric()
        .withMessage("The year must be a number.")
        .isLength({ min: 1, max: 4 })
        .withMessage("Please provide a release year."),

    async (req, res, next) => {
        const errors = validationResult(req);
        const con = {
            name: req.body.name,
            release_year: req.body.release_year,
        };
        if (!errors.isEmpty()) {
            res.render("new-console", 
                {
                    errors: errors.array(),
                    links: links,
                });
        } else {
            await db.postNewConsole(con);
            res.redirect("/");
        }
        
    },

];

module.exports = {
    getNewConsole,
    postNewConsole
};