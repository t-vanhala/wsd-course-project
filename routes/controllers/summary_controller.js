import * as service from "../../services/summary_service.js";
import * as deps from "../../deps.js";

const checkDataNullable = (summary) => {
  let count = 0;
  let length = 0;
  summary.forEach((obj) => {
    for (const [key, value] of Object.entries(obj)) {
      length++;
      if (!value)
        count++;
    };
  });
  if (count === length)
    return true;
  else
    return false;
}

// Function to convert date to POSTGRESQL-friendly form
const stringifyDate = (day) => {
  const week_month = day.getMonth() + 1;
  const week_day = day.getDate();
  const week_year = day.getFullYear();

  return week_year + "-" + week_month + "-" + week_day;
}

const getSundayFromMonday = (monday) => {
  let day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return stringifyDate(day);
}

const getLastWeekDate = () => {
  const today = new Date();
  const last_week_date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  return last_week_date;
}

const getFirstDateOfWeek = (week, year) => {
  let date = new Date(year, 0, (1 + (week - 1) * 7));
  date.setDate(date.getDate() + (1 - date.getDay()));
  return date
}

// This script is released to the public domain and may be used, modified and
// distributed without restrictions. Attribution not necessary but appreciated.
// Source: https://weeknumber.net/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function() {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}

const getLastMonthFirstDay = () => {
  const today = new Date();
  const last_month_first_day = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return last_month_first_day;
}

const getLastMonthLastDay = () => {
  const today = new Date();
  const last_month_last_day = new Date(today.getFullYear(), today.getMonth(), 0);
  return last_month_last_day;
}

const getMonthFirstDay = (month, year) => {
  return new Date(year, month - 1, 1);
}

const getMonthLastDay = (month, year) => {
  return new Date(year, month, 0);
}

const data = {
  week_summary: [],
  month_summary: [],
  default_week: true,
  default_month: true,
  week_number: "",
  week_year: "",
  month_number: "",
  month_year: "",
  week_data_nullable: false,
  month_data_nullable: false,
};

const getSummary = async({request, render}) => {
  const user_id = 1; // FIX THIS!

  // -- weekly default summary:

  // Get last week dates
  const last_week_date = getLastWeekDate();
  const week_number = last_week_date.getWeek();
  const week_year = last_week_date.getWeekYear();
  const last_week_first_day = getFirstDateOfWeek(week_number, week_year);

  // These can be used with psql
  const last_week_monday = stringifyDate(last_week_first_day);
  const last_week_sunday = getSundayFromMonday(last_week_first_day);

  const week_summary = await service.getSummaryBetweenDays(user_id, last_week_monday, last_week_sunday);

  // -- monthly default summary:
  const first_day_last_month = stringifyDate(getLastMonthFirstDay());
  const last_day_last_month = stringifyDate(getLastMonthLastDay());
  const month_summary = await service.getSummaryBetweenDays(user_id, first_day_last_month, last_day_last_month);

  data.week_summary = week_summary;
  data.month_summary = month_summary;
  data.default_week = true;
  data.default_month = true;
  data.week_data_nullable = checkDataNullable(week_summary);
  data.month_data_nullable = checkDataNullable(month_summary);
  render('./reporting/summary.ejs', data);
}

const searchSummary = async({request, render}) => {
  const user_id = 1; // FIX THIS!
  const body = request.body();
  const params = await body.value;
  
  if (params.has('week') && params.get('week').length > 0) {
    const week = params.get('week');
    const week_number = week.substring(6);
    const week_year = week.substring(0, 4);
    const week_first_day = getFirstDateOfWeek(week_number, week_year);
    
    // These can be used with psql
    const week_start = stringifyDate(week_first_day);
    const week_end = getSundayFromMonday(week_first_day);
    
    const week_summary = await service.getSummaryBetweenDays(user_id, week_start, week_end);

    // Update data
    data.week_summary = week_summary;
    data.default_week = false;
    data.week_number = week_number;
    data.week_year = week_year;
    data.week_data_nullable = checkDataNullable(week_summary);
  }
  
  if (params.has('month') && params.get('month').length > 0) {
    const month = params.get('month');
    const month_number = month.substring(5);
    const month_year = month.substring(0, 4);
    const first_day_month = stringifyDate(getMonthFirstDay(month_number, month_year));
    const last_day_month = stringifyDate(getMonthLastDay(month_number, month_year));
    
    const month_summary = await service.getSummaryBetweenDays(user_id, first_day_month, last_day_month);

    // Update data
    data.month_summary = month_summary;
    data.default_month = false;
    data.month_number = month_number;
    data.month_year = month_year;
    data.month_data_nullable = checkDataNullable(month_summary);
  }

  render('./reporting/summary.ejs', data);

}

export { getSummary, searchSummary, stringifyDate };
