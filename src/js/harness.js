(function () {
    /*

     A harness to handle passing "noteOn", "noteOff", and "pitchbend" events to a synth.  Designed to work with grades
     that extend `lpiano.synth`, which has the correct named IDs to set the values used here.

     */

    var environment = flock.init();

    fluid.registerNamespace("lpiano.harness");

    lpiano.harness.bendPitch = function (synth, value) {
        var scaledValue = (value / 128) - 64;
        synth.set("pitchbend.value", scaledValue );
    };

    fluid.defaults("lpiano.harness", {
        gradeNames: ["fluid.viewComponent"],
        pitchbendTarget: "pitchbend.value",
        components: {
            enviro: "{flock.enviro}",
            controller: {
                type: "flock.midi.controller",
                options: {
                    components: {
                        synthContext: "{synth}"
                    },
                    controlMap: {
                        // Modulation wheel
                        "1": {
                            input: "modwheel.add",
                            transform: {
                                mul: 1/16
                            }
                        },
                        // Volume control
                        "7": {
                            input: "volume.value",
                            transform: {
                                mul: 1/16
                            }
                        }
                    }
                }
            },
            midiConnector: {
                type: "flock.ui.midiConnector",
                container: "{that}.container",
                options: {
                    gradeNames: ["lpiano.transcriber"],
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
                        "pitchbend.passToSynth": {
                            funcName: "lpiano.harness.bendPitch",
                            args:     ["{synth}", "{arguments}.0.value"]
                        }
                    }
                }
            },
            synth: {
                type: "lpiano.synth"
            }
        },
        listeners: {
            onCreate: [
                "{that}.enviro.start()"
            ]
        }
    });
})();