# Reading Progress Bar

A WordPress plugin that displays a progress bar showing reading progress on your website.

## What It Does

This plugin adds a progress bar to your website pages. As visitors scroll through your content, the progress bar moves to show how much of the page they have read.

## Minimum Requirements

-   WordPress 6.8 or later
-   PHP 8.0 or later

## Installation

1. Download or clone this plugin
2. Upload to your WordPress plugins folder
3. Run composer install to get dependencies
4. Activate the plugin in WordPress admin

## Development

To work on this plugin:

```
npm install     - Install dependencies
npm start       - Start development mode
npm run build   - Build for production
npm run format  - Format code
npm run lint:js - Check JavaScript code
```

## How to Use

Once activated, the plugin adds an admin page where you can configure which post types should display the reading progress bar.

## File Structure

-   `src/` - React and JavaScript source code
-   `build/` - Compiled assets (CSS and JS)
-   `index.php` - Main plugin file
-   `components/` - React components for settings
-   `hooks/` - Custom WordPress hooks

## Plugin Details

-   Author: Pradeep Kumar
-   GitHub: https://github.com/pradeepvegeta/reading-progress-bar-react
-   License: GPL v2 or later
