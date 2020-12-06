import { Router } from "../deps.js";
import * as controller from "./controllers/controller.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get('/', controller.mainPage);
router.get('/auth/login', controller.showLogin);
router.get('/auth/registration', controller.showRegister);
router.get('/behavior/reporting', controller.showReportingPage);
router.post('/auth/registration', controller.registerUser);
router.get('/behavior/reporting/morning', controller.reportMorning);
router.post('/behavior/reporting/morning', controller.submitMorningReport);
router.get('/behavior/reporting/evening', controller.reportEvening);
router.post('/behavior/reporting/evening', controller.submitEveningReport);
router.get('/behavior/summary', controller.getSummary);
//router.post('/behavior/summary', controller.searchSummary);

// router.get('/api/hello', api.getHello);
// router.post('/api/hello', api.setHello);

export { router };
