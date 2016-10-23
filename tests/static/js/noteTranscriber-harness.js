(function () {
    /*

        A test harness for the "transcriber" that records all notes and displays them using vexflow.

     */

    var environment = flock.init();

    fluid.defaults("lpiano.tests.transcriber.harness", {
        gradeNames: ["lpiano.harness"],
        components: {
            piano: {
                type: "lpiano.sisiliano",
                container: "#preview"
            },
            staves: {
                type: "lpiano.transcriber.staves",
                options: {
                    container: ".vexflow-container",
                    model: {
                        midiNotes: "{transcriber}.model.midiNotes"
                    }
                }
            }
        }
    });
})();