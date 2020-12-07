import { executeQuery } from "../database/database.js";

const areExistingUsers = async(email) => {
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  if (res && res.rowCount > 0) {
    return true;
  }
  return false;
}

const addUser = async(email, hash) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, hash);
}

export { areExistingUsers, addUser };
