(function () {
    /*

        A test harness for the "scorer" that compares the notes played to a standard song.

     */

    var environment = flock.init();

    fluid.defaults("lpiano.tests.scorer.harness", {
        gradeNames: ["lpiano.scorer.harness"],
        components: {
            synth: {
                options: {
                    expectedNotes: lpiano.songs.twinkleTwinkle
                }
            }
        }
    });
})();