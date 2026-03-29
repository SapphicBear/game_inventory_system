const pool = require("./pool");

// get all items
async function getAllGames() {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, game_consoles.name AS console, games.id FROM games
        JOIN game_consoles 
        ON (games.console_id = game_consoles.console_id)
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id);
    `
    const { rows } = await pool.query(query);
    return rows;
}

async function getAllConsoles() {
    const { rows } = await pool.query("SELECT name FROM game_consoles WHERE name != 'PC, Xbox 360, PlayStation 3' ORDER BY name;");
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

// get all items of one category

// delete items (DELETE)

// add items (POST)

module.exports = {
    getAllGames,
    getAllConsoles,
    getAllStudios,
    getAllGenres,
};