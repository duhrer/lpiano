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

// Marker grade for "good" synth
fluid.defaults("lpiano.scorer.synths.good", {
    gradeNames: ["lpiano.synth"]
});

// "bad" synth, which sounds, well, bad....
fluid.defaults("lpiano.scorer.synths.bad", {
    gradeNames: ["lpiano.synth"],
    mainUgen: "flock.ugen.sawOsc",
    synthDef: {
        mul: {
            velocity: 10
        }
    }
});

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
 * Route a noteOn or noteOff to a different set of synths depending on whether it's "good" or "bad".
 *
 * @param that
 * @param fnName
 * @param args
 */
lpiano.scorer.routeFnCallToSynth = function (that, fnName, args) {
    var destGrade = that.options.goodSynthGrade;

    // TODO: Refactor this.  The first "good" note does not play, and the second note seems to echo.
    if (fnName !== "noteOff" && (that.options.expectedNotes.length > that.model.correctNotes.length)) {
        var expectedNoteGroup = that.options.expectedNotes[that.model.correctNotes.length];
        var notePitch = args[0]["freq.note"] || args[0];
        var noteInNoteGroup = lpiano.scorer.noteInNoteGroup(notePitch, expectedNoteGroup);
        if (!noteInNoteGroup) {
            destGrade = that.options.badSynthGrade;
        }
    }

    lpiano.band.sendToComponentsWithGrade(that, fnName, destGrade, args);
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
            return lpiano.transforms.pitchToVexflowKey(note["freq.note"]);
        });
        return { duration: "q", keys: keys };
    });
};

lpiano.scorer.scoreNotes = function (transcribedNotes, expectedNotes) {
    // Go through expected notes and tick off any we've matched, skipping errors (for now).
    var correctNotes = [];
    fluid.each(transcribedNotes, function (playedVexflowGroup) {
        // TODO: Make some kind of event for when the song is completed successfully.
        var nextExpectedNoteGroup = expectedNotes[correctNotes.length];
        if (lpiano.scorer.deepMatch(playedVexflowGroup.keys, nextExpectedNoteGroup.keys)) {
            correctNotes.push(playedVexflowGroup);
        }
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
            note.keyStyle = that.options.playedStyles;
            return note;
        });

        annotatedNotes = annotatedNotes.concat(annotatedCorrectNotes);
    }

    if (annotatedNotes.length < that.options.expectedNotes.length) {
        var annotatedCurrentNote = fluid.copy(that.options.expectedNotes[annotatedNotes.length]);

        annotatedCurrentNote.keyStyle = that.options.currentNoteStyles;

        annotatedNotes = annotatedNotes.concat(annotatedCurrentNote);
    }

    if ((that.options.expectedNotes.length - annotatedNotes.length) > 0) {
        var annotatedUnplayedNotes = fluid.transform(that.options.expectedNotes.slice(annotatedNotes.length), function (note) {
            note.keyStyle = that.options.unplayedStyles;
            return note;
        });

        annotatedNotes = annotatedNotes.concat(annotatedUnplayedNotes);
    }

    that.applier.change("scoreboard.notes", annotatedNotes);
};



fluid.defaults("lpiano.scorer", {
    gradeNames: ["flock.band", "flock.noteTarget", "lpiano.transcriber"],
    model: {
        correctNotes: [],
        scoreboard: {
            notes: "{that}.options.expectedNotes"
        }
    },
    expectedNotes:     [],
    playedStyles:      { shadowBlur:15, shadowColor:"black", fillStyle:"black" },
    currentNoteStyles: { shadowBlur:15, shadowColor:"red", fillStyle:"red" },
    unplayedStyles:    { shadowBlur:15, shadowColor:"grey", fillStyle:"grey" },
    goodSynthGrade:    "lpiano.scorer.synths.good",
    badSynthGrade:     "lpiano.scorer.synths.bad",
    invokers: {
        noteOn: {
            funcName: "lpiano.scorer.routeFnCallToSynth",
            args: ["{that}", "noteOn", "{arguments}"]
        },
        noteOff: {
            funcName: "lpiano.scorer.routeFnCallToSynth",
            args: ["{that}", "noteOff", "{arguments}"]
        },
        set: {
            funcName: "lpiano.scorer.routeFnCallToSynth",
            args: ["{that}", "set", "{arguments}"]
        }
    },
    listeners: {
        "noteOn.routeToSynth": {
            func: "{that}.noteOn"
        },
        "noteOff.routeToSynth": {
            func: "{that}.noteOff"
        }
    },
    components: {
        goodSynth: {
            type: "lpiano.scorer.synths.good"
        },
        badSynth: {
            type: "lpiano.scorer.synths.bad"
        }
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
