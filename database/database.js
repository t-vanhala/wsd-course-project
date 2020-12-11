import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 5;

const client = new Pool(config.database, CONCURRENT_CONNECTIONS);

const executeQuery = async(query, ...args) => {
  await client.connect();
  try {
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

export { executeQuery };
