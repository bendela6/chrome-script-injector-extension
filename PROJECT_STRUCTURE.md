# Project Structure

```
src/
├── assets/              # Static assets (icons, images)
├── components/          # Shared React components
│   ├── Button.tsx       # Reusable button component
│   ├── Modal.tsx        # Modal dialog component
│   ├── StatCard.tsx     # Statistics card component
│   └── index.ts         # Components barrel export
├── popup/               # Popup page (extension icon click)
│   ├── index.html       # Popup HTML entry
│   ├── main.tsx         # Popup React entry point
│   └── Popup.tsx        # Main popup component
├── options/             # Options/settings page
│   ├── index.html       # Options HTML entry
│   ├── main.tsx         # Options React entry point
│   ├── Options.tsx      # Main options component
│   └── Options.css      # Legacy CSS (can be removed)
├── utils/               # Utility functions
│   ├── scriptInjection.ts  # Script injection utilities
│   └── storage.ts       # Chrome storage utilities
├── background.ts        # Background service worker
├── index.css           # Global Tailwind CSS
├── manifest.json       # Extension manifest
└── types.ts            # TypeScript type definitions
```

## Key Improvements

1. **Modular Structure**: Popup and options are now in separate directories
2. **Shared Components**: Common UI components in `components/` directory
3. **Utilities**: Reusable logic extracted to `utils/` directory
4. **Better Organization**: Related files grouped together
5. **Scalability**: Easy to add new features or pages

