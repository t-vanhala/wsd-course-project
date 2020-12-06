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

// router.get('/api/hello', api.getHello);
// router.post('/api/hello', api.setHello);

export { router };
