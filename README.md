# Script Injector Chrome Extension

A Chrome extension for injecting custom JavaScript into web pages with script management and URL pattern matching.

## Features

### ✨ Two Modes of Operation

1. **Manual Injection Tab**: Quickly write and inject JavaScript into the current page
2. **Saved Scripts Tab**: Manage a library of reusable scripts with automatic URL matching

### 🔧 CRUD Operations

- **Create**: Add new scripts with custom names, code, and URL patterns
- **Read**: View all saved scripts in an organized list
- **Update**: Edit existing scripts
- **Delete**: Remove scripts you no longer need

### 🎯 URL Pattern Matching

Each script can have a regex pattern to match specific URLs:
- `.*github\.com.*` - Matches any GitHub page
- `https://example\.com/.*` - Matches all pages on example.com
- `.*youtube\.com/watch.*` - Matches YouTube video pages
- Leave empty to allow manual execution on any page

## How to Use

### Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `src` folder of this extension

### Creating a Script

1. Click the extension icon
2. Go to the "Saved Scripts" tab
3. Click "+ New Script"
4. Fill in:
   - **Script Name**: A descriptive name for your script
   - **URL Pattern**: Regex pattern to match URLs (optional)
   - **JavaScript Code**: Your JavaScript code
5. Click "Save"

### Running Scripts

- **Manual**: Switch to "Saved Scripts" tab and click the "▶ Run" button on any script
- **From Manual Tab**: Write code directly and click "Inject Script"

### Example Scripts

**Alert on GitHub:**
- Name: `GitHub Alert`
- Pattern: `.*github\.com.*`
- Code: `alert('Welcome to GitHub!');`

**Change Background Color:**
- Name: `Red Background`
- Pattern: (leave empty)
- Code: `document.body.style.backgroundColor = 'red';`

**Log Page Title:**
- Name: `Log Title`
- Pattern: (leave empty)
- Code: `console.log('Page title:', document.title);`

## Permissions

- `activeTab`: Access to the current tab
- `scripting`: Ability to inject scripts
- `storage`: Save your scripts across sessions

## Notes

- Scripts are saved using Chrome's sync storage
- URL patterns use JavaScript regex syntax
- Scripts execute in the main page context (not isolated)

