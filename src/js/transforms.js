/*

    Static functions to assist in converting values, with Model transformation wrappers as a convenience.

 */
/* eslint-env node */
"use strict";
var fluid  = fluid || require("infusion");
var lpiano = fluid.registerNamespace("lpiano");

fluid.registerNamespace("lpiano.transforms");

lpiano.transforms.keyByPitchModulus = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
lpiano.transforms.pitchModulusByKey = { "c": 0, "c#": 1, "d": 2, "d#": 3, "e":4, "f":5, "f#":6, "g":7, "g#":8, "a":9, "a#":10, "b":11 };

lpiano.transforms.pitchToVexflowKey = function (pitch) {
    var octave = Math.floor(pitch / 12) - 2;
    var note   = lpiano.transforms.keyByPitchModulus[pitch % 12];

    return note + "/" + octave;
};

lpiano.transforms.vexflowKeyToPitch = function (key) {
    var segs = key.split("/");
    var modulus = lpiano.transforms.pitchModulusByKey[segs[0]];
    var octave  = parseInt(segs[1]);

    return ((octave + 2) * 12) + modulus;
};