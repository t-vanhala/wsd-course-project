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

const getLoggedUserId = async(session) => {
  const user = await session.get('user');
  if (user)
    return user.id;
  else
    return '';
}

const getLoggedUserEmail = async(session) => {
  const user = await session.get('user');
  if (user)
    return user.email;
  else
    return '';
}

export { checkDataNullable, stringifyDate, getSundayFromMonday, getLastWeekDate,
    getFirstDateOfWeek, getLastMonthFirstDay, getLastMonthLastDay, getMonthFirstDay,
    getMonthLastDay, getLoggedUserId, getLoggedUserEmail }