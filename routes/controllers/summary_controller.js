import * as service from "../../services/summary_service.js";
import * as deps from "../../deps.js";
import * as utils from "../../utils/utils.js";

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
  const last_week_date = utils.getLastWeekDate();
  const week_number = last_week_date.getWeek();
  const week_year = last_week_date.getWeekYear();
  const last_week_first_day = utils.getFirstDateOfWeek(week_number, week_year);

  // These can be used with psql
  const last_week_monday = utils.stringifyDate(last_week_first_day);
  const last_week_sunday = utils.getSundayFromMonday(last_week_first_day);

  const week_summary = await service.getSummaryBetweenDays(user_id, last_week_monday, last_week_sunday);

  // -- monthly default summary:
  const first_day_last_month = utils.stringifyDate(utils.getLastMonthFirstDay());
  const last_day_last_month = utils.stringifyDate(utils.getLastMonthLastDay());
  const month_summary = await service.getSummaryBetweenDays(user_id, first_day_last_month, last_day_last_month);

  data.week_summary = week_summary;
  data.month_summary = month_summary;
  data.default_week = true;
  data.default_month = true;
  data.week_data_nullable = utils.checkDataNullable(week_summary);
  data.month_data_nullable = utils.checkDataNullable(month_summary);
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
    const week_first_day = utils.getFirstDateOfWeek(week_number, week_year);
    
    // These can be used with psql
    const week_start = utils.stringifyDate(week_first_day);
    const week_end = utils.getSundayFromMonday(week_first_day);
    
    const week_summary = await service.getSummaryBetweenDays(user_id, week_start, week_end);

    // Update data
    data.week_summary = week_summary;
    data.default_week = false;
    data.week_number = week_number;
    data.week_year = week_year;
    data.week_data_nullable = utils.checkDataNullable(week_summary);
  }
  
  if (params.has('month') && params.get('month').length > 0) {
    const month = params.get('month');
    const month_number = month.substring(5);
    const month_year = month.substring(0, 4);
    const first_day_month = utils.stringifyDate(utils.getMonthFirstDay(month_number, month_year));
    const last_day_month = utils.stringifyDate(utils.getMonthLastDay(month_number, month_year));
    
    const month_summary = await service.getSummaryBetweenDays(user_id, first_day_month, last_day_month);

    // Update data
    data.month_summary = month_summary;
    data.default_month = false;
    data.month_number = month_number;
    data.month_year = month_year;
    data.month_data_nullable = utils.checkDataNullable(month_summary);
  }

  render('./reporting/summary.ejs', data);

}

export { getSummary, searchSummary };
