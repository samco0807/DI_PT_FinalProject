// backend/src/db/knex.js
import knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const db = knex({
  client: "pg",
  connection: {
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    ssl: { rejectUnauthorized: false },
  },
});

export default db;

// async function getPgVersion() {
//   try {
//     const result = await db.raw("select version()");
//     console.log(result); // Print the entire result object
//   } catch (error) {
//     console.error("Error executing query:", error);
//   }
// }

// getPgVersion();
