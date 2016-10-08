/* eslint-env node */
"use strict";
var fluid = require("infusion");

require("../../../src/js/transforms");

fluid.registerNamespace("fluid.tests.lpiano.transforms");

fluid.tests.lpiano.transforms.keys = [
    "c/-2", "c#/-2", "d/-2", "d#/-2", "e/-2", "f/-2", "f#/-2", "g/-2", "g#/-2", "a/-2", "a#/-2", "b/-2", // 00-11
    "c/-1", "c#/-1", "d/-1", "d#/-1", "e/-1", "f/-1", "f#/-1", "g/-1", "g#/-1", "a/-1", "a#/-1", "b/-1", // 12-23
    "c/0", "c#/0", "d/0", "d#/0", "e/0", "f/0", "f#/0", "g/0", "g#/0", "a/0", "a#/0", "b/0",             // 24-35
    "c/1", "c#/1", "d/1", "d#/1", "e/1", "f/1", "f#/1", "g/1", "g#/1", "a/1", "a#/1", "b/1",             // 36-47
    "c/2", "c#/2", "d/2", "d#/2", "e/2", "f/2", "f#/2", "g/2", "g#/2", "a/2", "a#/2", "b/2",             // 48-59
    "c/3", "c#/3", "d/3", "d#/3", "e/3", "f/3", "f#/3", "g/3", "g#/3", "a/3", "a#/3", "b/3",             // 60-71
    "c/4", "c#/4", "d/4", "d#/4", "e/4", "f/4", "f#/4", "g/4", "g#/4", "a/4", "a#/4", "b/4",             // 72-83
    "c/5", "c#/5", "d/5", "d#/5", "e/5", "f/5", "f#/5", "g/5", "g#/5", "a/5", "a#/5", "b/5",             // 84-95
    "c/6", "c#/6", "d/6", "d#/6", "e/6", "f/6", "f#/6", "g/6", "g#/6", "a/6", "a#/6", "b/6",             // 96-107
    "c/7", "c#/7", "d/7", "d#/7", "e/7", "f/7", "f#/7", "g/7", "g#/7", "a/7", "a#/7", "b/7",             // 108-119
    "c/8", "c#/8", "d/8", "d#/8", "e/8", "f/8", "f#/8", "g/8", "g#/8", "a/8", "a#/8", "b/8"              // 120-131
];

fluid.tests.lpiano.transforms.pitches = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,                       // 00-11
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,             // 12-23
    24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,             // 24-35
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,             // 36-47
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,             // 48-59
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,             // 60-71
    72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,             // 72-83
    84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,             // 84-95
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,     // 96-107
    108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, // 108-119
    120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131  // 120-131
];

require("../../../src/js/transforms");

var jqUnit = require("node-jqunit");
jqUnit.module("Testing static transformation functions...");

jqUnit.test("Testing vexflow -> pitch (direct function call)...", function () {
    for (var a = 0; a < 132; a++) {
        var expectedPitch       = a;
        var keyValueToTransform = fluid.tests.lpiano.transforms.keys[a];
        var computedPitch       =  lpiano.transforms.vexFlowToPitch(keyValueToTransform);
        jqUnit.assertEquals("The computed pitch should be correct...", expectedPitch, computedPitch);
    }
});

jqUnit.test("Testing pitch -> vexflow (direct function call)...", function () {
    for (var a = 0; a < 132; a++) {
        var expectedKey = fluid.tests.lpiano.transforms.keys[a];
        var computedKey = lpiano.transforms.pitchToVexflowKey(a);
        jqUnit.assertEquals("The computed key should be correct...", expectedKey, computedKey);
    }
});

jqUnit.test("Testing vexflow -> pitch (transform)...", function () {
    var transformedOutput = fluid.transform(fluid.tests.lpiano.transforms.keys, function (key) {
        return fluid.model.transformWithRules(key, {
            "": {
                transform: {
                    type:      "lpiano.transforms.vexFlowToPitch",
                    inputPath: ""
                }
            }
        });
    });

    jqUnit.assertDeepEq("The keys should all have been transformed correctly...", fluid.tests.lpiano.transforms.pitches, transformedOutput);
});

jqUnit.test("Testing pitch -> vexflow (transform)...", function () {
    var transformedOutput = fluid.transform(fluid.tests.lpiano.transforms.pitches, function (pitch) {
        return fluid.model.transformWithRules(pitch, {
            "": {
                transform: {
                    type:      "lpiano.transforms.pitchToVexFlow",
                    inputPath: ""
                }
            }
        });
    });

    jqUnit.assertDeepEq("The pitches should all have been transformed correctly...", fluid.tests.lpiano.transforms.keys, transformedOutput);
});
