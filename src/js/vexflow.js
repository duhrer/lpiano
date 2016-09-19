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
    fluid.registerNamespace("fluid.lpiano.vexflow");

    fluid.lpiano.vexflow.renderStave = function (that, staveDef) {
        var context = that.renderer.getContext();
        var stave = fluid.lpiano.vexflow.buildStave(that, staveDef);

        var notes = [];

        fluid.each(staveDef.notes, function (noteDef) {
            var note = fluid.lpiano.vexflow.buildNote(that, noteDef);
            notes.push(note);
        });
        stave.setContext(context).draw();

        // TODO:  Add support for beam annotation
        var beams = VF.Beam.generateBeams(notes);
        Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
        beams.forEach(function (b) { b.setContext(context).draw() });
    };

    fluid.lpiano.vexflow.buildStave = function (that, staveDef) {
        var stave = new VF.Stave(staveDef.xPos, staveDef.yPos, staveDef.width);
        fluid.each(that.options.staveFunctionMapping, function (fnName, propertyKey) {
            if (staveDef[propertyKey]) {
                var fnArgs = fluid.makeArray(staveDef[propertyKey]);
                stave[fnName].apply(stave, fnArgs);
            }
        });

        return stave;
    };

    fluid.lpiano.vexflow.configureContext = function (that) {
        var context = that.renderer.getContext();
        fluid.each(that.options.contextFunctionMapping, function (fnName, propKey) {
            var fnArgs = fluid.makeArray(that.options.contextOptions[propKey]);
            context[fnName].apply(context, fnArgs);
        });
    };

    fluid.lpiano.vexflow.buildKeys = function (that, noteDef) {
        var keys = [];
        var keyDefs = fluid.makeArray(noteDef.keys);
        fluid.each(keyDefs, function (keyDef) {
            var key = typeof keyDef === "string" ? keyDef : keyDef.key;
            keys.push(key);
        });
        return keys;
    };

    fluid.lpiano.vexflow.getKeyCustomizations = function (noteDef) {
        return fluid.transform(noteDef.keys, function (value) {
            return value || {};
        });
    };

    fluid.lpiano.vexflow.buildAnnotation = function (that, annotationDef) {
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

    fluid.lpiano.vexflow.buildNote = function (that, noteDef) {
        var note_struct = { keys: fluid.lpiano.vexflow.buildKeys(that, noteDef), duration: noteDef.duration };
        var note = new VF.StaveNote(note_struct);

        // Apply top-level functions to all keys
        fluid.each(that.options.noteFunctionMapping, function (fnName, propKey) {
            if (noteDef[propKey]) {
                for (var index = 0; index < noteDef.keys.length; index++) {
                    var fnArgs = [index].concat(fluid.makeArray(noteDef[propKey]));
                    note[fnName].apply(note, fnArgs);
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
                note.addModifier(0, fluid.lpiano.vexflow.buildAnnotation(that, annotationDef));
            });
        }

        // Apply functions to individual keys
        var keyOverrides = fluid.lpiano.vexflow.getKeyCustomizations(noteDef);
        fluid.each(keyOverrides, function (keyDef, index) {
            fluid.each(that.options.noteFunctionMapping, function (fnName, propKey) {
                if (keyDef[propKey]) {
                    var fnArgs = [index].concat(fluid.makeArray(keyDef[propKey]));
                    note[fnName].apply(note, fnArgs);
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
                    note.addModifier(index, fluid.lpiano.vexflow.buildAnnotation(that, annotationDef));
                });
            }
        });

        return note;
    };

    fluid.lpiano.vexflow.render = function (that) {
        var targetElement = document.querySelector(that.options.selector);
        targetElement.innerHTML = "";

        that.renderer = new VF.Renderer(targetElement, that.options.rendererOptions.backend);
        that.resize(that.options.rendererOptions.width, that.options.rendererOptions.height);


        fluid.each(fluid.makeArray(that.options.staves), function (staveDef){
            fluid.lpiano.vexflow.renderStave(that, staveDef);
        });
    };

    fluid.lpiano.vexflow.resize = function (that, width, height) {
        that.renderer.resize(width, height);
    };

    fluid.defaults("fluid.lpiano.vexflow", {
        gradeNames: ["fluid.component"],
        selector:   ".vexflow-container",
        rendererOptions: {
            backend: VF.Renderer.Backends.SVG,
            height: 250,
            width: 500
        },
        contextFunctionMapping: {
            "font": "setFont",
            "backgroundFillStyle": "setBackGroundFillStyle"
        },
        contextOptions: {
            font: ["Arial", 10, ""],
            backgroundFillStyle: "#eed"
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
        staves: [],
        invokers: {
            render: {
                funcName: "fluid.lpiano.vexflow.render",
                args:     ["{that}"]
            },
            resize: {
                funcName: "fluid.lpiano.vexflow.resize",
                args:     ["{that}", "{arguments}.0", "{arguments}.1"]
            }
        }
    })

})();
