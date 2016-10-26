/* globals fluid */
/*

    The synth used in most of the examples in this package.

 */
(function () {
    "use strict";

    fluid.registerNamespace("lpiano.synth");

    // Set a value in all voices.  Used with the mod wheel and pitchbend, which affect all playing voices.
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
        mainUgen: "flock.ugen.sinOsc",
        synthDef: {
            ugen: "{that}.options.mainUgen",
            freq: {
                id: "modwheel",
                ugen: "flock.ugen.sinOsc",
                freq: {
                    id:   "freq",
                    ugen: "flock.ugen.midiFreq",
                    // The pitch offset we control using "pitchbend" events.
                    add: {
                        ugen:  "flock.ugen.value",
                        rate:  "audio",
                        id:    "pitchbend",
                        value: 0,
                        add: -64,
                        mul:   1 // whole "step" in either direction
                    }
                },
                phase: 0.25,
                mul: 250,
                add: 0
            },
            mul: {
                id: "amp",
                ugen: "flock.ugen.midiAmp",
                velocity: 100,
                mul: {
                    id: "env",
                    ugen: "flock.ugen.asr",
                    // Convenient place to let us control the volume
                    mul: {
                        id: "volume",
                        ugen: "flock.ugen.value",
                        value: 1
                    }
                }
            },
            phase: {
                id: "phase",
                ugen: "flock.ugen.value",
                value: 0
            }
        }
    });
})();
