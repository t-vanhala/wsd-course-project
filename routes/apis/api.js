import * as service from "../../services/summary_service.js";
import { stringifyDate } from "../../utils/utils.js";

const sevenDaysSummary = async({response}) => {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const week_ago = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const first_day = stringifyDate(week_ago);
    const last_day = stringifyDate(yesterday);
    const summary = await service.apiSummary(first_day, last_day);
    // Only one item due to averages
    response.body = summary[0];
};

const oneDaySummary = async({params, response}) => {
    const wanted_day = params.year + "-" + params.month + "-" + params.day;
    const summary = await service.apiSummary(wanted_day, wanted_day);
    // Only one item due to averages
    response.body = summary[0];
};
   
export { sevenDaysSummary, oneDaySummary };
