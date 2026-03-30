const db = require("./../../db/queries");
const links = require("./links");

async function indexGet(req, res) {
    const games = await db.getAllGames();
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}
async function getFilterConsole(req, res) {
    const games = await db.filterByConsole(req.query.consoles);
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}

async function getFilterGenre(req, res) {
    const games = await db.filterByGenre(req.query.genres);
    const genres = await db.getAllGenres();
    const consoles = await db.getAllConsoles();
    res.render("index", { games: games, links: links, genres: genres, consoles: consoles });
}

module.exports = {
    indexGet,
    getFilterConsole,
    getFilterGenre
};