/*

    A component designed to take input from an M-Audio Oxygen8 v2

    Adapted from the MIDI demo included with Flocking: https://github.com/colinbdclark/Flocking

 */
/*global fluid, flock*/

(function () {
    "use strict";

    var environment = flock.init();

    fluid.registerNamespace("lpiano.oxygen8");

    lpiano.oxygen8.inspect = function (args) {
        console.log(args.length, " arguments received...");
    };

    lpiano.oxygen8.controlToModel = function (that, controlPayload) {
        that.applier.change("knobs." + controlPayload.number, controlPayload.value);
    };

    fluid.defaults("lpiano.oxygen8.knob", {
        gradeNames: ["sisiliano.knob"],
        model: {
            min: 0,
            max: 127,
            color: "black"
        }
    });

    fluid.defaults("lpiano.oxygen8", {
        gradeNames: ["fluid.modelComponent", "fluid.viewComponent"],
        model: {
            notes: [],
            knobs: {
                71: 64,
                74: 64,
                84: 64,
                7:  64,
                91: 64,
                93: 64,
                5:  64,
                10: 64
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
                        "71": {
                            synth: "square",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "74": {
                            synth: "sin",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "84": {
                            synth: "tri",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "7": {
                            synth: "saw",
                            input: "mod.freq",
                            transform: {
                                div: 10240
                            }
                        },
                        "91": {
                            synth: "square",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "93": {
                            synth: "sin",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "5": {
                            synth: "tri",
                            input: "preamp.velocity",
                            transform: {
                                mul: 5
                            }
                        },
                        "10": {
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
                            funcName: "lpiano.oxygen8.controlToModel",
                            args:     ["{that}", "{arguments}.0"]
                        },
                        "noteOn.passToSynth": {
                            func: "{band}.noteOn",
                            args: [
                                "{arguments}.0.note",
                                {
                                    "fixedNoteOffset.value": "{arguments}.0.note",
                                    "amp.velocity": "{arguments}.0.velocity"
                                }
                            ]
                        },
                        "noteOff.passToSynth": "{band}.noteOff({arguments}.0.note)"
                    }
                }
            },
            band: {
                type: "lpiano.oxygen8.band",
                options: {
                    components: {
                        square: {
                            type: "lpiano.synth"
                        },
                        sin: {
                            type: "lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.sinOsc",
                                pitchOffset: -5
                            }
                        },
                        tri: {
                            type: "lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.triOsc",
                                pitchOffset: 5
                            }
                        },
                        saw: {
                            type: "lpiano.synth",
                            options: {
                                mainUgen: "flock.ugen.sawOsc",
                                pitchOffset: 12
                            }
                        }
                    }
                }
            },
            knob1: {
                type: "lpiano.oxygen8.knob",
                container: "#knob1",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.91"
                    }
                }
            },
            knob2: {
                type: "lpiano.oxygen8.knob",
                container: "#knob2",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.93"
                    }
                }
            },
            knob3: {
                type: "lpiano.oxygen8.knob",
                container: "#knob3",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.5"
                    }
                }
            },
            knob4: {
                type: "lpiano.oxygen8.knob",
                container: "#knob4",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.10"
                    }
                }
            },
            /*
             71: 64,
             74: 64,
             84: 64,
             7:  64,

             */
            knob5: {
                type: "lpiano.oxygen8.knob",
                container: "#knob5",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.71"
                    }
                }
            },
            knob6: {
                type: "lpiano.oxygen8.knob",
                container: "#knob6",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.74"
                    }
                }
            },
            knob7: {
                type: "lpiano.oxygen8.knob",
                container: "#knob7",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.84"
                    }
                }
            },
            knob8: {
                type: "lpiano.oxygen8.knob",
                container: "#knob8",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.7"
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
