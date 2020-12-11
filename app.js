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
app.use(middleware.requestTimingMiddleware);
app.use(middleware.logMiddleware);
app.use(middleware.serveStaticFiles);

app.use(oakCors());
app.use(router.routes());


let port = 7777;
if (Deno.args.length > 0) {
  const lastArgument = Deno.args[Deno.args.length - 1];
  port = Number(lastArgument);
}
app.listen({ port: port });
  
export default app;
