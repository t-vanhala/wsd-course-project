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
  const morning_reporting_done = await service.hasReportedMorning(user_id);
  const evening_reporting_done = await service.hasReportedEvening(user_id);
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
  //const ret_msg = await tryMorningReporting({request});
  const user_id = 1; // FIX THIS!
  const data = {
    morning_reported: await service.hasReportedMorning(user_id),
    errors: null
  }
  render('morning_report.ejs', data);
}

const morningReportValidationRules = {
  date: [deps.isDate],
  sleep_duration: [deps.required, deps.numberBetween(0, 24)],
  sleep_quality: [deps.required, deps.numberBetween(1, 5)],
  generic_mood: [deps.required, deps.numberBetween(1, 5)],
};

const getMorningReportData = async(request) => {
  const data = {
    morning_reported: "",
    date: "",
    sleep_duration: "",
    sleep_quality: "",
    generic_mood: "",
    errors: null
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
  const user_id = 1; // FIX THIS!
  const data = await getMorningReportData(request);
  // Validate data
  const [passes, errors] = await deps.validate(data, morningReportValidationRules);
  data.morning_reported = await service.hasReportedMorning(user_id);
  if (passes) {
    // Lets add data to database

    render('morning_report.ejs', data);
  } else {
    // Data is not added to db. Show errors to user.
    console.log(errors);
    data.errors = errors;
    render('morning_report.ejs', data);
  }
  //const ret_msg = await tryMorningReporting({request});
  // const user_id = 1; // FIX THIS!
  // render('morning_report.ejs', {morning_reported: await service.hasReportedMorning(user_id),
  //   message: ''});
}

export { mainPage, showLogin, showRegister, showReportingPage, registerUser, reportMorning, submitMorningReport };
