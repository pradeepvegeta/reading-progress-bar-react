/**
 * Settings Management Hook
 *
 * Custom React hook for managing the Reading Progress Bar settings.
 * Handles fetching settings from the WordPress REST API on component mount
 * and saving updated settings when the user clicks Save.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { store as noticesStore } from '@wordpress/notices';
import { useEffect, useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

/**
 * Custom hook for managing reading progress bar settings
 *
 * @returns {Object} Settings state and functions
 * @returns {string} returns.selectedPostType - Currently selected post type
 * @returns {Function} returns.setSelectedPostType - Update selected post type
 * @returns {string} returns.color - Currently selected color
 * @returns {Function} returns.setColor - Update selected color
 * @returns {Function} returns.saveSettings - Save settings to database
 */
const processSettings = () => {
	const [ selectedPostType, setSelectedPostType ] = useState( '' );
	const [ color, setColor ] = useState ( '#000' );

	const { createSuccessNotice } = useDispatch( noticesStore );

	/**
	 * Fetch settings from WordPress REST API on component mount
	 */
	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } ).then( ( settings ) => {
			setSelectedPostType( settings.reading_progress_bar.posttype );
			setColor( settings.reading_progress_bar.color );
		} );
	}, [] );

	/**
	 * Save settings to WordPress via REST API
	 */
	const saveSettings = () => {
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				reading_progress_bar: {
					posttype: selectedPostType,
					color,
				},
			},
		} ).then( () => {
			createSuccessNotice(
				__( 'Settings saved.', 'reading-progress-bar' )
			);
		} );
	};

	return {
		selectedPostType,
		setSelectedPostType,
		color,
		setColor,
		saveSettings,
	};
};

export default processSettings;