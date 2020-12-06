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

export { mainPage, showLogin, showRegister, showReportingPage, registerUser,
  reportMorning, submitMorningReport, reportEvening, submitEveningReport };
