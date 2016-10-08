/*

    Unit tests for the "scorer" static functions.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var lpiano = fluid.registerNamespace("lpiano");

require("../../../src/js/transforms");
require("../../../src/js/scorer");

var jqUnit = require("node-jqunit");

jqUnit.module("Unit tests for static scoring functions...");

jqUnit.test("Test the deep matching function...", function () {
    jqUnit.assertTrue("Deep matching should return true for matching string values...", lpiano.scorer.deepMatch("something", "something"));
    jqUnit.assertFalse("Deep matching should return false for string values that don't match...", lpiano.scorer.deepMatch("something", "something else"));

    jqUnit.assertTrue("Deep matching should return true when arrays of strings match...", lpiano.scorer.deepMatch(["something", "else"], ["something", "else"]));
    jqUnit.assertFalse("Deep matching should return false when arrays of strings don't match...", lpiano.scorer.deepMatch(["else", "something"], ["something", "else"]));

    jqUnit.assertTrue("Deep matching should return true when an arrays of a single string matches a literal string...", lpiano.scorer.deepMatch(["something"], "something"));
    jqUnit.assertFalse("Deep matching should return false when an arrays of a single string doesn't match a literal string", lpiano.scorer.deepMatch(["something"], "something else "));
});


jqUnit.test("Test the vexflow array transformation function...", function () {
    jqUnit.assertDeepEq("Individual notes should be transformed correctly...", [{ keys: ["c/0"] }], lpiano.scorer.notesToVexflow([{ pitch: 24}]));

    jqUnit.assertDeepEq("Arrays of notes should be transformed correctly...", [{ keys: ["c/0", "c/1"] }], lpiano.scorer.notesToVexflow([[{ pitch: 24}, { pitch: 36 }]]));
});

// lpiano.scorer.scoreNotes (transcribedNotes, expectedNotes)
jqUnit.test("Test the scoreNotes static function...", function () {
    var doReMi = [{ keys: ["c/0"] }, { keys: ["d/0"]}, { keys: ["e/0"]}];

    jqUnit.assertDeepEq("A perfect sequence of played notes should all be recognized...", doReMi, lpiano.scorer.scoreNotes(doReMi, doReMi));

    jqUnit.assertDeepEq("A sequence with a mixture of right and wrong notes should result in the expected `correct` notes....", [{ keys: ["c/0"] }, { keys: ["d/0"] }], lpiano.scorer.scoreNotes([{ keys: ["e/0"] }, { keys: ["c/0"] }, { keys: ["e/0"] }, { keys: ["d/0"] }], doReMi));

    jqUnit.assertDeepEq("An empty transcript should not have any `correct` notes....", [], lpiano.scorer.scoreNotes([], doReMi));
});
