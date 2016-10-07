/*

    Compare the current list of notes played to options.expectedNotes and prepare a report.

    options.expectedNotes is expected to be an array of vexflow notations, as in:

    [ "A1", ["C1", "E1"] ]

 */
// TODO: Eventually, we should allow for "missed" notes, so that A-B-rest-D would only miss one note when compared to A-B-C-D.
/* eslint-env node */
var fluid = require("infusion");
var lpiano = fluid.registerNamespace("lpiano");

// Marker grade for "good" synth
fluid.defaults("lpiano.scorer.synths.good", {
    gradeNames: ["lpiano.synth"]
});

// "bad" synth, which sounds, well, bad....
fluid.defaults("lpiano.scorer.synths.bad", {
    gradeNames: ["lpiano.synth"],
    mainUgen: "flock.ugen.sawOsc" // TODO:  Make this very dull and as wooden as possible.
});


fluid.registerNamespace("lpiano.scorer");

/**
 *
 * Route a noteOn or noteOff to a different set of synths depending on whether it's "good" or "bad".
 *
 * @param that
 * @param fnName
 * @param args
 */
lpiano.scorer.routeNote = function (that, fnName, args) {
    var expectedNote = fluid.makeArray(that.options.expectedNotes[that.playedNotes.length]);

    var destGrade = expectedNote.indexOf(args[0].note) !== -1 ? that.options.goodSynthGrade : that.options.badSynthGrade;
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
        if (array1[a] !== array2[a]) {
            return false;
        }
    }

    return true;
};

// Score the transcript and update playedNotes whenever the transcriber updates the 'notes'...
lpiano.scorer.scoreNotes = function (that) {
    var playedNotes = [];

    // Group the raw transcript so that we can match chords.
    var groupedTranscript = lpiano.transcriber.groupNotes(that);

    // Go through expected notes and tick off any we've matched, skipping errors.
    fluid.each(groupedTranscript, function (playedNoteGroup) {
        var playedVexflowGroup = fluid.transform(playedNoteGroup, lpiano.transforms.pitchToVexFlow);
        for (var a = playedNotes.length; a < that.options.expectedNotes.length; a++ ) {
            var nextExpectedNoteGroup = that.options.expectedNotes[a];
            if (lpiano.scorer.deepMatch(playedVexflowGroup, nextExpectedNoteGroup)) {
                playedNotes.push(playedVexflowGroup);
            }
        }
    });

    that.playedNotes = playedNotes;
};


fluid.defaults("lpiano.scorer", {
    gradeNames: ["flock.band", "lpiano.transcriber"],
    members: {
        playedNotes: [],
    },
    expectedNotes: [],
    invokers: {
        noteOn: {
            funcName: "lpiano.scorer.routeNote",
            args: ["{that}", "noteOn", "{arguments}"]
        },
        noteOff: {
            funcName: "lpiano.scorer.routeNote",
            args: ["{that}", "noteOff", "{arguments}"]
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
        "notes": {
            funcName:      "lpiano.scorer.scoreNotes",
            args:          ["{that}"],
            excludeSource: "init"
        }
    }
});

// TODO:  Write the test harness and page for this and test manually