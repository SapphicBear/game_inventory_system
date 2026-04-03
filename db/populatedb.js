#! /usr/bin/env node

const { argv } = require("node:process");
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS game_consoles (
    console_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    company VARCHAR(100),
    release_year VARCHAR(200)
);
CREATE TABLE IF NOT EXISTS game_studios (
    studio_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(200),
    year VARCHAR(200)
);
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    studio_id INTEGER REFERENCES game_studios(studio_id),
    console TEXT[],
    genre VARCHAR(255),
    release_year VARCHAR(200),
    price NUMERIC,
    in_stock INTEGER
);
INSERT INTO game_consoles (name, company, release_year)
    VALUES 
        ('Xbox_360', 'Microsoft', '2005'), 
        ('PlayStation_2', 'Sony', '2000'), 
        ('PlayStation', 'Sony', '1994'), 
        ('PlayStation_3', 'Sony', '2006'), 
        ('PC', 'Multiple Companies', '1979');

INSERT INTO game_studios (name, year)
    VALUES ('Valve', '1996'), 
    ('Obsidian Entertainment', '2003'), 
    ('Black Isle Studios', '1996');

INSERT INTO games (name, studio_id, console, genre, release_year, price, in_stock)
    VALUES (
        'Fallout: New Vegas', 
        (SELECT studio_id FROM game_studios WHERE name = 'Obsidian Entertainment'),
        (SELECT ARRAY_AGG(game_consoles.name) AS console FROM game_consoles WHERE game_consoles.name IN ('PC', 'Xbox_360', 'PlayStation_3')),
        'RPG',
        '2010',
        '10.99',
        '25'
        );
`;

async function main(arg) {
    console.log("Seeding database");
    const client = new Client({
        connectionString: arg,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done!");
}

main(argv[2]);