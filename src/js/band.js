/*

    A "band" of instruments that is configured to send all noteOn and noteOff information to all of its band members.

 */
(function () {
    fluid.registerNamespace("lpiano.band");

    lpiano.band.sendToComponentsWithGrade = function (that, fnName, gradeName, args) {
        var synths = fluid.queryIoCSelector(that, gradeName);
        fluid.each(synths, function (synth) {
            synth[fnName].apply(synth, args);
        });
    };

    fluid.defaults("lpiano.band", {
        gradeNames: ["flock.band"],
        invokers: {
            noteOn: {
                funcName: "lpiano.band.sendToComponentsWithGrade",
                args: ["{that}", "noteOn", "flock.synth.group", "{arguments}"]
            },
            noteOff: {
                funcName: "lpiano.band.sendToComponentsWithGrade",
                args: ["{that}", "noteOff", "flock.synth.group", "{arguments}"]
            }
        }
    });
})();
