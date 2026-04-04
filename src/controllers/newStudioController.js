const db = require("./../../db/queries");
const { body, validationResult } = require("express-validator");
const links = require("./links");

async function getNewStudio(req, res) {
    res.render("new-studio", { links: links, errors: "" });
}

const postNewStudio = [
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please provide a name."),
    body("year")
        .trim()
        .isLength({ min: 1, max: 4 })
        .escape()
        .withMessage("Please provide a grounding year.")
        .isNumeric()
        .withMessage("Year must be a number."),
    async (req, res, next) => {
        const errors = validationResult(req);
        const studio = {
            name: req.body.name,
            year: req.body.year,
        };
        if (!errors.isEmpty()) {
            res.render("new-studio", 
                {
                    errors: errors.array(),
                    links: links,
                });
        } else {
            await db.postNewStudio(studio);
            res.redirect("/");
        }
        
    },
];

module.exports = {
    getNewStudio,
    postNewStudio,
};