/*

    A Fluid component wrapper around VexFlow:  https://github.com/0xfe/vexflow

    Collapses VexFlow's concepts into a single JSON configuration block that can be used to describe:
    
    1. The renderer that will draw the notes (controls size and other aspects).
    2. The context in which the notes are to be drawn (global colors and styles, etc.)  Provided by the renderer, adjusted with configuration options.
    3. The stave on which the notes are to be drawn.
    4. The notes themselves.
    5. The keys within each "note".

    TODO:  We need a separate tool to allow us to compare notes hit across both staves.
*/
/* globals fluid, Vex */
(function () {
    "use strict";
    var VF = Vex.Flow;
    fluid.registerNamespace("lpiano.vexflow");

    lpiano.vexflow.renderStave = function (that, staveDef) {
        var context = that.renderer.getContext();
        var stave = lpiano.vexflow.buildStave(that, staveDef);

        stave.setContext(context).draw();

        var notes = fluid.copy(staveDef.notes);
        staveDef.notes = [];

        fluid.each(notes, function (note) {
            note.setContext(context).setStave(stave);
            var tickContext = new VF.TickContext();
            tickContext.addTickable(note).preFormat();
            /*
             note.draw();
             */

        });

        // TODO:  Test support for beam annotation
        var beams = VF.Beam.generateBeams(staveDef.notes);
        Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
        beams.forEach(function (b) { b.setContext(context).draw() });
    };

    lpiano.vexflow.buildStave = function (that, staveDef) {
        var stave = new VF.Stave(staveDef.xPos, staveDef.yPos, staveDef.width);
        fluid.each(that.options.staveFunctionMapping, function (fnName, propertyKey) {
            if (staveDef[propertyKey]) {
                var fnArgs = fluid.makeArray(staveDef[propertyKey]);
                stave[fnName].apply(stave, fnArgs);
            }
        });

        return stave;
    };

    lpiano.vexflow.configureContext = function (that) {
        var context = that.renderer.getContext();
        fluid.each(that.options.contextFunctionMapping, function (fnName, propKey) {
            var fnArgs = fluid.makeArray(that.options.contextOptions[propKey]);
            context[fnName].apply(context, fnArgs);
        });
    };

    lpiano.vexflow.buildKeys = function (that, noteDef) {
        var keys = [];
        var keyDefs = fluid.makeArray(noteDef.keys);
        fluid.each(keyDefs, function (keyDef) {
            var key = typeof keyDef === "string" ? keyDef : keyDef.key;
            keys.push(key);
        });
        return keys;
    };

    lpiano.vexflow.getKeyCustomizations = function (noteDef) {
        return fluid.transform(noteDef.keys, function (value) {
            return value || {};
        });
    };

    lpiano.vexflow.buildAnnotation = function (that, annotationDef) {
        var isString = typeof annotationDef === "string";
        var annotationText = isString ? annotationDef : annotationDef.text;
        var annotation = new VF.Annotation(annotationText);

        if (!isString) {
            fluid.each(that.options.annotationFunctionMapping, function (fnName, propertyKey) {
                if (annotationDef[propertyKey]) {
                    var fnArgs = fluid.makeArray(annotationDef[propertyKey]);
                    annotation[fnName].apply(annotation, fnArgs);
                }
            });
        }

        return annotation;
    };

    lpiano.vexflow.buildNote = function (that, noteDef) {
        var note_struct = { keys: lpiano.vexflow.buildKeys(that, noteDef), duration: noteDef.duration };
        var note = new VF.StaveNote(note_struct);

        // Apply top-level functions to all keys
        fluid.each(that.options.noteFunctionMapping, function (fnName, propKey) {
            if (noteDef[propKey]) {
                for (var index = 0; index < fluid.makeArray(noteDef.keys).length; index++) {
                    note[fnName](index, noteDef[propKey]);
                }
            }
        });

        // Dot support for all keys in a single note
        if (noteDef.dots) {
            for (var a = 0; a < noteDef.dots; a++) {
                note.addDotToAll();
            }
        }

        // Annotation support for notes, pinned to the first note by default.
        if (noteDef.annotations) {
            fluid.each(fluid.makeArray(noteDef.annotations), function (annotationDef) {
                note.addModifier(0, lpiano.vexflow.buildAnnotation(that, annotationDef));
            });
        }

        // Apply functions to individual keys
        var keyOverrides = lpiano.vexflow.getKeyCustomizations(noteDef);
        fluid.each(keyOverrides, function (keyDef, index) {
            fluid.each(that.options.noteFunctionMapping, function (fnName, propKey) {
                if (keyDef[propKey]) {
                    note[fnName](index, keyDef[propKey]);
                }
            });

            fluid.each(fluid.makeArray(keyDef.accidentals), function (accidental){
                note.addAccidental(index, new VF.Accidental(accidental));
            });

            // Dot support for individual keys in a note.
            if (keyDef.dots) {
                for (var a = 0; a < keyDef.dots; a++) {
                    note.addDot(index);
                }
            }

            if (keyDef.annotations) {
                fluid.each(fluid.makeArray(keyDef.annotations), function (annotationDef) {
                    note.addModifier(index, lpiano.vexflow.buildAnnotation(that, annotationDef));
                });
            }
        });

        return note;
    };

    lpiano.vexflow.timeSignatureToBeats = function (timeSignatureString) {
        return parseInt(timeSignatureString.substring(0,1), 10);
    };

    // Convert our model notes into one or more staves.
    lpiano.vexflow.notesToStaves = function (that) {
        // Get the time signature
        var beatsPerBar = lpiano.vexflow.timeSignatureToBeats(that.options.staveOptions.timeSignature);

        // convert to ticks, 3/4 time is 4096 * 3 ticks, see https://github.com/0xfe/vexflow/blob/master/src/tables.js#L506
        var ticksPerBar = beatsPerBar * 4096;
        var barsPerStave = Math.round(that.options.ticksPerStave / ticksPerBar);

        var staveNotes = [];
        var currentStaveNotes = [];
        staveNotes.push(currentStaveNotes);

        // Break down the notes into staves by the number of ticks, and into bars as well.
        var staveTicks = 0;
        var barTicks   = 0;
        fluid.each(that.model.notes, function (note) {
            if (note.duration) {
                var noteTicks = VF.durationToTicks(note.duration);

                if ((staveTicks + noteTicks) > that.options.ticksPerStave) {
                    currentStaveNotes = [];
                    staveNotes.push(currentStaveNotes);
                    staveTicks = 0;
                    barTicks   = 0;

                }
                else if ((barTicks + noteTicks) > ticksPerBar) {
                    currentStaveNotes.push(new VF.BarNote(VF.Barline.SINGLE));
                    barTicks = 0;
                }

                staveTicks += noteTicks;
                barTicks   += noteTicks;
            }
            currentStaveNotes.push(lpiano.vexflow.buildNote(that, note));
        });

        // Generate the final staves.
        var generatedStaves = [];
        for (var stave = 0; stave < staveNotes.length; stave++) {
            var currentStaveOptions = fluid.copy(that.options.staveOptions);
            currentStaveOptions.yPos += 100 * stave;
            currentStaveOptions.notes = staveNotes[stave];

            if (stave > 0) {
                // We can't do this part because vexflow apparently only supports "8va" and "8vb"
                // var baseClef = fluid.makeArray(that.options.staveOptions.clef)[0];
                // currentStaveOptions.clef = [baseClef, "default", (barsPerStave * stave) + "va"]

                currentStaveOptions.timeSignature = undefined;
            }

            generatedStaves.push(currentStaveOptions);
        }

        return generatedStaves;
    };

    lpiano.vexflow.render = function (that) {
        var targetElement = document.querySelector(that.options.selector);
        targetElement.innerHTML = "";

        that.renderer = new VF.Renderer(targetElement, that.options.rendererOptions.backend);
        that.resize(that.options.rendererOptions.width, that.options.rendererOptions.height);

        fluid.each(lpiano.vexflow.notesToStaves(that), function (staveDef){
            lpiano.vexflow.renderStave(that, staveDef);
        });
    };

    lpiano.vexflow.resize = function (that, width, height) {
        that.renderer.resize(width, height);
    };

    fluid.defaults("lpiano.vexflow", {
        gradeNames: ["fluid.modelComponent"],
        selector:   ".vexflow-container",
        ticksPerStave: 65536, // 4 whole notes per stave
        rendererOptions: {
            backend: VF.Renderer.Backends.SVG,
            height: 384,
            width:  800
        },
        contextFunctionMapping: {
            "font": "setFont",
            "backgroundFillStyle": "setBackGroundFillStyle"
        },
        contextOptions: {
            font: ["Arial", 10, ""],
            backgroundFillStyle: "#eed"
        },
        staveOptions:             {
            width: 768,
            xPos:  10,
            yPos:  10,
            clef: "treble",
            timeSignature: "4/4"
        },
        staveFunctionMapping: {
            clef: "addClef",
            timeSignature: "addTimeSignature"
        },
        noteFunctionMapping: {
            keyStyle: "setKeyStyle",
            modifiers: "addModifier"
        },
        annotationFunctionMapping: {
            font: "setFont", // family, size, weight
            justification: "setJustification", // A value in `Annotation.Justify`.
            verticalJustification: "setVerticalJustification" // A value in `Annotation.VerticalJustify`.
        },
        model: {
            notes: []
        },
        invokers: {
            render: {
                funcName: "lpiano.vexflow.render",
                args:     ["{that}"]
            },
            resize: {
                funcName: "lpiano.vexflow.resize",
                args:     ["{that}", "{arguments}.0", "{arguments}.1"]
            }
        },
        listeners: {
            "onCreate.render": {
                func: "{that}.render"
            }
        },
        modelListeners: {
            "notes": {
                func: "{that}.render",
                excludeSource: "init"
            }
        }
    })

})();
