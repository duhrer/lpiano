/*

TODO: Convert this into a series of examples explaining what can be configured and how, and the different between short and long notation

// The code example represented in configuration.

{
    rendererOptions: {
        backend: "svg", // Also supports "canvas"
        height: 500,
        width: 500
    },
    contextOptions: {
        font: ["Arial", 10, ""],
        backgroundFillStyle: "#eed"
    },
    staves: {
        width: 400,
        xPos:  10,
        yPos:  40,
        clef: "treble",
        timeSignature: "4/4",
        notes: [
            // Single key example
            {
                keys: [
                    {
                        annotations: "x",
                        duration: "16",
                        key: "g/4",
                        dots: 1,
                        modifiers: {} // Modifiers for just this key.
                    }
                ],
            },
             // The same single key, short notation
             {
                 annotations: [{ text: "Play this!", justification: X, verticalJustification: Y }],
                 duration: "16",
                 dots: 3,
                 modifiers: {}
                 keys: "g/4"
             },
             // Chord example, long notation
            {
                duration:     "16", // All keys have this duration by default
                dots: 2,
                keys: [
                    { key: "c/4" },
                    { key: "e/4" },
                    { key: "g/4" }
                ],
                modifiers: {} // Modifiers to be applied for all keys (applied before individual modifiers).
            },
            // The same chord, short notation
            {
                duration:    "16", // All keys have this duration by default
                dots:        1
                keys:        ["c/4", "e/4", "g/4"],
                modifiers:   {} // Modifiers to be applied for all keys (applied before individual modifiers).
            }
        }
    }
}

*/