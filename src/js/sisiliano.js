/* globals fluid */
(function () {
    "use strict";
    fluid.defaults("fluid.lpiano.sisiliano", {
        gradeNames: ["sisiliano.piano"],
        model: {
            color: "#FF0000",
            styles: {
                keyBoard: {
                    padding: {
                        top: 20,
                        bottom: 20,
                        left: 20,
                        right: 20
                    },
                    whiteKey: {
                        width: 40,
                        height: 150
                    },
                    blackKey: {
                        width: 27,
                        height: 100
                    }
                }
            },
            keyBoard: {
                keys: [],
                length: 20,
                start:  0,
                activeArea: {
                    start: 0,
                    end: 10
                }
            }
        }
    });
})();
