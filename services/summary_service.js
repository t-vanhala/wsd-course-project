import { executeQuery } from "../database/database.js";

const getUsersDayAvgMood = async(day) => {
  const res = await executeQuery(
    "SELECT AVG(comb.generic_mood)::numeric(10,2) AS avg_gen_mood" +
      " FROM (SELECT generic_mood FROM morning_reports WHERE r_date = $1" +
        " UNION ALL SELECT generic_mood FROM evening_reports WHERE r_date = $1) AS comb;",
    day);
  
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
}

const getSummaryBetweenDays = async(user_id, first_day, last_day) => {
  const res = await executeQuery(
    "SELECT AVG(sleep_duration)::numeric(10,2) AS avg_sleep_dur, AVG(time_sports)::numeric(10,2) AS avg_time_sports, AVG(time_studying)::numeric(10,2) AS avg_time_studying, AVG(comb.generic_mood)::numeric(10,2) AS avg_gen_mood" +
    " FROM morning_reports, evening_reports," +
      " (SELECT generic_mood, user_id FROM morning_reports WHERE r_date >= $1 AND r_date <= $2 UNION ALL SELECT generic_mood, user_id FROM evening_reports WHERE r_date >= $1 AND r_date <= $2) AS comb" +
    " WHERE morning_reports.r_date >= $1 AND morning_reports.r_date <= $2 AND evening_reports.r_date >= $1 AND evening_reports.r_date <= $2 AND comb.user_id = $3 AND morning_reports.user_id = $3 AND evening_reports.user_id = $3;",
    first_day, last_day, user_id);
  
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
}

const apiSummary = async(first_day, last_day) => {
  const res = await executeQuery(
    "SELECT AVG(sleep_duration)::numeric(10,2) AS avg_sleep_dur, AVG(time_sports)::numeric(10,2) AS avg_time_sports, AVG(time_studying)::numeric(10,2) AS avg_time_studying, AVG(sleep_quality)::numeric(10,2) AS avg_sleep_quality, AVG(comb.generic_mood)::numeric(10,2) AS avg_gen_mood" +
    " FROM morning_reports, evening_reports," +
      " (SELECT generic_mood, user_id FROM morning_reports WHERE r_date >= $1 AND r_date <= $2 UNION ALL SELECT generic_mood, user_id FROM evening_reports WHERE r_date >= $1 AND r_date <= $2) AS comb" +
      " WHERE morning_reports.r_date >= $1 AND morning_reports.r_date <= $2 AND evening_reports.r_date >= $1 AND evening_reports.r_date <= $2;",
    first_day, last_day);
  
  if (res && res.rowCount > 0) {
    return res.rowsOfObjects();
  }
  return [];
}

export { getUsersDayAvgMood, getSummaryBetweenDays, apiSummary };
