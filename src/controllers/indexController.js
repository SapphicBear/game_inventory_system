const db = require("./../../db/queries");
const links = require("./links");

async function indexGet(req, res) {
    const games = await db.getAllGames();
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}
async function getFilterConsole(req, res) {
    console.log(req.query, req.params)
    const games = await db.filterByConsole(req.query);
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}

async function getFilterGenre(req, res) {
    const games = await db.filterByGenre(req.query);
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}

module.exports = {
    indexGet,
    getFilterConsole,
    getFilterGenre
};