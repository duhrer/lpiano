(function(){
    "use strict";
    
    fluid.defaults("fluid.tests.lpiano.vexflow.stave.multi", {
        height: 750,
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-stave-multi-container",
        staveOptions: {
            width: 400,
            xPos:  10,
            yPos:  10,
            clef: ["treble", "default", "8va"],
            timeSignature: "4/4",
            notes: [{
                duration: "q",
                keys: ["f/3"]
            }]
        }
    });
})();
