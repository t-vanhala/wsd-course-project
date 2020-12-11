import { Pool } from "../deps.js";
import { config } from "../config/config.js";

const CONCURRENT_CONNECTIONS = 2;

const executeQuery = async(query, ...args) => {
  const client = new Pool(config.database, CONCURRENT_CONNECTIONS);
  try {
    await client.connect();
    return await client.query(query, ...args);
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }
}

export { executeQuery };
