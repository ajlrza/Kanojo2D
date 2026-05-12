import postgres from 'postgres';

const host = process.env.host
const db_name = process.env.db_name
const cert = process.env.cert
const username = process.env.username
const pw = process.env.pw
const port = process.env.port

export const sql = postgres(process.env.pg_conn, {
    host: host,
    port: port,
    database: db_name,
    username: username,
    password: pw,
    ssl: true,
    fetch_types: true,
})