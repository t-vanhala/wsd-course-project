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

const hasReportedMorning = async(user_id) => {
  const res = await executeQuery("SELECT * FROM morning_reports WHERE r_date = NOW() AND user_id = $1;", user_id);
  if (res && res.rowCount > 0) {
    return true;
  }
  return false;
}

const hasReportedEvening = async(user_id) => {
  const res = await executeQuery("SELECT * FROM evening_reports WHERE r_date = NOW() AND user_id = $1;", user_id);
  if (res && res.rowCount > 0) {
    return true;
  }
  return false;
}

export { areExistingUsers, addUser, hasReportedMorning, hasReportedEvening };
