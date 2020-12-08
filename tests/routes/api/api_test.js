import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import app from "../../../app.js";

Deno.test({
    name: "GET request to /api/summary returns code 200",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/summary")
            .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /api/summary returns type 'application/json'",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/summary")
            .expect('Content-Type', new RegExp('application/json'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "POST request to /api/summary returns code 404",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/api/summary")
            .expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /api/summary/:year/:month/:day returns code 200",
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/summary/2020/11/30")
            .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "GET request to /api/summary/:year/:month/:day returns type 'application/json'", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/summary")
            .expect('Content-Type', new RegExp('application/json'))
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "POST request to /api/summary/:year/:month/:day returns code 404", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.post("/api/summary/2020/11/30")
            .expect(404);
    },
    sanitizeResources: false,
    sanitizeOps: false
});
