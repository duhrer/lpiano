(function () {
    "use strict";
    fluid.defaults("fluid.tests.lpiano.vexflow", {
        gradeNames: ["lpiano.vexflow"],
        listeners: {
            "onCreate.render": {
                func: "{that}.render"
            }
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.demo", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        // Arbitrary notes that closely mirror the work I did in my first tests of VexFlow: https://jsfiddle.net/18whg1he/3/
        model: {
            notes: [
                {
                    duration: "q", // All keys have this duration by default
                    keys: [
                        { key: "g/4", keyStyle: {shadowBlur:15, shadowColor:'blue', fillStyle:'blue'} }
                    ]
                },
                {
                    duration: "8",
                    dots: 1,
                    keys: [{
                        key: "e##/5",
                        accidentals: "##"
                    }]
                },
                {
                    duration: "16",
                    keys: [{
                        key: "b/4",
                        accidentals: "b"
                    }]
                },
                {
                    duration: "8",
                    keys: "c/4"
                },
                {
                    duration: "16",
                    keys: "d/4"
                },
                {
                    duration: "16",
                    keys: [{
                        key: "e/4",
                        accidentals: "b"
                    }]
                },
                {
                    duration: "16",
                    keys: "d/4"
                },
                {
                    duration: "16",
                    keys: "e/4",
                    accidentals: "#"
                },
                {
                    duration: "32",
                    keys: "g/4"
                },
                {
                    duration: "32",
                    keys: "a/4"
                },
                {
                    duration: "16",
                    keys: "g/4"
                },
                {
                    duration: "q",
                    keys: "d/4"
                }
            ]
        }
    })
})();