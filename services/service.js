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

const hasReportedMorning = async(user_id, date) => {
  if (date) {
    // Check given day
    const res = await executeQuery("SELECT * FROM morning_reports WHERE user_id = $1 AND r_date = $2;", user_id, date);
    if (res && res.rowCount > 0) {
      return true;
    }
    return false;
  } else {
    // Check today
    const res = await executeQuery("SELECT * FROM morning_reports WHERE r_date = CURRENT_DATE AND user_id = $1;", user_id);
    if (res && res.rowCount > 0) {
      return true;
    }
    return false;
  }
}

const hasReportedEvening = async(user_id, date) => {
  if (date) {
    // Check given day
    const res = await executeQuery("SELECT * FROM evening_reports WHERE user_id = $1 AND r_date = $2;", user_id, date);
    if (res && res.rowCount > 0) {
      return true;
    }
    return false;
  } else {
    // Check today
    const res = await executeQuery("SELECT * FROM evening_reports WHERE r_date = CURRENT_DATE AND user_id = $1;", user_id);
    if (res && res.rowCount > 0) {
      return true;
    }
    return false;
  }
}

const addMorningReport = async(data) => {
  if (data.date) {
    await executeQuery("INSERT INTO morning_reports (r_date, sleep_duration, sleep_quality, generic_mood, user_id) VALUES ($1, $2, $3, $4, $5);",
      data.date, data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id);
  } else {
    await executeQuery("INSERT INTO morning_reports (r_date, sleep_duration, sleep_quality, generic_mood, user_id) VALUES (CURRENT_DATE, $1, $2, $3, $4);",
      data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id);
  }
}

const updateMorningReport = async(data) => {
  if (data.date) {
    await executeQuery("UPDATE morning_reports SET sleep_duration = $1, sleep_quality = $2, generic_mood = $3, user_id = $4 WHERE r_date = $5;",
      data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id, data.date);
  } else {
    await executeQuery("UPDATE morning_reports SET sleep_duration = $1, sleep_quality = $2, generic_mood = $3, user_id = $4 WHERE r_date = CURRENT_DATE;",
      data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id);
  }
}

export { areExistingUsers, addUser, hasReportedMorning, hasReportedEvening, addMorningReport, updateMorningReport };
