import { send } from "../deps.js";

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const authMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/behavior') && !(await session.get('authenticated'))) {
    response.redirect('/auth/login');
  } else {
    await next();
  }
};

const requestTimingMiddleware = async({ request }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${request.method} ${request.url.pathname} - ${ms} ms`);
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

export { errorMiddleware, authMiddleware, requestTimingMiddleware, serveStaticFiles };
