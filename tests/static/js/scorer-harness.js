(function () {
    /*

        A test harness for the "scorer" that compares the notes played to a standard song.

     */

    var environment = flock.init();

    fluid.defaults("lpiano.tests.scorer.harness", {
        gradeNames: ["fluid.viewComponent"],
        components: {
            enviro: "{flock.enviro}",
            midiConnector: {
                type: "flock.ui.midiConnector",
                container: "{that}.container",
                options: {
                    events: {
                        noteOn: null,
                        noteOff: null
                    },
                    listeners: {
                        "noteOn.passToSynth": {
                            func: "{synth}.events.noteOn.fire",
                            args: [
                                {
                                    "freq.note": "{arguments}.0.note",
                                    "amp.velocity": "{arguments}.0.velocity"
                                }
                            ]
                        },
                        "noteOff.passToSynth": "{synth}.events.noteOff.fire({arguments}.0.note)"
                    }
                }
            },
            synth: {
                type: "lpiano.scorer",
                options: {
                    expectedNotes: lpiano.songs.twinkleTwinkle
                }
            },
            scoreboard: {
                type: "lpiano.vexflow",
                // container: ".vexflow-container",
                options: {
                    model: {
                        notes: "{synth}.model.scoreboard.notes"
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