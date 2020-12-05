import { Router } from "../deps.js";
import * as controller from "./controllers/controller.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get('/', controller.mainPage);
router.get('/auth/login', controller.showLogin);

// router.get('/api/hello', api.getHello);
// router.post('/api/hello', api.setHello);

export { router };
