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

    fluid.lpiano.sisiliano.applyOffset = function (originalValue, offset) {
        return originalValue + offset;
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
            piano: {
                type: "fluid.lpiano.sisiliano",
                container: "#preview",
                options: {
                    offset: 48,
                    invokers: {
                        applyOffset: {
                            funcName: "fluid.lpiano.sisiliano.applyOffset",
                            args: ["{arguments}.0", "{that}.options.offset"]
                        }
                    },
                    listeners: {
                        "onKeyPress.passToMidiConnector": {
                            func: "{midiConnector}.events.noteOn.fire",
                            args: [{ "note": "@expand:{that}.applyOffset({arguments}.0)", "velocity": "{arguments}.1"}]
                        },
                        "onKeyRelease.passToMidiConnector": {
                            func: "{midiConnector}.events.noteOff.fire",
                            args: [{ "note": "@expand:{that}.applyOffset({arguments}.0)"}]
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
