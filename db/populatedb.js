#! /usr/bin/env node

const { argv } = require("node:process");
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS game_consoles (
    console_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100),
    company VARCHAR(100),
    release_year INTERVAL YEAR NOT NULL
);
CREATE TABLE IF NOT EXISTS game_studios (
    studio_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(200),
    year INTERVAL YEAR NOT NULL
);
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    studio_id INTEGER NOT NULL REFERENCES game_studios(studio_id),
    console_id  INTEGER NOT NULL REFERENCES game_consoles(console_id),
    genre VARCHAR(255),
    release_year INTERVAL YEAR NOT NULL
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
    console.log("done!")
}

main(argv[2]);