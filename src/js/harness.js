(function () {
    /*

     A harness to handle passing "noteOn", "noteOff", and "pitchbend" events to a synth.  Designed to work with grades
     that extend `lpiano.synth`, which has the correct named IDs to set the values used here.

     */

    var environment = flock.init();

    fluid.registerNamespace("lpiano.harness");

    // Strip the eighth bit from a raw pitchbend value, so that we only get the "bend" (0-127).
    lpiano.harness.bendPitch = function (synth, value) {
        synth.set("pitchbend.value", value & 127);
    };

    fluid.defaults("lpiano.harness", {
        gradeNames: ["fluid.viewComponent"],
        components: {
            enviro: "{flock.enviro}",
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
                        "noteOff.passToSynth": "{synth}.noteOff({arguments}.0.note)"
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