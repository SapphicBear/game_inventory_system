const pool = require("./pool");

// get all items
async function getAllGames() {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
    ORDER BY games.id;
    `
    const { rows } = await pool.query(query);
    return rows;
}

async function getAllConsoles() {
    const { rows } = await pool.query("SELECT name, console_id FROM game_consoles ORDER BY name;");
    return rows;
}
async function getAllStudios() {
    const { rows } = await pool.query("SELECT name, year FROM game_studios;");
    return rows;
}

async function getAllGenres() {
    const { rows } = await pool.query("SELECT genre FROM games;");
    return rows;
}

async function filterByConsole(consoleName) {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE '${consoleName}' = ANY(games.console)
    ORDER BY games.id;
    `
    const { rows } = await pool.query(query);
    return rows;
}
async function filterByGenre(genre) {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE games.genre = '${genre}'
    ORDER BY games.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
}

// get all items of one category

// delete items (DELETE)

// add items (POST)

module.exports = {
    getAllGames,
    getAllConsoles,
    getAllStudios,
    getAllGenres,
    filterByConsole,
    filterByGenre
};