# Reading Progress Bar - Plugin Documentation

## Overview

The Reading Progress Bar plugin adds a customizable progress indicator to WordPress posts, showing readers how far through an article they've scrolled. The plugin is built with React using the WordPress components and data stores.

## Project Structure

```
reading-progress-bar/
├── index.php                          # Main plugin file (PHP entry point)
├── package.json                       # NPM dependencies and build scripts
├── src/
│   ├── index.js                       # React app entry point
│   ├── index.scss                     # Global styles
│   ├── components/
│   │   ├── index.js                   # Component exports
│   │   ├── settings-page.jsx          # Main settings UI component
│   │   ├── exclude-post-types.js      # Configuration for hidden post types
│   │   └── notices.jsx                # Notification display component
│   └── hooks/
│       ├── index.js                   # Hook exports
│       ├── use-settings.js            # (alias) Settings management hook
│       └── save-settings.js           # Settings state management logic
├── build/                             # Compiled output (auto-generated)
│   ├── index.js                       # Bundled React app
│   ├── index.css                      # Compiled styles
│   └── index.asset.php                # Script/style dependencies
├── composer.json                      # PHP dependencies (if any)
└── README.md                   # This file
```

## File Documentation

### PHP (Backend)

#### `index.php` - Main Plugin File

**Responsibilities:**

-   Registers the plugin with WordPress
-   Creates admin settings page
-   Enqueues React bundle and compiled styles
-   Registers REST API settings endpoint

**Key Methods:**

-   `__construct()` - Initializes plugin hooks
-   `reading_progress_bar_settings_page()` - Registers admin menu
-   `reading_progress_bar_settings_page_html()` - Renders HTML container for React
-   `reading_progress_bar_settings_page_enqueue_style_script()` - Loads assets
-   `reading_progress_bar_settings()` - Registers REST API setting with schema

**Settings Structure:**

```php
'reading_progress_bar' => [
    'posttype' => 'post',      // Target post type for progress bar
    'color'    => '#000'       // Progress bar color
]
```

### JavaScript/React (Frontend)

#### `src/index.js` - App Entry Point

**Responsibilities:**

-   Imports styles
-   Waits for DOM to be ready
-   Creates React root and renders SettingsPage component

#### `src/components/settings-page.jsx` - Main UI Component

**Components:**

-   `SettingsTitle` - Displays page heading
-   `PostTypesRadio` - Fetches and formats post types for selection
-   `SaveButton` - Primary action button
-   `SettingsPage` - Main container orchestrating all sub-components

**Features:**

-   Radio control for selecting target post type
-   Color palette for choosing progress bar color
-   Notice display for user feedback
-   Panel-based layout using WordPress components

#### `src/components/exclude-post-types.js`

**Purpose:** Configuration for WordPress post types to exclude from selection

**Excluded Types:**

-   System post types (attachments, templates, blocks)
-   Navigation menu items
-   Font families and faces

#### `src/components/notices.jsx`

**Purpose:** Display WordPress admin notices (success, error, warning)

**Features:**

-   Integrates with WordPress notices store
-   Auto-removes notices via NoticeList component
-   Returns null if no notices to display

#### `src/hooks/use-settings.js` and `src/hooks/save-settings.js`

**Purpose:** Custom React hook for settings state management

**Functionality:**

-   Fetches settings from REST API on component mount
-   Manages local state for selected post type and color
-   Handles saving settings back to database
-   Shows success notice after save

**Returns:**

```javascript
{
    selectedPostType, // Current selection
        setSelectedPostType, // Update selection
        color, // Current color
        setColor, // Update color
        saveSettings; // Save to database
}
```

## Data Flow

```
┌─────────────────────────────────┐
│   WordPress Settings REST API   │
│  (/wp/v2/settings)              │
└──────────────┬──────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  SettingsPage.jsx    │
    │  (Main Component)    │
    └──────────┬───────────┘
               │
        ┌──────┴──────┬────────────┬──────────┐
        │             │            │          │
        ▼             ▼            ▼          ▼
    Title      PostTypes      Color      Save
    Display    Radio          Palette    Button
                │                        │
                └────────┬───────────────┘
                         │
                   useSettings Hook
                   (State Management)
                         │
                    API Requests
```

## Settings Management

### Initial Load

1. Component mounts (SettingsPage)
2. useEffect hook triggers immediately
3. REST API call fetches current settings
4. Local state updated with fetched values

### Saving Settings

1. User clicks Save button
2. `saveSettings()` function executes
3. POST request sent to `/wp/v2/settings`
4. Success notice displayed
5. Settings persisted in WordPress database

## WordPress Integration

### REST API

-   **Endpoint:** `/wp/v2/settings`
-   **Method:** `GET` / `POST`
-   **Schema:**
    ```php
    'reading_progress_bar' => [
        'posttype' => ['type' => 'string'],
        'color'    => ['type' => 'string']
    ]
    ```

### WordPress Data Stores

-   **Core Data Store:** Get available post types
-   **Notices Store:** Display user feedback

### WordPress Components Used

-   `RadioControl` - Post type selection
-   `ColorPalette` - Color picker
-   `Button` - Actions
-   `Panel/PanelBody/PanelRow` - Layout
-   `NoticeList` - Notifications
-   `Heading` - Typography

## Build Process

### Scripts

```bash
npm run build      # Compile React/SCSS for production
npm run start      # Watch mode for development
npm run format     # Format code
npm run lint:js    # Lint JavaScript
```

### Output

-   **Compiled JS:** `build/index.js`
-   **Compiled CSS:** `build/index.css`
-   **Asset Manifest:** `build/index.asset.php`
    -   Lists dependencies (jQuery, React libraries, etc.)
    -   Specifies version hash

## Development Workflow

1. **Edit Source Files**

    - Modify components in `src/components/`
    - Update hooks in `src/hooks/`
    - Adjust styles in `src/index.scss`

2. **Build**

    ```bash
    npm run build
    ```

3. **Test in WordPress**

    - Navigate to Settings > Reading Progress Bar
    - Verify UI renders correctly
    - Test saving and retrieving settings

4. **Deploy**
    - Ensure `build/` directory is committed
    - PHP automatically loads from `build/` directory

## Configuration

### Customizing Excluded Post Types

Edit `src/components/exclude-post-types.js`:

```javascript
export const excludePosts = [
    "your_custom_post_type", // Add here
    // ... other types
];
```

Then rebuild:

```bash
npm run build
```

## Common Patterns

### Adding New Settings

1. Update REST API schema in `index.php`
2. Add state variable in `use-settings.js`
3. Add UI control in `settings-page.jsx`
4. Update save payload

### Adding New Component

1. Create file in `src/components/`
2. Export from `src/components/index.js`
3. Import and use in `settings-page.jsx`

### Displaying User Feedback

```javascript
const { createSuccessNotice } = useDispatch(noticesStore);
createSuccessNotice(__("Your message", "reading-progress-bar"));
```

## Troubleshooting

### Settings Not Loading

-   Check browser console for API errors
-   Verify REST API endpoint is accessible
-   Confirm setting is registered in `reading_progress_bar_settings()`

### Styles Not Applied

-   Run `npm run build`
-   Clear browser cache
-   Check that `wp_enqueue_style()` includes CSS file

### React Errors

-   Check browser console for component errors
-   Verify all imports are correct
-   Ensure WordPress packages are installed

## Version History

-   **1.0.0** - Initial release
    -   Post type selection
    -   Color customization
    -   REST API integration

## Dependencies

### PHP

-   WordPress 6.8+
-   PHP 8.0+

### JavaScript

-   @wordpress/element
-   @wordpress/data
-   @wordpress/components
-   @wordpress/i18n
-   @wordpress/dom-ready
-   @wordpress/api-fetch
-   @wordpress/core-data
-   @wordpress/block-editor

### Development

-   @wordpress/scripts
-   @wordpress/env

## Contribution Guidelines

When modifying code:

1. Maintain JSDoc/PHPDoc comments
2. Follow WordPress coding standards
3. Use WordPress components consistently
4. Test all settings operations
5. Update this documentation if adding features
