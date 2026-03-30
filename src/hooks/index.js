/**
 * Custom Hooks Exports
 *
 * Central export point for all custom React hooks used in the plugin.
 * Import from this index rather than from individual hook files so that
 * internal file moves do not require changes at call sites.
 *
 * Exported hooks:
 *  - processSettings : manages all settings state and REST API communication.
 *                      Source: save-settings.js
 *
 * @since 1.0.0
 */

// `processSettings` is the active hook. The legacy `use-settings.js` file is
// kept for reference only and is NOT re-exported here.
export { default as processSettings } from './save-settings';