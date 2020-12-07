import { Router } from "../deps.js";
import * as auth_controller from "./controllers/auth_controller.js";
import * as report_controller from "./controllers/report_controller.js";
import * as summary_controller from "./controllers/summary_controller.js";
import * as api from "./apis/api.js";

const router = new Router();

// Root
router.get('/', auth_controller.mainPage);
// Auth related
router.get('/auth/login', auth_controller.showLogin);
router.get('/auth/registration', auth_controller.showRegister);
router.post('/auth/registration', auth_controller.registerUser);
// Behavior related
router.get('/behavior/reporting', report_controller.showReportingPage);
router.get('/behavior/reporting/morning', report_controller.reportMorning);
router.post('/behavior/reporting/morning', report_controller.submitMorningReport);
router.get('/behavior/reporting/evening', report_controller.reportEvening);
router.post('/behavior/reporting/evening', report_controller.submitEveningReport);
router.get('/behavior/summary', summary_controller.getSummary);
router.post('/behavior/summary', summary_controller.searchSummary);
// API
router.get('/api/summary', api.sevenDaysSummary);
router.get('/api/summary/:year/:month/:day', api.oneDaySummary);

export { router };
