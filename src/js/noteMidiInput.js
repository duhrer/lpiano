/*

    Listens for MIDI input and records those notes in a way we can use with VexFlow.  Records the pitch, start time,
    and eventual end time, as in:

    {
        note: 60, // pitch, in this case middle C
        start: 1234
        end:   2234
    }

    Adapted from the MIDI demo included with Flocking: https://github.com/colinbdclark/Flocking

 */
/*global fluid, flock*/

(function () {
    "use strict";

    var environment = flock.init();

    fluid.registerNamespace("fluid.lpiano.noteMidiInput");

    fluid.lpiano.noteMidiInput.startRecordingNote = function (that, midiNote) {
        var notes = fluid.copy(that.model.notes);
        var note = fluid.copy(midiNote);
        note.start = Date.now();
        notes.push(note);
        that.applier.change("notes", notes);
    };

    fluid.lpiano.noteMidiInput.stopRecordingNote = function (that, midiNote) {
        var notes = fluid.copy(that.model.notes);
        var foundNote = false;
        fluid.each(notes, function (note) {
            if (foundNote) { return; }
            if (note.note === midiNote.note && note.end === undefined) {
                note.end = (new Date()).getTime();
                note.ms  = note.end - note.start;
                foundNote = true;
            }
        });
        that.applier.change("notes", notes);
    };

    fluid.defaults("fluid.lpiano.noteMidiInput", {
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
                        notes: "{noteMidiInput}.model.notes"
                    },
                    listeners: {
                        "noteOn.startRecordingNote": {
                            funcName: "fluid.lpiano.noteMidiInput.startRecordingNote",
                            args:     ["{that}" ,"{arguments}.0"]
                        },
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
                        "noteOn.stopRecordingNote": {
                            funcName: "fluid.lpiano.noteMidiInput.stopRecordingNote",
                            args:     ["{that}" ,"{arguments}.0"]
                        },
                        "noteOff.passToSynth": "{synth}.noteOff({arguments}.0.note)",
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

    fluid.defaults("fluid.lpiano.synth", {
        gradeNames: ["flock.synth.polyphonic"],

        synthDef: {
            ugen: "flock.ugen.square",
            freq: {
                id: "freq",
                ugen: "flock.ugen.midiFreq",
                note: 60
            },
            mul: {
                id: "env",
                ugen: "flock.ugen.envGen",
                envelope: {
                    type: "flock.envelope.adsr",
                    attack: 0.2,
                    decay: 0.1,
                    sustain: 1.0,
                    release: 1.0
                },
                gate: 0.0,
                mul: {
                    id: "amp",
                    ugen: "flock.ugen.midiAmp",
                    velocity: 0
                }
            }
        }
    });

})();
