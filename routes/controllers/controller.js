import * as service from "../../services/service.js";
import * as deps from "../../deps.js";

const mainPage = async({render}) => {
  render('index.ejs');
};

const showLogin = async({render}) => {
  render('login.ejs');
}

const showRegister = async({render}) => {
  render('register.ejs', {message: ''});
}

const showReportingPage = async({render}) => {
  // Check if user has already completed reporting for the day
  // TODO: use user id from session
  const user_id = 1; // FIX THIS!
  const morning_reporting_done = await service.hasReportedMorning(user_id, null);
  const evening_reporting_done = await service.hasReportedEvening(user_id, null);
  render('reporting.ejs', {morning_reporting_done: morning_reporting_done,
    evening_reporting_done: evening_reporting_done})
}

// Try register user, return message about operation.
const tryRegister = async({request}) => {
  const body = request.body();
  const params = await body.value;
  
  const email = params.get('email');
  const password = params.get('password');
  const verification = params.get('verification');

  if (password !== verification) {
    return 'The entered passwords did not match';
  }

  if (password.length < 4) {
    return 'Password must contain at least 4 characters';
  }

  const already_used = await service.areExistingUsers(email);
  if (already_used) {
    return 'The email is already reserved.';
  }

  const hash = await deps.hash(password);
  await service.addUser(email, hash);
  return 'Registration successful. You can log in now.';
};

const registerUser = async({request, render}) => {
  const ret_msg = await tryRegister({request});
  render('register.ejs', {message: ret_msg});
}

const reportMorning = async({request, render}) => {
  const user_id = 1; // FIX THIS!
  const data = {
    this_morning_reported: await service.hasReportedMorning(user_id, ''),
    errors: null,
    message: ""
  }
  render('morning_report.ejs', data);
}

const morningReportValidationRules = {
  date: [deps.isDate],
  sleep_duration: [deps.required, deps.numberBetween(0, 24)],
  sleep_quality: [deps.required, deps.numberBetween(1, 5), deps.isInt],
  generic_mood: [deps.required, deps.numberBetween(1, 5), deps.isInt],
};

const getMorningReportData = async(request) => {
  const data = {
    user_id: "",
    this_morning_reported: "",
    date: null,
    sleep_duration: "",
    sleep_quality: "",
    generic_mood: "",
    errors: null,
    message: ""
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get("date");
    data.sleep_duration = Number(params.get("sleep_duration"));
    data.sleep_quality = Number(params.get("sleep_quality"));
    data.generic_mood = Number(params.get("generic_mood"));
  }

  return data;
};

const submitMorningReport = async({request, render}) => {
  const data = await getMorningReportData(request);
  // Validate data
  const [passes, errors] = await deps.validate(data, morningReportValidationRules);
  data.user_id = 1; // FIX THIS! Take value from session..
  data.this_morning_reported = await service.hasReportedMorning(data.user_id, null);
  if (passes) {
    // Lets add data to database
    
    // First check if date is given
    if (data.date) {
      // Check if given date is reported
      if (await service.hasReportedMorning(data.user_id, data.date)) {
        // Update report
        service.updateMorningReport(data);
      } else {
        // Create a new report for that day
        service.addMorningReport(data);
      }
    } else {
      // Date not given, and we know if today has been reported
      if (data.this_morning_reported) {
        // Update this morning report
        service.updateMorningReport(data);
      } else {
        // Add new report for this morning
        service.addMorningReport(data);
      }
    }

    data.message = "Report submitted!";
    render('morning_report.ejs', data);
  } else {
    // Data is not added to db. Show errors to user.
    console.log(errors);
    data.errors = errors;
    data.message = "Report not submitted!";
    render('morning_report.ejs', data);
  }
}

const reportEvening = async({request, render}) => {
  const user_id = 1; // FIX THIS!
  const data = {
    this_evening_reported: await service.hasReportedEvening(user_id, ''),
    errors: null,
    message: ""
  }
  render('evening_reports.ejs', data);
}

const eveningReportValidationRules = {
  date: [deps.isDate],
  sports_and_exercises: [deps.required, deps.numberBetween(0, 24)],
  studying: [deps.required, deps.numberBetween(0, 24)],
  reg_and_eating: [deps.required, deps.numberBetween(1, 5), deps.isInt],
  generic_mood: [deps.required, deps.numberBetween(1, 5), deps.isInt],
};

const getEveningReportData = async(request) => {
  const data = {
    user_id: "",
    this_evening_reported: "",
    date: null,
    sports_and_exercises: "",
    studying: "",
    reg_and_eating: "",
    generic_mood: "",
    errors: null,
    message: ""
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get("date");
    data.sports_and_exercises = Number(params.get("sports_and_exercises"));
    data.studying = Number(params.get("studying"));
    data.reg_and_eating = Number(params.get("reg_and_eating"));
    data.generic_mood = Number(params.get("generic_mood"));
  }

  return data;
};

const submitEveningReport = async({request, render}) => {
  const data = await getEveningReportData(request);
  // Validate data
  const [passes, errors] = await deps.validate(data, eveningReportValidationRules);
  data.user_id = 1; // FIX THIS! Take value from session..
  data.this_evening_reported = await service.hasReportedEvening(data.user_id, null);
  if (passes) {
    // Lets add data to database
    
    // First check if date is given
    if (data.date) {
      // Check if given date is reported
      if (await service.hasReportedEvening(data.user_id, data.date)) {
        // Update report
        service.updateEveningReport(data);
      } else {
        // Create a new report for that day
        service.addEveningReport(data);
      }
    } else {
      // Date not given, and we know if today has been reported
      if (data.this_evening_reported) {
        // Update this evening report
        service.updateEveningReport(data);
      } else {
        // Add new report for this evening
        service.addEveningReport(data);
      }
    }

    data.message = "Report submitted!";
    render('evening_reports.ejs', data);
  } else {
    // Data is not added to db. Show errors to user.
    console.log(errors);
    data.errors = errors;
    data.message = "Report not submitted!";
    render('evening_reports.ejs', data);
  }
}

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
  render('summary.ejs', data);
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

  render('summary.ejs', data);

}

export { mainPage, showLogin, showRegister, showReportingPage, registerUser,
  reportMorning, submitMorningReport, reportEvening, submitEveningReport,
  getSummary, searchSummary, stringifyDate };
