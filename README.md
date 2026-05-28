# whatchar

**whatchar** is a VS Code extension that shows character information at the cursor position.

## Features

Whenever you move the cursor in the editor, the status bar (bottom right) displays the following information about the character under the cursor:

- **Unicode code point** (e.g. `U+3042`)
- **Decimal value** (e.g. `Dec: 12354`)
- **CP932 (Shift_JIS) byte sequence** (e.g. `CP932: 82A0`)

**Status bar display examples:**

| Character | Status bar |
|-----------|-----------|
| Printable (`あ`) | `"あ" (U+3042, Dec: 12354, CP932: 82A0)` |
| Non-printable | `(U+000A, Dec: 10, CP932: 0A)` |
| CP932 unmappable (`😀`) | `"😀" (U+1F600, Dec: 128512, CP932: (unmappable))` |

You can also run the **`Show what character`** command (`whatchar.show`) to display the same information as a popup notification.

This extension is useful for identifying characters that look similar, such as full-width vs. half-width characters, or detecting invisible control characters in text.

## Commands

| Command | Description |
|---------|-------------|
| `whatchar.show` | Show character info for the character at the cursor as a notification |

## Extension Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `whatchar.showOnCursorMove` | boolean | `true` | Show character info in the status bar whenever the cursor moves. Set to `false` to disable the automatic status bar update. |

## Release Notes

### 0.0.1

Initial release.
