/* globals fluid */
/*

    The synth used in most of the examples in this package.  Supports static and variable pitch shifting.

 */
(function () {
    "use strict";

    fluid.registerNamespace("lpiano.synth");
    lpiano.synth.set = function (that, args) {
        var nodes = that.nodeList.nodes;
        var results = [];
        fluid.each(nodes, function (node) {
            results.push(node.set.apply(node, args));
        });

        return results.length > 0 ? results[0] : undefined;
    };

    fluid.defaults("lpiano.synth", {
        gradeNames: ["flock.synth.polyphonic"],
        invokers: {
            set: {
                funcName: "lpiano.synth.set",
                args: ["{that}", "{arguments}"]
            }
        },
        pitchOffset: 0,
        mainUgen: "flock.ugen.squareOsc",
        synthDef: {
            ugen: "{that}.options.mainUgen",
            freq: {
                id:   "freq",
                ugen: "flock.ugen.midiFreq",
                note: {
                    id:   "fixedNoteOffset",
                    ugen: "flock.ugen.value",
                    add:  "{that}.options.pitchOffset"
                }
            },
            mul: {
                id: "preamp",
                ugen: "flock.ugen.midiAmp",
                velocity: 50,
                mul: {
                    id: "amp",
                    ugen: "flock.ugen.midiAmp",
                    velocity: 15,
                    mul: {
                        id: "env",
                        ugen: "flock.ugen.asr",
                        attack: 0.2,
                        decay: 0.1,
                        sustain: 1.0,
                        release: 1.0,
                        gate: 0.0,
                        mul: {
                            id: "mod",
                            ugen: "flock.ugen.sinOsc",
                            freq: 1
                        }
                    }
                }
            }
        }
    });
})();
