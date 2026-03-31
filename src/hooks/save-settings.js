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
 * @returns {Array}    returns.selectedPostType    - Selected post types (array of slugs)
 * @returns {Function} returns.setSelectedPostType - Update selected post types
 * @returns {string}   returns.color               - Currently selected background color
 * @returns {Function} returns.setColor            - Update background color
 * @returns {number}   returns.height              - Progress bar height in px
 * @returns {Function} returns.setHeight           - Update height
 * @returns {string}   returns.position            - Bar position ('top' or 'bottom')
 * @returns {Function} returns.setPosition         - Update position
 * @returns {number}   returns.adjustPosition      - Offset from edge in px
 * @returns {Function} returns.setAdjustPosition   - Update offset
 * @returns {Function} returns.saveSettings        - Save settings to database
 */
const processSettings = () => {
	const [ selectedPostType, setSelectedPostType ] = useState( [] );
	const [ color, setColor ] = useState( '#000000' );
	const [ height, setHeight ] = useState( 8 );
	const [ position, setPosition ] = useState( 'top' );
	const [ adjustPosition, setAdjustPosition ] = useState( 30 );

	const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

	/**
	 * Fetch settings from WordPress REST API on component mount
	 */
	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } )
			.then( ( settings ) => {
				const rpb = settings.reading_progress_bar;
			// Handle both array (new format) and string (legacy format) for posttype
			const postTypes = Array.isArray( rpb.posttype ) ? rpb.posttype : ( rpb.posttype ? [ rpb.posttype ] : [] );
			setSelectedPostType( postTypes );
				setColor( rpb.color );
				setHeight( rpb.height );
				setPosition( rpb.position );
				setAdjustPosition( rpb.adjust_position );
			} )
			.catch( () => {
				createErrorNotice(
					__( 'Failed to load settings.', 'reading-progress-bar' )
				);
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
					height,
					position,
					adjust_position: adjustPosition,
				},
			},
		} )
			.then( () => {
				createSuccessNotice(
					__( 'Settings saved.', 'reading-progress-bar' )
				);
			} )
			.catch( () => {
				createErrorNotice(
					__( 'Failed to save settings.', 'reading-progress-bar' )
				);
			} );
	};

	return {
		selectedPostType,
		setSelectedPostType,
		color,
		setColor,
		height,
		setHeight,
		position,
		setPosition,
		adjustPosition,
		setAdjustPosition,
		saveSettings,
	};
};

export default processSettings;
