/**
 * Settings Page Component
 *
 * Main component for the Reading Progress Bar plugin settings page.
 * Manages the UI for selecting post types and background color.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
    __experimentalHeading as Heading,
    __experimentalVStack as VStack,
    Button,
    RadioControl,
    BaseControl,
    RangeControl,
    SelectControl,
    ColorPalette,
    Panel,
    PanelBody,
    PanelRow
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useSettings } from '@wordpress/block-editor';
import { processSettings } from '../hooks';
import { store as coreDataStore } from '@wordpress/core-data';
import { excludePosts } from "./exclude-post-types";
import { Notices } from './notices';

/**
 * Page Title Component
 *
 * @component
 * @returns {JSX.Element} The page heading
 */
const SettingsTitle = () => {
    return (
        <Heading level={1}>
            {__('Reading Progress Bar', 'reading-progress-bar')}
        </Heading>
    );
};

/**
 * Post Types Radio Options Component
 *
 * Fetches all available WordPress post types (except those in excludePosts),
 * and returns an array of options suitable for the RadioControl component.
 *
 * @component
 * @returns {Array} Array of post type options
 */
const PostTypesRadio = () => {
    const postTypes = useSelect((select) => {
        return select(coreDataStore).getPostTypes({ per_page: -1 });
    });

    if (!postTypes || postTypes.length === 0) {
        return <p>{__('No post types available', 'reading-progress-bar')}</p>;
    }

    const options = postTypes
        .filter((postType) => !excludePosts.includes(postType.slug))
        .map((postType) => ({
            label: postType.name,
            value: postType.slug,
        }));

    return options;
};

/**
 * Save Button Component
 *
 * Primary action button for saving plugin settings.
 *
 * @component
 * @param {Object} props Component props
 * @param {Function} props.onClick - Callback function when button is clicked
 * @returns {JSX.Element} The save button
 */
const SaveButton = ({ onClick }) => {
    return (
        <div>
            <Button variant="primary" onClick={onClick} __next40pxDefaultSize>
                {__('Save', 'reading-progress-bar')}
            </Button>
        </div>
    );
};

/**
 * Main Settings Page Container
 *
 * Orchestrates all settings components and manages the overall layout.
 * Handles integrating the settings hook with the UI components.
 *
 * @component
 * @returns {JSX.Element} The complete settings page interface
 */
const SettingsPage = () => {
    const {
        selectedPostType,
        setSelectedPostType,
        color,
        setColor,
        height,
		setHeight,
		fgclor,
		setFgColor,
		position,
		setPosition,
		adjustposition,
		setAdjustPosition,
        saveSettings,
    } = processSettings();

    const [colorPalette] = useSettings('color.palette');
    const postTypeOptions = PostTypesRadio();

    return (
        <VStack spacing={8}>
            <SettingsTitle />
            <Notices />
            <Panel>
                <PanelBody>
                    <PanelRow>
                        <RadioControl
                            label={__('Select Post Type', 'reading-progress-bar')}
                            selected={selectedPostType}
                            options={postTypeOptions}
                            onChange={setSelectedPostType}
                            __next40pxDefaultSize
                        />
                    </PanelRow>
                    <PanelRow>
                        <BaseControl label="Select Background Color">
                            <div style={{ maxWidth: '500px' }}>
                                <ColorPalette
                                    colors={colorPalette}
                                    value={color}
                                    onChange={(color) => setColor(color)}
                                />
                            </div>
                        </BaseControl>
                    </PanelRow>
                    <PanelRow>
                        <BaseControl label="Select Foreground Color">
                            <div style={{ maxWidth: '500px' }}>
                                <ColorPalette
                                    colors={colorPalette}
                                    value={fgclor}
                                    onChange={(fgclor) => setFgColor(fgclor)}
                                />
                            </div>
                        </BaseControl>
                    </PanelRow>
                    <PanelRow>
                        <RangeControl
                            label={ __( 'Progress Bar Height', 'reading-progress-bar' ) }
                            value = { height }
                            onChange={ ( value ) => setHeight( value ) }
                            min={ 0 }
                            max={ 100 }>
                        </RangeControl>
                    </PanelRow>
                     <PanelRow>
                        <SelectControl
                            label={ __( 'Position', 'reading-progress-bar' ) }
                            value={ position }
                            options={ [
                                { label: 'Top', value: 'top' },
                                { label: 'Bottom', value: 'bottom' },
                            ] }
                            onChange={ ( newPosition ) => setPosition( newPosition ) }
                            __next40pxDefaultSize
                        />
                     </PanelRow>
                </PanelBody>
            </Panel>
            <SaveButton onClick={saveSettings} />
        </VStack>
    );
};

export { SettingsPage };