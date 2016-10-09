// Sample songs in VexFlow format, for use with the "learning" modes.  The format used is designed to be used as 
// either the "expectedNotes" value in a "scorer", or as the "notes" in a vexflow "stave".
"use strict";
var fluid = fluid || require("infusion");

var lpiano = fluid.registerNamespace("lpiano");

fluid.registerNamespace("lpiano.songs");

lpiano.songs.twinkleTwinkle = [
    // "twinkle, twinkle, little star"
    { keys: "c/4", duration: "q" }, { keys: "c/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "a/4", duration: "q" }, { keys: "a/4", duration: "q" }, { keys: "g/4", duration: "h" },
    // "how I wonder what you are"
    { keys: "f/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "d/4", duration: "q" }, { keys: "d/4", duration: "q" }, { keys: "c/4", duration: "h" },
    // "up above the world so high"
    { keys: "g/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "d/4", duration: "h" },
    // "like a diamond in the sky"
    { keys: "g/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "d/4", duration: "h" },
    // "twinkle, twinkle little star"
    { keys: "c/4", duration: "q" }, { keys: "c/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "g/4", duration: "q" }, { keys: "a/4", duration: "q" }, { keys: "a/4", duration: "q" }, { keys: "g/4", duration: "h" },
    // "how I wonder what you are"
    { keys: "f/4", duration: "q" }, { keys: "f/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "e/4", duration: "q" }, { keys: "d/4", duration: "q" }, { keys: "d/4", duration: "q" }, { keys: "c/4", duration: "h" }
];
