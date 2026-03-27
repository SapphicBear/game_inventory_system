const db = require("./../../db/queries");
const links = require("./links");

async function indexGet(req, res) {
    const games = await db.getAllGames();
    res.render("index", { games: games, links: links });
}

module.exports = {
    indexGet,
};