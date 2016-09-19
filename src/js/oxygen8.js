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

    fluid.lpiano.oxygen8.controlToModel = function (that, controlPayload) {
        that.applier.change("knobs." + controlPayload.number, controlPayload.value);
    };

    fluid.defaults("fluid.lpiano.oxygen8.knob", {
        gradeNames: ["sisiliano.knob"],
        model: {
            min: 0,
            max: 127,
            color: "black"
        }
    });

    fluid.registerNamespace("fluid.lpiano.oxygen8.band");

    fluid.lpiano.oxygen8.band.sendToAll = function (that, fnName, args) {
        var synths = fluid.queryIoCSelector(that, "flock.synth.group");
        fluid.each(synths, function (synth) {
            synth[fnName].apply(synth, args);
        });
    };

    fluid.defaults("fluid.lpiano.oxygen8.band", {
        gradeNames: ["flock.band"],
        invokers: {
            noteOn: {
                funcName: "fluid.lpiano.oxygen8.band.sendToAll",
                args: ["{that}", "noteOn", "{arguments}"]
            },
            noteOff: {
                funcName: "fluid.lpiano.oxygen8.band.sendToAll",
                args: ["{that}", "noteOff", "{arguments}"]
            }
        }

    });


    fluid.defaults("fluid.lpiano.oxygen8", {
        gradeNames: ["fluid.modelComponent", "fluid.viewComponent"],
        model: {
            notes: [],
            knobs: {
                8: 64,
                9: 64,
                10: 64,
                12: 64,
                13: 64,
                14: 64,
                15: 64,
                16: 64
            }
        },
        components: {
            enviro: "{flock.enviro}",
            controller: {
                type: "flock.midi.controller",
                options: {
                    components: {
                        synthContext: "{band}"
                    },
                    controlMap: {
                        "8": {
                            synth: "square",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "9": {
                            synth: "sin",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "10": {
                            synth: "tri",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "12": {
                            synth: "saw",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "13": {
                            synth: "square",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "14": {
                            synth: "sin",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "15": {
                            synth: "tri",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "16": {
                            synth: "saw",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        }
                    }
                }
            },
            midiConnector: {
                type: "flock.ui.midiConnector",
                container: "#input-selector",
                options: {
                    model: {
                        notes: "{oxygen8}.model.notes",
                        knobs: "{oxygen8}.model.knobs"
                    },
                    listeners: {
                        "control.controlToModel": {
                            funcName: "fluid.lpiano.oxygen8.controlToModel",
                            args:     ["{that}", "{arguments}.0"]
                        },
                        "noteOn.passToSynth": {
                            func: "{band}.noteOn",
                            args: [
                                "{arguments}.0.note",
                                {
                                    "freq.note": "{arguments}.0.note",
                                    "amp.velocity": "{arguments}.0.velocity"
                                }
                            ]
                        },
                        "noteOff.passToSynth": "{band}.noteOff({arguments}.0.note)"
                    }
                }
            },
            band: {
                type: "fluid.lpiano.oxygen8.band",
                options: {
                    components: {
                        square: {
                            type: "fluid.lpiano.synth"
                        },
                        sin: {
                            type: "fluid.lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.sinOsc"
                            }
                        },
                        tri: {
                            type: "fluid.lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.triOsc"
                            }
                        },
                        saw: {
                            type: "fluid.lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.sawOsc"
                            }
                        }
                    }
                }
            },
            knob1: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob1",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.8"
                    }
                }
            },
            knob2: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob2",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.9"
                    }
                }
            },
            knob3: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob3",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.10"
                    }
                }
            },
            knob4: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob4",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.12"
                    }
                }
            },
            knob5: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob5",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.13"
                    }
                }
            },
            knob6: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob6",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.14"
                    }
                }
            },
            knob7: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob7",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.15"
                    }
                }
            },
            knob8: {
                type: "fluid.lpiano.oxygen8.knob",
                container: "#knob8",
                options: {
                    model: {
                        value: "{fluid.lpiano.oxygen8}.model.knobs.16"
                    }
                }
            }
        },

        listeners: {
            onCreate: [
                "{that}.enviro.start()"
            ]
        }
    });
})();
