/* globals fluid */
(function () {
    "use strict";

    fluid.registerNamespace("lpiano.sisiliano");

    lpiano.sisiliano.applyOffset = function (originalValue, offset) {
        return originalValue + offset;
    };

    fluid.defaults("lpiano.sisiliano", {
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
        },
        offset: 48,
        invokers: {
            applyOffset: {
                funcName: "lpiano.sisiliano.applyOffset",
                args: ["{arguments}.0", "{that}.options.offset"]
            }
        },
        listeners: {
            "onKeyPress.passToMidiConnector": {
                func: "{midiConnector}.events.noteOn.fire",
                args: [{ "note": "@expand:{that}.applyOffset({arguments}.0)", "velocity": "{arguments}.1"}]
            },
            "onKeyRelease.passToMidiConnector": {
                func: "{midiConnector}.events.noteOff.fire",
                args: [{ "note": "@expand:{that}.applyOffset({arguments}.0)"}]
            }
        }
    });
})();
