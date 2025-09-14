# Toastle

A lightweight, vanilla JavaScript toast notification library with zero dependencies.

## Features

- **Zero dependencies** - Pure vanilla JavaScript
- **Multiple types** - Success, error, info, and warning toasts
- **Auto-stacking** - Multiple toasts stack vertically with smooth animations
- **Customizable** - Configurable duration, position, and styling
- **Small footprint** - Minimal CSS and JavaScript

## Installation

```sh
npm install toastle
```

## Usage

### Basic Usage

```javascript
const Toastle = require('toastle');

// Simple success toast.
Toastle({ text: 'Operation completed successfully!' });

// Error toast with custom duration.
Toastle({
  text: 'Something went wrong!',
  type: 'error',
  duration: 5000
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | string | `''` | Toast message content |
| `type` | string | `'success'` | Toast type: `success`, `error`, `info`, `warning` |
| `duration` | number | `3000` | Display duration in milliseconds |
| `top` | number | `40` | Top position offset in pixels |

### Toast Types

- `success` - Green background for positive actions
- `error` - Red background for errors and failures
- `info` - Blue background for informational messages
- `warning` - Orange background for warnings

### CSS Integration

Include the provided CSS file in your project:

```html
<link rel="stylesheet" href="node_modules/toastle/style.css">
```

## License

MIT © [Nilambar Sharma](https://github.com/ernilambar)
