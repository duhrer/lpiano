/*

    Display the notes played on a MIDI controller onscreen using VexFlow.

 */
/*global fluid */

(function () {
    "use strict";

    fluid.registerNamespace("fluid.lpiano.transcriber");

    /*
     If compareFunction(a, b) is less than 0, sort a to a lower index than b, i.e. a comes first.
     If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behaviour, and thus not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
     If compareFunction(a, b) is greater than 0, sort b to a lower index than a.
     */

    fluid.lpiano.transcriber.sortByPitch = function (a, b) {
        if (a === b) {
            return 0;
        }
        else {
            return a < b ? -1 : 1;
        }
    };

    fluid.lpiano.transcriber.notesToStaves = function (that) {
        // TODO: Provide two instances, one of which display plays the full score, broken up into bars
        // TODO:  For now, we only write to a single treble stave.  Eventually, add support for separate treble and bass staves.
        // TODO: We are creating some kind of feedback loop.  Look into it.

        // TODO: The main instance should only display the last few bars.

        var staff = that.model.staves[0];

        var groupedNotes = [];
        var lastStarted;
        var currentGroup = [];

        // Group by time first
        fluid.each(that.model.notes, function (midiNote) {
            if (lastStarted && ((midiNote.start - lastStarted) > that.options.groupingCutoff)) {
                groupedNotes.push(currentGroup);
                currentGroup = [];
            }

            currentGroup.push(midiNote);
            lastStarted = midiNote.start;
        });
        groupedNotes.push(currentGroup);

        staff.notes = fluid.transform(groupedNotes.slice(-1 * that.options.lastNotesToDisplay), function (midiNoteGroup) {
            var keys = fluid.transform(midiNoteGroup.sort(fluid.lpiano.transcriber.sortByPitch), function (midiNote) {
                var vexFlowNote = fluid.lpiano.transforms.pitchToVexFlow(midiNote.note);
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

        that.lastNotes.options.staves[0] = staff;
        that.lastNotes.render();
    };

    fluid.defaults("fluid.lpiano.transcriber", {
        gradeNames: ["fluid.lpiano.noteMidiInput"],
        vexflowContainer: ".vexflow-container",
        lastNotesToDisplay: 8,
        groupingCutoff: 25, // ms
        model: {
            staves: [{
                // TODO: Figure out how to make this wider
                width: 400,
                xPos:  10,
                yPos:  40,
                clef: "treble",
                // timeSignature: "4/4",
                notes: []
            }]
        },
        components: {
            lastNotes: {
                type: "fluid.lpiano.vexflow",
                options: {
                    container: "{transcriber}.options.vexflowContainer",
                    staves: "{transcriber}.model.staves",
                    listeners: {
                        "onCreate.render": {
                            func: "{that}.render"
                        }
                    }
                }
            }
            // TODO: Create another vexflow instance that displays all notes with as many clefs as are necessary.
        },
        modelListeners: {
            "notes": {
                funcName:      "fluid.lpiano.transcriber.notesToStaves",
                args:          ["{that}"],
                excludeSource: "init"
            }
        }
    });
})();
