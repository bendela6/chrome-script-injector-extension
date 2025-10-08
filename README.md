# Script Injector Chrome Extension

A Chrome extension for injecting custom JavaScript into web pages with script management and **automatic URL pattern matching**.

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

## How to Use

### Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `src` folder of this extension

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
   - **JavaScript Code**: Your JavaScript code (large textarea with syntax highlighting)
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

## Interface Overview

### Popup (Extension Icon)
- **Quick Injection**: Textarea for fast code injection
- **Stats Dashboard**: See total scripts and active auto-injections
- **Current Page**: Shows the URL of the active tab
- **Manage Scripts Button**: Opens the full management page

### Management Page (Options)
- **Stats Cards**: Total scripts, auto-inject scripts, active on current page
- **Search Bar**: Find scripts quickly by name or URL pattern
- **Scripts Grid**: Beautiful card layout showing all your scripts
  - Each card shows: name, URL pattern, code preview, and action buttons
  - Matched scripts have a green border and "AUTO-INJECTED" badge
- **Modal Editor**: Full-screen editor for creating/editing scripts with large textarea

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
