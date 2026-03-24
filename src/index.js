/**
 * Reading Progress Bar Plugin - Main Entry Point
 *
 * Initializes the React application that renders the plugin settings page.
 * This file is compiled by @wordpress/scripts and loaded in the WordPress admin.
 *
 * @since 1.0.0
 */

import './index.scss';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { SettingsPage } from './components';

/**
 * Wait for DOM to be ready, then render the settings page component
 * into the #reading-progress-bar-settings container.
 */
domReady( () => {
	const root = createRoot(
		document.getElementById( 'reading-progress-bar-settings' )
	);

	root.render( <SettingsPage /> );
} );