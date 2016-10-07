/*

    Display the notes played on a MIDI controller onscreen using VexFlow.

 */
/*global fluid */

(function () {
    "use strict";

    fluid.registerNamespace("lpiano.transcriber");

    lpiano.transcriber.startRecordingNote = function (that, midiNote) {
        var notes = fluid.copy(that.model.notes);
        var note = fluid.copy(midiNote);
        note.start = Date.now();
        notes.push(note);
        that.applier.change("notes", notes);
    };

    lpiano.transcriber.stopRecordingNote = function (that, midiNote) {
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

    fluid.defaults("lpiano.transcriber", {
        gradeNames: ["fluid.component"],
        lastNotesToDisplay: 8,
        groupingCutoff: 25, // ms
        model: {
            notes: []
        },
        listeners: {
            "noteOn.startRecordingNote": {
                funcName: "lpiano.transcriber.startRecordingNote",
                args:     ["{that}" ,"{arguments}.0"]
            },
            "noteOn.stopRecordingNote": {
                funcName: "lpiano.transcriber.stopRecordingNote",
                args:     ["{that}" ,"{arguments}.0"]
            }
        }
    });

    fluid.registerNamespace("lpiano.transcriber.staves");

    /**
     *
     * Sort the notes in a chord in ascending order by pitch.
     *
     * @param a {number} the "left" pitch
     * @param b {number} the "right" pitch
     * @returns {number} returns -1 if the "left" is lower, 0 if the pitches are equal, and 1 if the "left" pitch is higher.
     */
    lpiano.transcriber.staves.sortByPitch = function (a, b) {
        if (a === b) {
            return 0;
        }
        else {
            return a < b ? -1 : 1;
        }
    };

    /*

        Group the notes of a transcript into "chords" by combining any that occur within options.groupingCutoff ms of
        each other.

     */
    lpiano.transcriber.groupNotes = function (that) {
        var groupedNotes = [];
        var lastStarted;
        var currentGroup = [];

        // Group by time first
        fluid.each(that.model.notes, function (midiNote) {
            var cutoff = that.options.groupingCutoff || 0;
            if (lastStarted && ((midiNote.start - lastStarted) > cutoff)) {
                groupedNotes.push(currentGroup);
                currentGroup = [];
            }

            currentGroup.push(midiNote);
            lastStarted = midiNote.start;
        });
        groupedNotes.push(currentGroup);

        return groupedNotes;
    };

    // TODO: Provide two instances, one of which display plays the full score, broken up into bars
    // TODO:  For now, we only write to a single treble stave.  Eventually, add support for separate treble and bass staves.
    // TODO: We are creating some kind of feedback loop.  Look into it.

    // TODO: The main instance should only display the last few bars.
    lpiano.transcriber.staves.notesToStaves = function (that) {
        var groupedNotes = lpiano.transcriber.groupNotes(that);

        var staff = that.staves[0];
        staff.notes = fluid.transform(groupedNotes.slice(-1 * that.options.lastNotesToDisplay), function (midiNoteGroup) {
            var keys = fluid.transform(midiNoteGroup.sort(lpiano.transcriber.sortByPitch), function (midiNote) {
                var vexFlowNote = lpiano.transforms.pitchToVexFlow(midiNote.note);
                var key = { key: vexFlowNote };
                if (vexFlowNote.indexOf("#") !== -1) {
                    key.accidentals = "#"
                }
                else if (vexFlowNote.indexOf("b") > 0) {
                    key.accidentals = "b"
                }

                return key;
            });

            return {
                duration: "q",
                keys: keys
            };
        });

        that.render();
    };

    fluid.defaults("lpiano.transcriber.staves", {
        gradeNames: ["lpiano.vexflow", "fluid.modelComponent"],
        lastNotesToDisplay: 24,
        groupingCutoff: 50, // ms
        members: {
            staves: [{
                // TODO: Figure out how to make this wider
                width: 700,
                xPos:  10,
                yPos:  40,
                clef: "treble",
                // timeSignature: "4/4",
                notes: []
            }]
        },
        listeners: {
            "onCreate.render": {
                func: "{that}.render"
            }
        },
        modelListeners: {
            "notes": {
                funcName:      "lpiano.transcriber.staves.notesToStaves",
                args:          ["{that}"],
                excludeSource: "init"
            }
        }
    });
})();
