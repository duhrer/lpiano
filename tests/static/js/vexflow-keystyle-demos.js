(function(){
    "use strict";
    
    fluid.defaults("fluid.tests.lpiano.vexflow.keystyle.key", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-keystyle-key-container",
        staves: {
            width: 400,
            xPos:  10,
            yPos:  40,
            clef: "treble",
            timeSignature: "4/4",
            notes: [{
                duration: "q",
                keys: [{ key: "b/4", keyStyle: {shadowBlur:15, shadowColor:"blue", fillStyle:"blue"}}]
            }]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.keystyle.note", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-keystyle-note-container",
        staves: {
            width: 400,
            xPos:  10,
            yPos:  40,
            clef: "treble",
            timeSignature: "4/4",
            notes: [{
                duration: "q",
                keyStyle: {shadowBlur:15, shadowColor:"blue", fillStyle:"blue"},
                keys: ["b/4", "d/4"]
            }]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.keystyle.keyOverride", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-keystyle-keyoverride-container",
        staves: {
            width: 400,
            xPos:  10,
            yPos:  40,
            clef: "treble",
            timeSignature: "4/4",
            notes: [{
                duration: "q",
                keyStyle: {shadowBlur:15, shadowColor:"blue", fillStyle:"blue"},
                keys: ["b/4", "d/4", { key: "f/5", keyStyle: { shadowColor: "red", fillStyle: "red"}}]
            }]
        }
    });
})();
