import { executeQuery } from "../database/database.js";

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
  await executeQuery("INSERT INTO morning_reports (r_date, sleep_duration, sleep_quality, generic_mood, user_id) VALUES ($1, $2, $3, $4, $5);",
    data.date, data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id);
}

const updateMorningReport = async(data) => {
  await executeQuery("UPDATE morning_reports SET sleep_duration = $1, sleep_quality = $2, generic_mood = $3, user_id = $4 WHERE r_date = $5;",
    data.sleep_duration, data.sleep_quality, data.generic_mood, data.user_id, data.date);
}

const addEveningReport = async(data) => {
  await executeQuery("INSERT INTO evening_reports (r_date, time_sports, time_studying, reg_and_eating, generic_mood, user_id) VALUES ($1, $2, $3, $4, $5, $6);",
    data.date, data.sports_and_exercises, data.studying, data.reg_and_eating, data.generic_mood, data.user_id);
}

const updateEveningReport = async(data) => {
  await executeQuery("UPDATE evening_reports SET time_sports = $1, time_studying = $2, reg_and_eating = $3, generic_mood = $4, user_id = $5 WHERE r_date = $6;",
    data.sports_and_exercises, data.studying, data.reg_and_eating, data.generic_mood, data.user_id, data.date);
}

export { hasReportedMorning, hasReportedEvening, addMorningReport, updateMorningReport,
  addEveningReport, updateEveningReport };
