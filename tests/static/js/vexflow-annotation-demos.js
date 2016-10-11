(function(){
    "use strict";
    
    fluid.defaults("fluid.tests.lpiano.vexflow.annotation.fontSize", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-annotation-fontsize-container",
        model: {
            notes: [
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "6", font: ["Arial", "6"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "8", font: ["Arial", "8"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "10", font: ["Arial", "10"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "12", font: ["Arial", "12"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "14", font: ["Arial", "14"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "16", font: ["Arial", "16"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "18", font: ["Arial", "18"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "20", font: ["Arial", "20"]} }]
                }
            ]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.annotation.fontFamily", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-annotation-fontfamily-container",
        model: {
            notes: [
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "serif", font: ["serif", "12"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "sans serif", font: ["sans-serif", "12"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "Arial", font: ["Arial", "12"]} }]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "Times", font: ["Times", "12"]} }]
                }
            ]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.annotation.justify", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-annotation-justify-container",
        model: {
            notes: [
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "LEFT", justification: Vex.Flow.Annotation.Justify.LEFT}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "CENTER", justification: Vex.Flow.Annotation.Justify.CENTER}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "RIGHT", justification: Vex.Flow.Annotation.Justify.RIGHT}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "CENTER_STEM", justification: Vex.Flow.Annotation.Justify.CENTER_STEM}}]
                }
            ]
        }
    });

    fluid.defaults("fluid.tests.lpiano.vexflow.annotation.verticalJustify", {
        gradeNames: ["fluid.tests.lpiano.vexflow"],
        selector:   ".vexflow-annotation-verticaljustify-container",
        model: {
            notes: [
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "TOP", verticalJustification: Vex.Flow.Annotation.VerticalJustify.TOP}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "CENTER", verticalJustification: Vex.Flow.Annotation.VerticalJustify.CENTER}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "BOTTOM", verticalJustification: Vex.Flow.Annotation.VerticalJustify.BOTTOM}}]
                },
                {
                    duration: "q",
                    keys: [{ key: "g/4", annotations: { text: "CENTER_STEM", verticalJustification: Vex.Flow.Annotation.VerticalJustify.CENTER_STEM}}]
                }
            ]
        }
    });
    
})();
