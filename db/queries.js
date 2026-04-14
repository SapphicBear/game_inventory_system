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
    const { rows } = await pool.query("SELECT name, year, studio_id FROM game_studios;");
    return rows;
}

async function getAllGenres() {
    const { rows } = await pool.query("SELECT DISTINCT genre FROM games;");
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

async function filterByStudio(studio) {
    console.log(studio.studios)
    const query = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE '${studio.studios}' = game_studios.name
    ORDER BY games.id;
    `
    const queryAlt = `
    SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
        JOIN game_studios
        ON (games.studio_id = game_studios.studio_id)
        WHERE '${studio.studios}' = game_studios.name AND in_stock != '0'
    ORDER BY games.id;
    `;
    if (!studio.inStock) {
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
    WHERE games.id = '${game.id}'
    ORDER BY games.id;
    `;
    const { rows } = await pool.query(query);
    return rows;
}

async function updateGameInfo(info) {
    const query = `
    UPDATE games 
    SET name = '${info.name}', genre = '${info.genre}', studio_id = (SELECT studio_id FROM game_studios
                WHERE game_studios.name = '${info.studio}'), release_year = '${info.release_year}', in_stock = '${info.in_stock}', price = '${info.price}', console = '{{${info.console}}}'
        WHERE id = ${info.id};
    `;
    await pool.query(query);
}

async function postNewItem(item) {
    const query = `
    INSERT INTO games (name, studio_id, console, genre, release_year, price, in_stock) 
        VALUES (
        '${item.game_name}',
        (SELECT studio_id FROM game_studios 
            WHERE name = '${item.studio_name}'),
        '{{${item.console}}}',
        '${item.genre}',
        '${item.release_year}',
        '${item.price}',
        '${item.in_stock}'
        );
    `;
    await pool.query(query);
}

async function postNewStudio(studio) {
    const query = `
    INSERT INTO game_studios (name, year) 
        VALUES (
            '${studio.name}',
            '${studio.year}'
        );
    `;
    await pool.query(query);
}

async function postNewConsole(con) {
    const query = `
    INSERT INTO game_consoles (name, release_year)
        VALUES (
            '${con.name}', 
            '${con.release_year}'
        );
    `;
    await pool.query(query);
}

async function deleteGame(game) {
    const query = `
    DELETE FROM games WHERE games.id = '$1';
    `;
    await pool.query(query, [game.id]);
}
async function deleteConsole(con) {
    const query = `
    DELETE FROM game_consoles WHERE console_id = '$1';
    `;
    await pool.query(query, [con.console]);
}
async function deleteStudio(studio) {
    
        const query = `
    DELETE FROM game_studios WHERE studio_id = '$1';
    `;
    await pool.query(query, [studio.studio]); 
}

module.exports = {
    getAllGames,
    getAllConsoles,
    getAllStudios,
    getAllGenres,
    filterByConsole,
    filterByGenre,
    getSelectedGame,
    updateGameInfo,
    remainingConsoles,
    postNewItem,
    filterByStudio,
    postNewStudio,
    postNewConsole,
    deleteGame,
    deleteConsole,
    deleteStudio
};