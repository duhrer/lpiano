/*

    Compare the current list of notes played to options.expectedNotes and prepare a report.

    options.expectedNotes is expected to be an array of vexflow notations, as in:

    [ "A1", ["C1", "E1"] ]

 */
// TODO: Eventually, we should allow for "missed" notes, so that A-B-rest-D would only miss one note when compared to A-B-C-D.
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var lpiano = fluid.registerNamespace("lpiano");

fluid.registerNamespace("lpiano.scorer");

lpiano.scorer.noteInNoteGroup = function (note, noteGroup) {
    var matches = false;

    if (note) {
        // The incoming note is a MIDI note/pitch.  We must convert it to a vexflow key, ala C/1, D#/2.
        var vexflowKey = lpiano.transforms.pitchToVexflowKey(note);

        fluid.each(fluid.makeArray(noteGroup.keys), function (expectedKey) {
            if (!matches && (expectedKey.toLowerCase() === vexflowKey.toLowerCase())) {
                matches = true;
            }
        });
    }

    return matches;
};

/**
 *
 * Mute "bad" notes as needed.
 *
 */
lpiano.scorer.muteBadNotes = function (synth, note, velocity) {
    // if (synth.model.correctNotes.length && synth.model.correctNotes.length < synth.options.expectedNotes.length) {
    if (synth.model.correctNotes.length < synth.options.expectedNotes.length) {
        // TODO:  setting this directly to length results in incorrectly rejecting the second of two matching notes.
        // TODO:  We still have a problem, in that both the current and the next note always count.
        // var expectedNoteGroup = synth.options.expectedNotes[synth.model.correctNotes.length - 1];
        var expectedNoteGroup = synth.options.expectedNotes[synth.model.correctNotes.length];
        var noteInNoteGroup = lpiano.scorer.noteInNoteGroup(note, expectedNoteGroup);
        if (!noteInNoteGroup) {  velocity = 5; }
    }

    synth.events.noteOn.fire(note, { "freq.note": note, "amp.velocity": velocity});
};

// Confirm whether two strings or arrays of strings match deeply
lpiano.scorer.deepMatch = function (candidate1, candidate2) {
    var array1 = fluid.makeArray(candidate1);
    var array2 = fluid.makeArray(candidate2);

    if (array1.length !== array2.length) {
        return false;
    }

    for (var a = 0; a < array1.length; a++) {
        if (array1[a].toLowerCase() !== array2[a].toLowerCase()) {
            return false;
        }
    }

    return true;
};

/*
    Go from a transcript of MIDI notes and pitches to vexFlow stave notation, such that [24, 26] becomes:

    [
        {
            keys: ["c/0"]
        },
        {
            keys: ["d/0"]
        }
    ]

    Does not currently make any attempt to detect the timing and assign a length to notes.

 */
lpiano.scorer.notesToVexflow = function (groupedNotes) {
    return fluid.transform(groupedNotes, function (singleNoteOrChord) {
        var keys = fluid.transform(fluid.makeArray(singleNoteOrChord), function (note) {
            return lpiano.transforms.pitchToVexflowKey(note["note"]);
        });
        return { duration: "q", keys: keys };
    });
};

lpiano.scorer.scoreNotes = function (transcribedNotes, expectedNotes) {
    // Go through expected notes and tick off any we've matched, skipping errors (for now).
    var correctNotes = [];
    fluid.each(transcribedNotes, function (playedVexflowGroup) {
        if (correctNotes.length < expectedNotes.length) {
            var nextExpectedNoteGroup = expectedNotes[correctNotes.length];
            if (lpiano.scorer.deepMatch(playedVexflowGroup.keys, nextExpectedNoteGroup.keys)) {
                correctNotes.push(playedVexflowGroup);
            }
        }
        // TODO: Make some kind of event for when the song is completed successfully.
    });

    return correctNotes;
};

// Score the transcript and update correctNotes whenever the transcriber updates the 'notes'...
lpiano.scorer.groupTransformAndScore = function (that) {

    // Group the raw transcript so that we can match chords.
    var groupedTranscript = lpiano.transcriber.groupNotes(that);
    var vexflowTranscript = lpiano.scorer.notesToVexflow(groupedTranscript);

    that.applier.change("correctNotes", lpiano.scorer.scoreNotes(vexflowTranscript, that.options.expectedNotes));
};

/**
 *
 * A function that generates a single annotated "scoreboard" set of notes based on:
 *
 * 1. The notes that have been played correctly.
 * 2. The overall set of expected notes.
 *
 * From that, it generates a set of notes that consists of:
 *
 * 1. Any notes that have been played correctly, highlighted in one color.
 * 2. The note(s) that should be played next, highlighted in another.
 * 3. The notes remaining to be played, highlighted in a third color.
 *
 * @param that
 */
lpiano.scorer.generateScoreboard = function (that) {
    var annotatedNotes = [];

    if (that.model.correctNotes) {
        var annotatedCorrectNotes = fluid.transform(that.options.expectedNotes.slice(0, that.model.correctNotes.length), function (note) {
            note.keyStyle = that.options.styles.played;
            return note;
        });

        annotatedNotes = annotatedNotes.concat(annotatedCorrectNotes);
    }

    if (annotatedNotes.length < that.options.expectedNotes.length) {
        var annotatedCurrentNote = fluid.copy(that.options.expectedNotes[annotatedNotes.length]);

        annotatedCurrentNote.keyStyle = that.options.styles.current;

        annotatedNotes.push(annotatedCurrentNote);
    }

    if ((that.options.expectedNotes.length - annotatedNotes.length) > 0) {
        var annotatedUnplayedNotes = fluid.transform(that.options.expectedNotes.slice(annotatedNotes.length), function (note) {
            note.keyStyle = that.options.styles.unplayed;
            return note;
        });

        annotatedNotes = annotatedNotes.concat(annotatedUnplayedNotes);
    }

    that.applier.change("scoreboard.notes", annotatedNotes);
};

fluid.defaults("lpiano.scorer.synth", {
    gradeNames: ["lpiano.synth"],
    model: {
        midiNotes:    [],
        correctNotes: [],
        scoreboard: {
            notes: "{that}.options.expectedNotes"
        }
    },
    expectedNotes:     [],
    styles: {
        played:   { shadowBlur:15, shadowColor:"black", fillStyle:"black" },
        current:  { shadowBlur:15, shadowColor:"red",   fillStyle:"red"   },
        unplayed: { shadowBlur:15, shadowColor:"grey",  fillStyle:"grey"  },
    },
    modelListeners: {
        "midiNotes": {
            funcName:      "lpiano.scorer.groupTransformAndScore",
            args:          ["{that}"],
            excludeSource: "init"
        },
        "correctNotes": {
            funcName:      "lpiano.scorer.generateScoreboard",
            args:          ["{that}"]
        }
    }
});

fluid.defaults("lpiano.scorer.harness", {
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
                        funcName: "lpiano.scorer.muteBadNotes",
                        priority: "before:startRecordingNote",
                        args:     ["{synth}", "{arguments}.0.note", "{arguments}.0.velocity"]
                    },
                    "noteOff.passToSynth": "{synth}.noteOff({arguments}.0.note)"
                }
            }
        },
        synth: {
            type: "lpiano.scorer.synth",
            options: {
                model: {
                    midiNotes: "{midiConnector}.model.midiNotes"
                }
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
