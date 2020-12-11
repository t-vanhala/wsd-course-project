import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../app.js";
import * as middlewares from "../../middlewares/middlewares.js";

const fun = () => {
};
const fun2 = () => {
    throw Error('hello!');
};
Deno.test({
    name: "Test error middleware", 
    async fn() {
        await middlewares.errorMiddleware(fun, fun);
        await middlewares.errorMiddleware(fun, fun2);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

const url = {
    pathname: "/"
};
const request = {
    acceptsEncodings: fun,
    method: "get",
    url: url
};
Deno.test({
    name: "Test timing middleware", 
    async fn() {
        await middlewares.requestTimingMiddleware({request}, fun);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test serving middleware", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/static/test")
            .expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false
});