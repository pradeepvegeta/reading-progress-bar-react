/**
 * Reading Progress Bar Plugin - Main Entry Point
 *
 * Bootstraps the React application that renders the plugin settings page
 * in the WordPress admin. This file is the webpack entry point compiled by
 * @wordpress/scripts (`npm run build`) and is loaded only on the plugin's
 * settings page via wp_enqueue_script (see index.php).
 *
 * The compiled stylesheet (index.css) is also enqueued on the frontend to
 * provide the CSS Scroll Timeline animation for the progress bar.
 *
 * @since 1.0.0
 */

// Import the frontend progress bar animation styles.
// @wordpress/scripts compiles this into build/index.css.
import './index.scss';

import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { SettingsPage } from './components';

/**
 * Wait for the DOM to be fully parsed, then mount the React settings page
 * into the #reading-progress-bar-settings element rendered by PHP.
 * Using domReady ensures the container div is present before createRoot is called.
 */
domReady( () => {
	const root = createRoot(
		document.getElementById( 'reading-progress-bar-settings' )
	);

	root.render( <SettingsPage /> );
} );