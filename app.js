import { Application } from "./deps.js";
import { router } from "./routes/routes.js";
import * as middleware from "./middlewares/middlewares.js";
import { viewEngine, engineFactory, adapterFactory, Session, oakCors } from "./deps.js";

const app = new Application();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

const session = new Session({ framework: "oak" });
await session.init();
app.use(session.use()(session));

// Use middlewares
app.use(middleware.errorMiddleware);
app.use(middleware.authMiddleware);
app.use(middleware.logMiddleware);
app.use(middleware.serveStaticFiles);

app.use(oakCors());
app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
  
export default app;
