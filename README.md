# Script Injector Chrome Extension

A Chrome extension for injecting custom JavaScript into web pages with script management and **automatic URL pattern matching**. Built with **React** and **TypeScript**.

## 🛠️ Tech Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Chrome Extension Manifest V3** - Latest extension API

## 📁 Project Structure

```
chrome-extension/
├── src/
│   ├── Popup.tsx          # Popup React component
│   ├── Options.tsx        # Options page React component
│   ├── Options.css        # Styles for options page
│   ├── popup-main.tsx     # Popup entry point
│   ├── options-main.tsx   # Options entry point
│   ├── background.ts      # Background service worker
│   ├── types.ts           # TypeScript type definitions
│   ├── manifest.json      # Extension manifest
│   ├── icon.png          # Extension icon
│   ├── popup.html        # Popup HTML shell
│   └── options.html      # Options HTML shell
├── dist/                 # Built extension (load this in Chrome)
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Features

### ✨ Two Interfaces

1. **Popup (Quick Actions)**: Click the extension icon for quick script injection and stats
2. **Management Page (Full CRUD)**: Separate full-page interface for creating, editing, and managing all your scripts

### 🔧 CRUD Operations

All script management is done on a **separate dedicated page** with a beautiful full-page interface:

- **Create**: Add new scripts with custom names, code, and URL patterns
- **Read**: View all saved scripts in a beautiful grid layout with search
- **Update**: Edit existing scripts with a full-screen modal
- **Delete**: Remove scripts you no longer need

### 🎯 Automatic URL Pattern Matching

**Scripts with URL patterns automatically inject on page load!**

Each script can have a regex pattern to match specific URLs:
- `.*github\.com.*` - Auto-injects on any GitHub page
- `https://example\.com/.*` - Auto-injects on all pages on example.com
- `.*youtube\.com/watch.*` - Auto-injects on YouTube video pages
- Leave empty for manual execution only

**When you visit a matching page, the script runs automatically on page load!**

Scripts that match the current URL are highlighted with a green "AUTO-INJECTED" badge.

## 🚀 Development

### Prerequisites

- Node.js 16+ and npm
- Chrome browser

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

### Build the Extension

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle React components with Vite
- Generate optimized production files in the `dist/` folder

### Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project

### Development Mode

For development with hot reload:

```bash
npm run dev
```

Then load the extension from the `dist` folder. You'll need to reload the extension manually in Chrome after changes.

## 📝 Usage

### Quick Injection (Popup)

1. Click the extension icon in your toolbar
2. Type or paste JavaScript code in the text area
3. Click "▶ Inject Script Now"
4. The popup shows stats:
   - Total Scripts saved
   - Auto-Inject scripts active on current page

### Managing Scripts (Full Page)

1. Click the extension icon
2. Click "⚙️ Manage All Scripts" button
3. This opens a **full-page interface** where you can:
   - See all your scripts in a beautiful grid layout
   - Search scripts by name or URL pattern
   - View statistics (total scripts, auto-inject count, matched on current page)
   - Create, edit, or delete scripts

**Or right-click the extension icon → "Options"**

### Creating a Script

1. Open the Management Page
2. Click "➕ New Script"
3. Fill in:
   - **Script Name**: A descriptive name for your script
   - **URL Pattern**: Regex pattern to match URLs (scripts with patterns will auto-inject!)
   - **JavaScript Code**: Your JavaScript code (large textarea)
4. Click "💾 Save Script"

### Running Scripts

- **Automatic**: Scripts with URL patterns inject automatically when you visit matching pages
- **Manual from Management Page**: Click the "▶ Run" button on any script card
- **Quick Injection from Popup**: Use the popup for one-off code injections

### Example Scripts

**Alert on GitHub (Auto-Injects):**
- Name: `GitHub Alert`
- Pattern: `.*github\.com.*`
- Code: `alert('Welcome to GitHub!');`
- ✅ Runs automatically on every GitHub page!

**Change Background Color (Manual Only):**
- Name: `Red Background`
- Pattern: (leave empty)
- Code: `document.body.style.backgroundColor = 'red';`
- Click "▶ Run" to execute

**Console Log on YouTube Videos:**
- Name: `YouTube Logger`
- Pattern: `.*youtube\.com/watch.*`
- Code: `console.log('Watching:', document.title);`
- ✅ Runs automatically on every YouTube video page!

## 🔧 Modifying the Extension

### Adding New Features to Popup

Edit `src/Popup.tsx` - it's a React component with TypeScript.

### Adding New Features to Options Page

Edit `src/Options.tsx` and `src/Options.css`.

### Modifying Background Logic

Edit `src/background.ts` - handles automatic script injection on page load.

### Type Definitions

All TypeScript types are defined in `src/types.ts`.

After making changes, run:
```bash
npm run build
```

Then reload the extension in Chrome.

## 📦 Building for Production

```bash
npm run build
```

The built extension will be in the `dist/` folder. You can:
- Zip the `dist` folder to distribute
- Submit to Chrome Web Store
- Share with others to load as an unpacked extension

## Permissions

- `activeTab`: Access to the current tab
- `scripting`: Ability to inject scripts
- `storage`: Save your scripts across sessions
- `tabs`: Monitor page loads for auto-injection
- `<all_urls>`: Auto-inject on matching pages

## Notes

- Scripts are saved using Chrome's sync storage and sync across your Chrome browsers
- URL patterns use JavaScript regex syntax
- Scripts execute in the main page context (not isolated)
- **Scripts with URL patterns auto-inject on page load** - the first thing when a page loads!
- Matched scripts are highlighted with a green badge in both popup and management page
- Check the browser console for injection logs
- The management page is a full separate page, not a cramped popup!

## 🐛 Troubleshooting

**Extension not loading?**
- Make sure you built the project: `npm run build`
- Load the `dist` folder, not the root folder
- Check Chrome DevTools console for errors

**Changes not showing?**
- Rebuild: `npm run build`
- Reload the extension in `chrome://extensions/`
- Close and reopen the popup/options page

**TypeScript errors?**
- Run `npm run build` to see compilation errors
- Check `tsconfig.json` settings
- Ensure all type definitions are correct
