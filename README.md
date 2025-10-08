# Script Injector Chrome Extension

A Chrome extension for injecting custom JavaScript into web pages with script management and **automatic URL pattern matching**.

## Features

### ✨ Two Modes of Operation

1. **Manual Injection Tab**: Quickly write and inject JavaScript into the current page
2. **Saved Scripts Tab**: Manage a library of reusable scripts with automatic URL matching

### 🔧 CRUD Operations

- **Create**: Add new scripts with custom names, code, and URL patterns
- **Read**: View all saved scripts in an organized list
- **Update**: Edit existing scripts
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

### Creating an Auto-Injecting Script

1. Click the extension icon
2. Go to the "Saved Scripts" tab
3. Click "+ New Script"
4. Fill in:
   - **Script Name**: A descriptive name for your script
   - **URL Pattern**: Regex pattern to match URLs (scripts with patterns will auto-inject!)
   - **JavaScript Code**: Your JavaScript code
5. Click "Save"

### Running Scripts

- **Automatic**: Scripts with URL patterns inject automatically when you visit matching pages
- **Manual**: Switch to "Saved Scripts" tab and click the "▶ Run" button on any script
- **From Manual Tab**: Write code directly and click "Inject Script"

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
- Matched scripts are highlighted with a green badge in the popup
- Check the browser console for injection logs
