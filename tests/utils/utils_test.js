import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as utils from "../../utils/utils.js";

Deno.test({
    name: "Test checkDataNullableReturns true with nullable data", 
    async fn() {
        const summary = {
            obj1: null,
            obj2: null,
        }
        assertEquals(utils.checkDataNullable([summary]), true);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test checkDataNullableReturns false with non-nullable data", 
    async fn() {
        const summary = {
            obj1: "not-null",
            obj2: "not-null",
        }
        assertEquals(utils.checkDataNullable([summary]), false);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test stringifyDate returns today date in correct format", 
    async fn() {
        const today = new Date();
        const wanted_format = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        assertEquals(utils.stringifyDate(today), wanted_format);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test stringifyDate returns random date in correct format", 
    async fn() {
        const random_day = new Date("October 13, 2014");
        const wanted_format = random_day.getFullYear() + "-" + (random_day.getMonth() + 1) + "-" + random_day.getDate();
        assertEquals(utils.stringifyDate(random_day), wanted_format);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getSundayFromMonday test case 1, simple", 
    async fn() {
        const monday = new Date("November 2, 2020");
        const sunday = new Date("November 8, 2020");
        const result_format = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
        assertEquals(utils.getSundayFromMonday(monday), result_format);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getSundayFromMonday test case 2, harder", 
    async fn() {
        const monday = new Date("July 30, 2018");
        const sunday = new Date("August 5, 2018");
        const result_format = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
        assertEquals(utils.getSundayFromMonday(monday), result_format);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getFirstDateOfWeek returns correct day case 1, simple", 
    async fn() {
        const should_return = new Date("November 9, 2020");
        assertEquals(utils.getFirstDateOfWeek(46, 2020), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getFirstDateOfWeek returns correct day case 2, different months", 
    async fn() {
        const should_return = new Date("September 28, 2020");
        assertEquals(utils.getFirstDateOfWeek(40, 2020), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test Date.getWeek (declared in utils) returns correct week", 
    async fn() {
        const random_date = new Date("December 31, 2015");
        const should_return = 53;
        assertEquals(random_date.getWeek(), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test Date.getWeekYear (declared in utils) returns correct week year", 
    async fn() {
        const random_date = new Date("December 31, 2015");
        const should_return = 2015;
        assertEquals(random_date.getWeekYear(), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getMonthFirstDay returns first day of given month", 
    async fn() {
        const should_return = new Date("September 1, 2020");
        assertEquals(utils.getMonthFirstDay(9, 2020), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});

Deno.test({
    name: "Test getMonthLastDay returns correct day", 
    async fn() {
        const should_return = new Date("September 30, 2020");
        assertEquals(utils.getMonthLastDay(9, 2020), should_return);
    },
    sanitizeResources: false,
    sanitizeOps: false
});