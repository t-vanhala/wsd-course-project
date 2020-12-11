import * as service from "../../services/report_service.js";
import * as deps from "../../deps.js";
import { stringifyDate, getLoggedUserId, getLoggedUserEmail } from "../../utils/utils.js";

const showReportingPage = async({session, render}) => {
  // Check if user has already completed reporting for the day
  const user_id = await getLoggedUserId(session);
  const morning_reporting_done = await service.hasReportedMorning(user_id, null);
  const evening_reporting_done = await service.hasReportedEvening(user_id, null);
  render('./reporting/reporting.ejs', {user_email: await getLoggedUserEmail(session),
    morning_reporting_done: morning_reporting_done,
    evening_reporting_done: evening_reporting_done})
}

const reportMorning = async({session, render}) => {
  const user_id = await getLoggedUserId(session);
  const data = {
    user_email: await getLoggedUserEmail(session),
    this_morning_reported: await service.hasReportedMorning(user_id, ''),
    populate_date: stringifyDate(new Date()),
    populate_sd: 0,
    populate_sq: [false, false, false, false, false],
    populate_gm: [false, false, false, false, false],
    errors: null,
    message: ""
  }
  render('./reporting/morning_report.ejs', data);
}

const morningReportValidationRules = {
  date: [deps.isDate],
  sleep_duration: [deps.required, deps.numberBetween(0, 24)],
  sleep_quality: [deps.required, deps.numberBetween(1, 5), deps.isInt],
  generic_mood: [deps.required, deps.numberBetween(1, 5), deps.isInt],
};

const getMorningReportData = async(session, request) => {
  const data = {
    user_email: await getLoggedUserEmail(session),
    user_id: "",
    this_morning_reported: "",
    date: null,
    populate_date: stringifyDate(new Date()),
    sleep_duration: "",
    populate_sd: 0,
    sleep_quality: "",
    populate_sq: [false, false, false, false, false],
    generic_mood: "",
    populate_gm: [false, false, false, false, false],
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

const submitMorningReport = async({session, request, render}) => {
  const data = await getMorningReportData(session, request);
  // Validate data
  const [passes, errors] = await deps.validate(data, morningReportValidationRules);
  data.user_id = await getLoggedUserId(session);
  data.this_morning_reported = await service.hasReportedMorning(data.user_id, null);
  if (passes) {
    // Lets add data to database
    
    // Check if given date is reported
    if (await service.hasReportedMorning(data.user_id, data.date)) {
      // Update report
      service.updateMorningReport(data);
    } else {
      // Create a new report for that day
      service.addMorningReport(data);
    }

    data.message = "Report submitted!";
    render('./reporting/morning_report.ejs', data);
  } else {
    // Populate values
    data.populate_sq[data.sleep_quality - 1] = true;
    data.populate_gm[data.generic_mood - 1] = true;
    data.populate_date = data.date;
    data.populate_sd = data.sleep_duration;

    // Data is not added to db. Show errors to user.
    data.errors = errors;
    data.message = "Report not submitted!";
    render('./reporting/morning_report.ejs', data);
  }
}

const reportEvening = async({session, render}) => {
  const user_id = await getLoggedUserId(session);
  const data = {
    user_email: await getLoggedUserEmail(session),
    this_evening_reported: await service.hasReportedEvening(user_id, ''),
    populate_date: stringifyDate(new Date()),
    populate_se: 0,
    populate_st: 0,
    populate_re: [false, false, false, false, false],
    populate_gm: [false, false, false, false, false],
    errors: null,
    message: ""
  }
  render('./reporting/evening_reports.ejs', data);
}

const eveningReportValidationRules = {
  date: [deps.isDate],
  sports_and_exercises: [deps.required, deps.numberBetween(0, 24)],
  studying: [deps.required, deps.numberBetween(0, 24)],
  reg_and_eating: [deps.required, deps.numberBetween(1, 5), deps.isInt],
  generic_mood: [deps.required, deps.numberBetween(1, 5), deps.isInt],
};

const getEveningReportData = async(session, request) => {
  const data = {
    user_email: await getLoggedUserEmail(session),
    user_id: "",
    this_evening_reported: "",
    date: null,
    populate_date: stringifyDate(new Date()),
    sports_and_exercises: "",
    populate_se: 0,
    studying: "",
    populate_st: 0,
    reg_and_eating: "",
    populate_re: [false, false, false, false, false],
    generic_mood: "",
    populate_gm: [false, false, false, false, false],
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

const submitEveningReport = async({session, request, render}) => {
  const data = await getEveningReportData(session, request);
  // Validate data
  const [passes, errors] = await deps.validate(data, eveningReportValidationRules);
  data.user_id = await getLoggedUserId(session);
  data.this_evening_reported = await service.hasReportedEvening(data.user_id, null);
  if (passes) {
    // Lets add data to database
    
    // Check if given date is reported
    if (await service.hasReportedEvening(data.user_id, data.date)) {
      // Update report
      service.updateEveningReport(data);
    } else {
      // Create a new report for that day
      service.addEveningReport(data);
    }

    data.message = "Report submitted!";
    render('./reporting/evening_reports.ejs', data);
  } else {
    // Populate values
    data.populate_re[data.reg_and_eating - 1] = true;
    data.populate_gm[data.generic_mood - 1] = true;
    data.populate_date = data.date;
    data.populate_se = data.sports_and_exercises;
    data.populate_st = data.studying;

    // Data is not added to db. Show errors to user.
    data.errors = errors;
    data.message = "Report not submitted!";
    render('./reporting/evening_reports.ejs', data);
  }
}

export { showReportingPage, reportMorning, submitMorningReport, reportEvening, submitEveningReport };
