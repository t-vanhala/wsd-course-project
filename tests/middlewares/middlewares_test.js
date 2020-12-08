import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../app.js";
import * as middlewares from "../../middlewares/middlewares.js";

const fun = () => {
};
const fun2 = () => {
    throw Error('hello!');
};
Deno.test("Test error middleware", async()=> {
    await middlewares.errorMiddleware(fun, fun);
    await middlewares.errorMiddleware(fun, fun2);
});

const url = {
    pathname: "/"
};
const request = {
    acceptsEncodings: fun,
    method: "get",
    url: url
};
Deno.test("Test timing middleware", async() => {
    await middlewares.requestTimingMiddleware({request}, fun);
});

Deno.test("Test serving middleware", async () => {
    const testClient = await superoak(app);
    await testClient.post("/static/test")
        .expect(404);
});