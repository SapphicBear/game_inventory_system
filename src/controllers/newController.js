const db = require("./../../db/queries");
const links = require("./links");

async function getNew(req, res) {
    const consoles = await db.getAllConsoles();
    res.render("new", { links: links, consoles: consoles, errors: "" });
}

module.exports = {
    getNew,
};