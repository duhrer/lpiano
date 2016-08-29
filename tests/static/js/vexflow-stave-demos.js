(function(){
    "use strict";
    
    fluid.defaults("fluid.tests.lpiano.vexflow.stave.multi", {
        height: 750,
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-stave-multi-container",
        staves: [
            // {
            //     width: 400,
            //     xPos:  10,
            //     yPos:  40,
            //     clef: "treble",
            //     timeSignature: "4/4",
            //     notes: [{
            //         duration: "q",
            //         keys: ["c/4", "c/5"]
            //     }]
            // },
            {
                width: 400,
                xPos:  10,
                yPos:  100,
                clef: "bass",
                timeSignature: "4/4",
                notes: [{
                    duration: "q",
                    keys: ["f/3"]
                }]
            }
        ]
    });
})();
