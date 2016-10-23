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
        mainUgen: "flock.ugen.sinOsc",
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
                    ugen: "flock.ugen.asr",
                    // Convenient place to let us control the volume
                    mul: {
                        id: "volume",
                        ugen: "flock.ugen.value",
                        value: 1
                    }
                }
                // TODO:  Discuss with Colin, this broke things.  I just wanted to have more things to control...
                // mul: {
                //     ugen: "flock.ugen.envGen",
                //     id: "env",
                //     envelope: {
                //         type: "flock.envelope.adsr",
                //         attack: 1.0,
                //         decay: 0.5,
                //         peak: 0.15,
                //         sutain: 0.1,
                //         release: 1.0
                //     },
                //     gate: 1.0,
                //     mul: {
                //         id: "volume",
                //         ugen: "flock.ugen.value",
                //         value: .5
                //     }
                // }
            },
            phase: {
                id: "phase",
                ugen: "flock.ugen.value",
                value: 0
            }
        }
    });
})();
