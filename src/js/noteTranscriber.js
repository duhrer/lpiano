/*

    Display the notes played on a MIDI controller onscreen using VexFlow.

 */
/*global fluid */

(function () {
    "use strict";

    fluid.registerNamespace("lpiano.transcriber");

    lpiano.transcriber.startRecordingNote = function (that, noteDef) {
        var midiNotes = fluid.copy(that.model.midiNotes);
        var note = fluid.copy(noteDef);
        note.start = Date.now();
        midiNotes.push(note);
        that.applier.change("midiNotes", midiNotes);
    };

    lpiano.transcriber.stopRecordingNote = function (that, noteDef) {
        var midiNotes = fluid.copy(that.model.midiNotes);
        var foundNote = false;
        fluid.each(midiNotes, function (midiNote) {
            if (foundNote) { return; }
            if (midiNote.note === noteDef.note && midiNote.end === undefined) {
                midiNote.end = (new Date()).getTime();
                midiNote.ms  = midiNote.end - midiNote.start;
                foundNote = true;
            }
        });
        that.applier.change("midiNotes", midiNotes);
    };

    fluid.defaults("lpiano.transcriber", {
        gradeNames: ["fluid.modelComponent"],
        lastNotesToDisplay: 8,
        groupingCutoff: 25, // ms
        model: {
            midiNotes: []
        },
        listeners: {
            "noteOn.startRecordingNote": {
                funcName: "lpiano.transcriber.startRecordingNote",
                args:     ["{that}" ,"{arguments}.0"] // noteDef
            },
            "noteOff.stopRecordingNote": {
                funcName: "lpiano.transcriber.stopRecordingNote",
                args:     ["{that}" ,"{arguments}.0"] // noteDef
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
        fluid.each(that.model.midiNotes, function (midiNote) {
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

    lpiano.transcriber.staves.midiNotesToNotes = function (that) {
        var groupedNotes = lpiano.transcriber.groupNotes(that);

        var notes = fluid.transform(groupedNotes.slice(-1 * that.options.lastNotesToDisplay), function (midiNoteGroup) {
            var keys = fluid.transform(midiNoteGroup.sort(lpiano.transcriber.sortByPitch), function (midiNote) {
                var vexFlowNote = lpiano.transforms.pitchToVexflowKey(midiNote.note);
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

        that.applier.change("notes", notes);
    };

    fluid.defaults("lpiano.transcriber.staves", {
        gradeNames: ["lpiano.vexflow"],
        lastNotesToDisplay: 24,
        groupingCutoff: 50, // ms
        model: {
            midiNotes:[]
        },
        modelListeners: {
            "midiNotes": {
                funcName:      "lpiano.transcriber.staves.midiNotesToNotes",
                args:          ["{that}"],
                excludeSource: "init"
            }
        }
    });
})();
