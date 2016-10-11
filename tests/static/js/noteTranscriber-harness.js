(function () {
    /*

        A test harness for the "transcriber" that records all notes and displays them using vexflow.

     */

    var environment = flock.init();

    fluid.defaults("lpiano.tests.transcriber.harness", {
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
            piano: {
                type: "lpiano.sisiliano",
                container: "#preview"
            },
            synth: {
                type: "lpiano.synth"
            },
            staves: {
                type: "lpiano.transcriber.staves",
                options: {
                    container: "{harness}.options.vexflowContainer",
                    model: {
                        midiNotes: "{transcriber}.model.midiNotes"
                    }
                }
            }
        },
        vexflowContainer: ".vexflow-container",
        listeners: {
            onCreate: [
                "{that}.enviro.start()"
            ]
        }
    });
})();