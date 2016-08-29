# `fluid.lpiano.vexflow`

This component wraps the [VexFlow](https://github.com/0xfe/vexflow) library, which we use to generate an onscreen
representation of musical notes in staff notation.  This component allows you to represent complex music using only
JSON, as illustrated below.

## Component Options

| Option                  | Type              | Description |
| ----------------------- | ----------------- | ----------- |
| contextOptions          | `{Object}`        | The options for the context, including things like the font and colors to use for all output. See below for more details. |
| rendererOptions         | `{Object}`        | The options for the renderer.  See below for more details. |
| rendererOptions.height  | `{String|Number}` | The overall height of our output. |
| rendererOptions.width   | `{String|Number}` | The overall width of our output. |
| rendererOptions.backend | `{String}`        | The backend to use when rendering our output.  Defaults to "svg".  Also supports "canvas", "raphael", and "vml". |
| selector (required)     | `{String}`        | A CSS selector that points to the the DOM element where the component's output will be renderered |
| staves                  | `{Object}`        | The staves to display, including any notes to be displayed.  See below for details. |

### Context Options

The context controls the overall appearance of all staves and notes.  Here is an example of a context configured to
use a particular font and font size, and to use a custom fill style.

```
contextOptions: {
    font: ["Arial", 10, ""],
    backgroundFillStyle: "#eed"
}
```

For a full list of supported options, review [the source code of the canvas context](https://github.com/0xfe/vexflow/blob/master/src/canvascontext.js).

### Defining Staves

A stave is the set of lines on which we will draw our notes.  It has its own properties, including the width, x and y
position, the clef ([see the source code for supported options](https://github.com/0xfe/vexflow/blob/master/src/clef.js#L22)), and the time signature.

Here is a single staff definition with no notes:

```
staves: {
    width: 400,
    xPos:  10,
    yPos:  40,
    clef: "treble",
    timeSignature: "4/4",
    notes: []
}
```

Note that `staves` can also be an array, for example if you wish to display both a treble and bass clef:

```
staves: [
    {
        width: 400,
        xPos:  10,
        yPos:  40,
        clef: "treble",
        timeSignature: "4/4",
        notes: []
    },
    {
        width: 400,
        xPos:  10,
        yPos:  240,
        clef: "bass",
        timeSignature: "4/4",
        notes: []
    }
]
```

### Defining individual notes

In VexFlow, a "note" is a container for a single horizontal position on the stave.  It contains one or more individual
key (or rest) definitions, and can have its own properties.  Individual keys are described using the note and the octave.
Middle C is represented as `c/4`.

The full notation makes it possible to customize the properties of the note itself, as well as the properties of
individual keys.  Where possible, we support a "short" notation.  For example, here is a single note in full notation:


```
{
    duration: "16",
    keys: [{
        key: "g/4"
    }],
}
```

The same note could be represented in "short" notation as:

```
{
    duration: "16",
    keys: "g/4"
}
```

Here is a chord represented using full notation:

```
{
    duration: "16",
    keys: [
        { key: "c/4" },
        { key: "e/4" },
        { key: "g/4" }
    ]
}
```


The same chord could be represented in "short" notation as:

```
{
    duration: "16",
    keys: ["c/4", "e/4", "g/4"]
}
```

Note that the full notation only gives you the ability to set modifiers and annotations for all keys in a note.
However, you can mix long and short notations, as in the following example:

```
{
    duration: "16",
    keys: ["c/4", "e/4", { key: "g/4", dots: 1 }]
}
```

### Key Styles

```
{
    duration: "q", // All keys have this duration by default
    keys: [
        { key: "g/4", keyStyle: {shadowBlur:15, shadowColor:'blue', fillStyle:'blue'} }
    ]
},
```

### Modifiers

Both notes and keys support "modifiers", which change the appearance of a note or key.  Annotations and Accidentals (see
below) are both types of modifier.  If you need to add another type of modifier, you can also directly pass modifiers
that you have constructed yourself, as in the following example:

```
{
    duration: "16",
    keys: [
        {
            key: "b/5",
            modifiers: {
                new Vex.Flow.Accidental("b")
            }
        }
    ],
}
```

For a full list of supported modifiers, see [the VexFlow documentation](https://github.com/0xfe/vexflow/).


### Annotations

Annotations are a special kind of modifier, and are represented using a separate `annotations` options, as in the
following example:

```
{
    duration: "16",
    keys: [
        {
            annotations: "key",
            key: "g/4"
        }
    ],
},
{
    duration: "16",
    annotations: { text: "note" },
    keys: "g/4"
}
```

Note that the first instance uses "short" notation.  The full notation (second instance) allows you to control the
horizontal and vertical position of the text.  For examples, see the tests in this package.

### Dots

Notes and keys may be presented with 1, 2, or 3 "[dots](https://en.wikipedia.org/wiki/Dotted_note)" to precisely
indicate their timing.  Here are a few examples:

```
{
    duration: "16",
    keys: [
        {
            key: "g/4",
            dots: 1
        }
    ],
},
{
    duration: "16",
    dots: 1,
    keys: "g/4"
}
```

### Accidentals

https://en.wikipedia.org/wiki/Accidental_(music)

{
    duration: "16",
    keys: [{
        key: "b/4",
        accidentals: "b"
    }]
},


## Component Invokers

# `{that}.render()`
* Returns: Nothing.

Render the current `options.staves` into the DOM element refered to by `options.selector`, using our context and
renderer options.

# `{that}.resize(width, height)`
* `width {String|Number}` The overall width of the renderer's output.
* `height {String|Number}` The overall height of the renderer's output.
* Returns: Nothing.

Resize the current renderer.  You must call `render()` before the changes will be visible.