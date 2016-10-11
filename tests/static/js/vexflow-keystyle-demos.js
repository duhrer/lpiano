(function(){
    "use strict";
    
    fluid.defaults("fluid.tests.lpiano.vexflow.keystyle.key", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-keystyle-key-container",
        model: {
            notes: [{
                duration: "q",
                keys: [{ key: "b/4", keyStyle: {shadowBlur:15, shadowColor:"blue", fillStyle:"blue"}}]
            }]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.keystyle.note", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-keystyle-note-container",
        model: {
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
        model: {
            notes: [{
                duration: "q",
                keyStyle: {shadowBlur:15, shadowColor:"blue", fillStyle:"blue"},
                keys: ["b/4", "d/4", { key: "f/5", keyStyle: { shadowColor: "red", fillStyle: "red"}}]
            }]
        }
    });
})();
