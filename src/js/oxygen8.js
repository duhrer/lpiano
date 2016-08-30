/*

    A component designed to take input from an M-Audio Oxygen8 v2

    Adapted from the MIDI demo included with Flocking: https://github.com/colinbdclark/Flocking

 */
/*global fluid, flock*/

(function () {
    "use strict";

    var environment = flock.init();

    fluid.registerNamespace("fluid.lpiano.oxygen8");

    fluid.lpiano.oxygen8.inspect = function (args) {
        console.log(args.length, " arguments received...");
    };

    fluid.lpiano.oxygen8.bendPitch = function (that, midiInput) {
        var bentPitch = that.synth.options.baseNote + (midiInput.value / 8192);
        that.synth.set("freq.note", bentPitch);
    };

    fluid.defaults("fluid.lpiano.oxygen8", {
        gradeNames: ["fluid.modelComponent", "fluid.viewComponent"],
        model: {
            notes: []
        },
        components: {
            enviro: "{flock.enviro}",
            midiConnector: {
                type: "flock.ui.midiConnector",
                container: "{that}.container",
                options: {
                    model: {
                        notes: "{oxygen8}.model.notes"
                    },
                    listeners: {
                        "noteOn.passToSynth": {
                            func: "{synth}.noteOn",
                            args: [
                                "{arguments}.0.note",
                                {
                                    "freq.note": "{arguments}.0.note",
                                    "amp.velocity": "{arguments}.0.velocity"
                                }
                            ]
                        },
                        "noteOff.passToSynth": "{synth}.noteOff({arguments}.0.note)",
                        "pitchbend.bendPitch": {
                            funcName: "fluid.lpiano.oxygen8.bendPitch",
                            args:     ["{oxygen8}", "{arguments}.0"]
                        }
                    }
                }
            },
            synth: {
                type: "fluid.lpiano.synth"
            }
        },

        listeners: {
            onCreate: [
                "{that}.enviro.start()"
            ]
        }
    });
})();
