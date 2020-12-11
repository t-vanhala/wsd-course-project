import { send } from "../deps.js";
import { getLoggedUserId } from "../utils/utils.js";

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const authMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/behavior') && !(await session.get('authenticated'))) {
    response.status = 403;
    response.redirect('/auth/login');
  } else {
    await next();
  }
};

const logMiddleware = async({ request, session }, next) => {
  const current_time = new Date();
  if (await session.get('user')) {
    const user = await getLoggedUserId(session);
    console.log(`Time: ${current_time} Method: ${request.method} Path: ${request.url.pathname} User: ${user}`);
  } else {
    console.log(`Time: ${current_time} Method: ${request.method} Path: ${request.url.pathname} User: Anonymous`);
  }
  await next();
}

const serveStaticFiles = async (context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  } else {
    await next();
  }
}

export { errorMiddleware, authMiddleware, logMiddleware, serveStaticFiles };
