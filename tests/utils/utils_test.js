import { assertEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as utils from "../../utils/utils.js";

Deno.test("Test checkDataNullableReturns true with nullable data", () => {
    const summary = {
        obj1: null,
        obj2: null,
    }
    assertEquals(utils.checkDataNullable([summary]), true);
});

Deno.test("Test checkDataNullableReturns false with non-nullable data", () => {
    const summary = {
        obj1: "not-null",
        obj2: "not-null",
    }
    assertEquals(utils.checkDataNullable([summary]), false);
});

Deno.test("Test stringifyDate returns today date in correct format", () => {
    const today = new Date();
    const wanted_format = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    assertEquals(utils.stringifyDate(today), wanted_format);
});

Deno.test("Test stringifyDate returns random date in correct format", () => {
    const random_day = new Date("October 13, 2014");
    const wanted_format = random_day.getFullYear() + "-" + (random_day.getMonth() + 1) + "-" + random_day.getDate();
    assertEquals(utils.stringifyDate(random_day), wanted_format);
});

Deno.test("Test getSundayFromMonday test case 1, simple", () => {
    const monday = new Date("November 2, 2020");
    const sunday = new Date("November 8, 2020");
    const result_format = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
    assertEquals(utils.getSundayFromMonday(monday), result_format);
});

Deno.test("Test getSundayFromMonday test case 2, harder", () => {
    const monday = new Date("July 30, 2018");
    const sunday = new Date("August 5, 2018");
    const result_format = sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate();
    assertEquals(utils.getSundayFromMonday(monday), result_format);
});

Deno.test("Test getFirstDateOfWeek returns correct day case 1, simple", () => {
    const should_return = new Date("November 9, 2020");
    assertEquals(utils.getFirstDateOfWeek(46, 2020), should_return);
});

Deno.test("Test getFirstDateOfWeek returns correct day case 2, different months", () => {
    const should_return = new Date("September 28, 2020");
    assertEquals(utils.getFirstDateOfWeek(40, 2020), should_return);
});

Deno.test("Test Date.getWeek (declared in utils) returns correct week", () => {
    const random_date = new Date("December 31, 2015");
    const should_return = 53;
    assertEquals(random_date.getWeek(), should_return);
});

Deno.test("Test Date.getWeekYear (declared in utils) returns correct week year, case 1", () => {
    const random_date = new Date("December 31, 2015");
    const should_return = 2015;
    assertEquals(random_date.getWeekYear(), should_return);
});

Deno.test("Test getMonthFirstDay returns first day of given month", () => {
    const should_return = new Date("September 1, 2020");
    assertEquals(utils.getMonthFirstDay(9, 2020), should_return);
});

Deno.test("Test getMonthLastDay returns correct day case 2, different months", () => {
    const should_return = new Date("September 30, 2020");
    assertEquals(utils.getMonthLastDay(9, 2020), should_return);
});