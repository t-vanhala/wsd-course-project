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
    name: "GET request to /api/summary/:year/:month/:day returns code 200", 
    async fn() {
        const testClient = await superoak(app);
        await testClient.get("/api/summary/2020/11/30")
            .expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
});