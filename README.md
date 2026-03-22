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
import Toastle from 'toastle';

// Simple success toast.
Toastle({ text: 'Operation completed successfully!' });

// Error toast with custom duration.
Toastle({
  text: 'Something went wrong!',
  type: 'error',
  duration: 5000
});
```

On the server or anywhere `document` / `document.body` is missing, `Toastle` does nothing (no throw), so SSR and headless tests can import it safely. Call it from the browser when the DOM is ready.

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

### CSS

With a bundler, import the stylesheet from your app entry or a component:

```javascript
import 'toastle/style.css'
```

## License

MIT © [Nilambar Sharma](https://github.com/ernilambar)
