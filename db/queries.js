const pool = require("./pool");

class Games {
    async getAllGames() {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
        ORDER BY games.id;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
    async getSelectedGame(game) {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
        WHERE games.id = $1
        ORDER BY games.id;
        `;
        const { rows } = await pool.query(query, [game.id]);
        return rows;
    }
    async filterByConsole(consoleName) {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE $1 = ANY(games.console)
        ORDER BY games.id;
        `;
        const queryAlt = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE $1 = ANY(games.console) AND in_stock != '0'
        ORDER BY games.id;
        `;
        if (!consoleName.inStock) {
            const { rows } = await pool.query(query, [consoleName.consoles]);
            return rows;
        } else {
            const { rows } = await pool.query(queryAlt, [consoleName.consoles]);
            return rows;
        }
    }
    async filterByGenre(genre) {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE games.genre = $1
        ORDER BY games.id;
        `;
        const queryAlt = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE games.genre = $1 AND in_stock != '0'
        ORDER BY games.id;
        `;

        if (!genre.inStock) {
            const { rows } = await pool.query(query, [genre.genres]);
            return rows;
        } else {
            const { rows } = await pool.query(queryAlt, [genre.genres]);
            return rows;
        }
    }
    async filterByStudio(studio) {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE $1 = game_studios.name
        ORDER BY games.id;
        `
        const queryAlt = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console AS console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
            WHERE $1 = game_studios.name AND in_stock != '0'
        ORDER BY games.id;
        `;
        if (!studio.inStock) {
            const { rows } = await pool.query(query, [studio.studios]);
            return rows;
        } else {
            const { rows } = await pool.query(queryAlt, [studio.studios]);
            return rows;
        }
    }
    async getSelectedGame(game) {
        const query = `
        SELECT games.name AS game_name, game_studios.name AS studio_name, price, in_stock, genre, games.release_year, games.console, games.id FROM games
            JOIN game_studios
            ON (games.studio_id = game_studios.studio_id)
        WHERE games.id = '$1'
        ORDER BY games.id;
        `;
        const { rows } = await pool.query(query, [game.id]);
        return rows;
    }
    async updateGameInfo(info) {
        const query = `
        UPDATE games 
        SET name = '$1', genre = '$2', studio_id = (SELECT studio_id FROM game_studios
                    WHERE game_studios.name = '$3'), release_year = '$4', in_stock = '$5', price = '$6', console = '{{$7}}'
            WHERE id = $8;
        `;
        await pool.query(query, [info.name, info.genre, info.studio, info.release_year, info.in_stock, info.price, info.console, info.id]);
    }
    async postNewItem(item) {
        const query = `
        INSERT INTO games (name, studio_id, console, genre, release_year, price, in_stock) 
            VALUES (
            '$1',
            (SELECT studio_id FROM game_studios 
                WHERE name = '$2'),
            '{{$3}}',
            '$4',
            '$5',
            '$6',
            '$6'
            );
        `;
        await pool.query(query, [item.game_name, item.studio_name, item.console, item.genre, item.release_year, item.price, item.in_stock]);
    }
    async deleteGame(game) {
        const query = `
        DELETE FROM games WHERE games.id = '$1';
        `;
        await pool.query(query, [game.id]);
    }
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
    Games,
    getAllConsoles,
    getAllStudios,
    getAllGenres,
   
    remainingConsoles,

    postNewStudio,
    postNewConsole,

    deleteConsole,
    deleteStudio
};