/*

    A component designed to take input from an M-Audio Oxygen8 v2

    Adapted from the MIDI demo included with Flocking: https://github.com/colinbdclark/Flocking

    The control knob CC codes correspond to preset 1 with the factory defaults.

 */
/*global fluid, flock*/

(function () {
    "use strict";

    var environment = flock.init();

    fluid.registerNamespace("lpiano.oxygen8");

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
        gradeNames: ["lpiano.harness"],
        model: {
            notes: [],
            knobs: {
                72: 64,
                8: 64,
                74: 64,
                71: 64,
                20: 64,
                22: 64,
                86: 64,
                73: 64
            }
        },
        components: {
            controller: {
                type: "flock.midi.controller",
                options: {
                    controlMap: {
                        "72": {
                            input: "env.start",
                            transform: {
                                mul: 1/127
                            }
                        },
                        "8": {
                            input: "env.attack",
                            transform: {
                                mul: 1/127
                            }
                        },
                        "74": {
                            input: "env.sustain",
                            transform: {
                                mul: 1/127
                            }
                        },
                        "71": {
                            input: "env.release",
                            transform: {
                                mul: 1/127
                            }
                        },
                        "20": {
                            input: "env.release",
                            transform: {
                                mul: 1/127
                            }
                        }
                        /*

                        TODO:  Add controls for "5", and "10"

                        potential adsr inputs?

                        delay: 0.1,
                        decay: 0.3,
                        peak: 1.0,
                        bias: 0.0

                        */
                    }
                }
            },
            midiConnector: {
                options: {
                    model: {
                        notes: "{oxygen8}.model.notes",
                        knobs: "{oxygen8}.model.knobs"
                    },
                    listeners: {
                        "control.controlToModel": {
                            funcName: "lpiano.oxygen8.controlToModel",
                            args:     ["{that}", "{arguments}.0"]
                        }
                    }
                }
            },
            knob1: {
                type: "lpiano.oxygen8.knob",
                container: "#knob1",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.72"
                    }
                }
            },
            knob2: {
                type: "lpiano.oxygen8.knob",
                container: "#knob2",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.8"
                    }
                }
            },
            knob3: {
                type: "lpiano.oxygen8.knob",
                container: "#knob3",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.74"
                    }
                }
            },
            knob4: {
                type: "lpiano.oxygen8.knob",
                container: "#knob4",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.71"
                    }
                }
            },
            knob5: {
                type: "lpiano.oxygen8.knob",
                container: "#knob5",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.20"
                    }
                }
            },
            knob6: {
                type: "lpiano.oxygen8.knob",
                container: "#knob6",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.22"
                    }
                }
            },
            knob7: {
                type: "lpiano.oxygen8.knob",
                container: "#knob7",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.86"
                    }
                }
            },
            knob8: {
                type: "lpiano.oxygen8.knob",
                container: "#knob8",
                options: {
                    model: {
                        value: "{lpiano.oxygen8}.model.knobs.73"
                    }
                }
            }
        }
    });
})();
