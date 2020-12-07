import { Router } from "../deps.js";
import * as controller from "./controllers/controller.js";
import * as api from "./apis/api.js";

const router = new Router();

// Root
router.get('/', controller.mainPage);
// Auth related
router.get('/auth/login', controller.showLogin);
router.get('/auth/registration', controller.showRegister);
router.post('/auth/registration', controller.registerUser);
// Behavior related
router.get('/behavior/reporting', controller.showReportingPage);
router.get('/behavior/reporting/morning', controller.reportMorning);
router.post('/behavior/reporting/morning', controller.submitMorningReport);
router.get('/behavior/reporting/evening', controller.reportEvening);
router.post('/behavior/reporting/evening', controller.submitEveningReport);
router.get('/behavior/summary', controller.getSummary);
router.post('/behavior/summary', controller.searchSummary);
// API
router.get('/api/summary', api.sevenDaysSummary);
router.get('/api/summary/:year/:month/:day', api.oneDaySummary);

export { router };
