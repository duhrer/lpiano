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
                    // // TODO: Discuss with Colin why midiConnector registers for "parent" events that don't exist
                    events: {
                        noteOn: null,
                        noteOff: null
                    },
                    listeners: {
                        "noteOn.passToSynth": {
                            func: "{synth}.events.noteOn.fire",
                            args: [
                                // "{arguments}.0.note",
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
            piano: {
                type: "lpiano.sisiliano",
                container: "#preview"
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
                    gradeNames: ["fluid.modelComponent"],
                    model: {
                        scoreboard: "{scorer}.model.scoreboard",
                        staves: [{
                            width: 400,
                            xPos:  10,
                            yPos:  40,
                            clef: "treble",
                            // notes: []
                            notes: "{scoreboard}.model.scoreboard.notes"
                        }]
                    },
                    modelListener: {
                        "scoreboard.notes": {
                            funcName:      "{that}.render",
                            args:          [],
                            excludeSource: "init"
                        }
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