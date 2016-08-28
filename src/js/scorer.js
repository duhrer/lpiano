/*

    Compare the current list of notes played to the expected list and prepare a report.

 */
// TODO: Eventually, we should allow for "missed" notes, so that A-B-rest-D would only miss one note when compared to A-B-C-D.
/* eslint-env node */
var fluid = require("infusion");
var lpiano = fluid.registerNamespace("lpiano");

fluid.registerNamespace("lpiano.scorer");

lpiano.scorer.updateScore = function (that) {
    var scores = [];
    for (var a = 0; a < expectedNotes.length; a++) {
        var expectedNote = that.expectedNotes[a];
        var playedNote = that.model.playedNotes[a];

        if (playedNote) {
            // TODO:  Describe a note (duration, pitch, volume) and come up with a comparison similar to jqUnit.assertLeftHand
        }
        else {
            break;
        }
    }
};

fluid.defaults("lpiano.scorer", {
    gradeNames: ["fluid.component"],
    members: {
        expectedNotes: []
    },
    model: {
        playedNotes: []
    },
    modelListeners: {
        playedNotes: {
            funcName: "lpiano.scorer.updateScore",
            args:     ["{that}"]
        }
    }
});