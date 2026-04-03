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

async function remainingConsoles(consoleName) {
    let consoles = consoleName;
    const query = `
    SELECT name FROM game_consoles
        WHERE name NOT IN (${consoles.map((con) => { return `'${con}'`})})
    ORDER BY name;
    `;
    const { rows } = await pool.query(query);
    return rows;
}

async function filterByConsole(consoleName) {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE '${consoleName.consoles}' = ANY(games.console)
    ORDER BY games.id;
    `
    const queryAlt = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE '${consoleName.consoles}' = ANY(games.console) AND in_stock != '0'
    ORDER BY games.id;
    `;
    if (!consoleName.inStock) {
        const { rows } = await pool.query(query);
        return rows;
    } else {
        const { rows } = await pool.query(queryAlt);
        return rows;
    }
    
}
async function filterByGenre(genre) {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE games.genre = '${genre.genres}'
    ORDER BY games.id;
    `;
    const queryAlt = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE games.genre = '${genre.genres}' AND in_stock != '0'
    ORDER BY games.id;
    `;

    if (!genre.inStock) {
        const { rows } = await pool.query(query);
        return rows;
    } else {
        const { rows } = await pool.query(queryAlt);
        return rows;
    }
}

async function getSelectedGame(game) {
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
    WHERE games.name = '${game.game_name}'
    ORDER BY games.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
}

async function updateGameInfo(info) {
    const query = `
    UPDATE games 
    SET name = '${info.game_name}', genre = '${info.genre}', studio_id = (SELECT studio_id FROM game_studios
                WHERE game_studios.name = '${info.studio_name}'), release_year = '${info.release_year}', in_stock = '${info.in_stock}', price = '${info.price}', console = '{{${info.console}}}'
        WHERE id = ${info.id};
    `;
    await pool.query(query);
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
    filterByGenre,
    getSelectedGame,
    updateGameInfo,
    remainingConsoles
};