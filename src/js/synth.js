/* globals fluid */
/*

    The synth used in most of the examples in this package.

 */
(function () {
    "use strict";
    fluid.defaults("fluid.lpiano.synth", {
        gradeNames: ["flock.synth.polyphonic"],
        baseNote: "{that}.options.synthDef.freq.note", // Store a copy of the note so that we can safely bend the pitch.
        synthDef: {
            ugen: "flock.ugen.square",
            freq: {
                id: "freq",
                ugen: "flock.ugen.midiFreq",
                note: 60
            },
            mul: {
                id: "env",
                ugen: "flock.ugen.envGen",
                envelope: {
                    type: "flock.envelope.adsr",
                    attack: 0.2,
                    decay: 0.1,
                    sustain: 1.0,
                    release: 1.0
                },
                gate: 0.0,
                mul: {
                    id: "amp",
                    ugen: "flock.ugen.midiAmp",
                    velocity: 0
                }
            }
        }
    });
})();
