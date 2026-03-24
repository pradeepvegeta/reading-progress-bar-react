/**
 * Notices Component
 *
 * Displays WordPress notices (success, error, warning) from the notices store.
 * Uses the WordPress NoticeList component to render all active notices.
 *
 * @since 1.0.0
 */

import { useDispatch, useSelect } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { NoticeList } from '@wordpress/components';

/**
 * Renders a list of WordPress admin notices
 *
 * @component
 * @returns {JSX.Element|null} The NoticeList component or null if no notices
 */
const Notices = () => {
	const { removeNotice } = useDispatch( noticesStore );
	const notices = useSelect( ( select ) =>
		select( noticesStore ).getNotices()
	);

	// Return nothing if there are no notices to display
	if ( notices.length === 0 ) {
		return null;
	}

	return <NoticeList notices={ notices } onRemove={ removeNotice } />;
};

export { Notices };