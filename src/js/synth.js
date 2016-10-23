/* globals fluid */
/*

    The synth used in most of the examples in this package.

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
        mainUgen: "flock.ugen.squareOsc",
        synthDef: {
            ugen: "{that}.options.mainUgen",
            freq: {
                id:   "freq",
                ugen: "flock.ugen.midiFreq",
                // The pitch offset we control using "pitchbend" events.
                add: {
                    ugen:  "flock.ugen.value",
                    rate:  "audio",
                    id:    "pitchbend",
                    value: 64.0,
                    add:   -64.0,
                    mul:   1 // whole "step"
                }
            },
            mul: {
                id: "amp",
                ugen: "flock.ugen.midiAmp",
                velocity: 100,
                mul: {
                    id: "env",
                    ugen: "flock.ugen.asr"
                }
            }
        }
    });
})();
