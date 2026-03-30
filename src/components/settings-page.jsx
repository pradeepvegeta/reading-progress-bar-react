/**
 * Settings Page Component
 *
 * Main component for the Reading Progress Bar plugin settings page.
 * Renders the full admin UI for configuring: post type, background color,
 * foreground color, bar height, bar position, and position offset.
 *
 * Data flow:
 *  - Settings are fetched from /wp/v2/settings on mount via the processSettings hook.
 *  - Each control updates its corresponding piece of local state.
 *  - The Save button posts all state back to /wp/v2/settings.
 *
 * @since 1.0.0
 */

import { __ } from '@wordpress/i18n';
import {
    __experimentalHeading as Heading,
    __experimentalVStack as VStack,
    Button,
    CheckboxControl,
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
import { excludePosts } from './exclude-post-types';
import { Notices } from './notices';

/**
 * Page Title Component
 *
 * Renders the H1 heading at the top of the settings page using the
 * experimental Heading component from @wordpress/components.
 *
 * @component
 * @returns {JSX.Element} The page heading.
 */
const SettingsTitle = () => {
    return (
        <Heading level={ 1 }>
            { __( 'Reading Progress Bar', 'reading-progress-bar' ) }
        </Heading>
    );
};

/**
 * Main Settings Page Container
 *
 * Orchestrates all settings controls and manages the overall layout.
 * All state and API communication are delegated to the processSettings hook.
 *
 * @component
 * @returns {JSX.Element} The complete settings page interface.
 */
const SettingsPage = () => {
    // Destructure all settings state and updaters from the custom hook.
    // The hook fetches the current values from the REST API on first render.
    const {
        selectedPostType,
        setSelectedPostType,
        color,
        setColor,
        height,
        setHeight,
        fgColor,
        setFgColor,
        position,
        setPosition,
        adjustPosition,
        setAdjustPosition,
        saveSettings,
    } = processSettings();

    // Read the active theme's color palette so ColorPalette shows theme colors.
    const [ colorPalette ] = useSettings( 'color.palette' );

    // Fetch all registered post types from the REST API. Returns null while loading.
    const postTypes = useSelect( ( select ) => {
        return select( coreDataStore ).getPostTypes( { per_page: -1 } );
    } );

    // Filter out internal WordPress post types (navigation, templates, etc.)
    // and map the rest into the { label, value } shape required by RadioControl.
    const postTypeOptions = postTypes
        ? postTypes
            .filter( ( postType ) => ! excludePosts.includes( postType.slug ) )
            .map( ( postType ) => ( {
                label: postType.name,
                value: postType.slug,
            } ) )
        : [];

    return (
        <VStack spacing={ 8 }>
            { /* Page heading */ }
            <SettingsTitle />

            { /* Success / error notices (e.g. "Settings saved.") */ }
            <Notices />

            <Panel>
                <PanelBody>
                    <VStack spacing={ 4 }>
                        { /* Post type selector — shown only when types have loaded */ }
                        <PanelRow>
                            { postTypeOptions.length === 0 ? (
                                <p>{ __( 'No post types available', 'reading-progress-bar' ) }</p>
                            ) : (
                                <BaseControl label={ __( 'Select Post Types', 'reading-progress-bar' ) }>
                                    <div>
                                        { postTypeOptions.map( ( option ) => (
                                            <div key={ option.value } style={ { marginBottom: '12px' } }>
                                                <CheckboxControl
                                                    label={ option.label }
                                                    checked={ selectedPostType.includes( option.value ) }
                                                    onChange={ ( isChecked ) => {
                                                        if ( isChecked ) {
                                                            setSelectedPostType( [ ...selectedPostType, option.value ] );
                                                        } else {
                                                            setSelectedPostType( selectedPostType.filter( ( type ) => type !== option.value ) );
                                                        }
                                                    } }
                                                />
                                            </div>
                                        ) ) }
                                    </div>
                                </BaseControl>
                            ) }
                        </PanelRow>

                        { /* Background color of the progress bar */ }
                        <PanelRow>
                            <BaseControl label={ __( 'Select Background Color', 'reading-progress-bar' ) }>
                                <div style={ { maxWidth: '500px' } }>
                                    <ColorPalette
                                        colors={ colorPalette }
                                        value={ color }
                                        onChange={ setColor }
                                    />
                                </div>
                            </BaseControl>
                        </PanelRow>

                        { /* Foreground (text/indicator) color of the progress bar */ }
                        <PanelRow>
                            <BaseControl label={ __( 'Select Foreground Color', 'reading-progress-bar' ) }>
                                <div style={ { maxWidth: '500px' } }>
                                    <ColorPalette
                                        colors={ colorPalette }
                                        value={ fgColor }
                                        onChange={ setFgColor }
                                    />
                                </div>
                            </BaseControl>
                        </PanelRow>

                        { /* Height of the progress bar in pixels (0–100px) */ }
                        <PanelRow style={ { maxWidth: '100%' } }>
                            <div style={ { width: '400px' } }>
                                <RangeControl
                                    label={ __( 'Progress Bar Height', 'reading-progress-bar' ) }
                                    value={ height }
                                    onChange={ setHeight }
                                    min={ 0 }
                                    max={ 100 }
                                    __next40pxDefaultSize
                                />
                            </div>
                        </PanelRow>

                        { /* Whether the bar is pinned to the top or bottom of the viewport */ }
                        <PanelRow>
                            <SelectControl
                                label={ __( 'Position', 'reading-progress-bar' ) }
                                value={ position }
                                options={ [
                                    { label: __( 'Top', 'reading-progress-bar' ), value: 'top' },
                                    { label: __( 'Bottom', 'reading-progress-bar' ), value: 'bottom' },
                                ] }
                                onChange={ setPosition }
                                __next40pxDefaultSize
                            />
                        </PanelRow>

                        { /* Pixel offset from the chosen edge (e.g. to clear an admin bar) */ }
                        <PanelRow style={ { maxWidth: '100%' } }>
                            <div style={ { width: '400px' } }>
                                 <RangeControl
                                    label={ __( 'Adjust Position', 'reading-progress-bar' ) }
                                    value={ adjustPosition }
                                    onChange={ setAdjustPosition }
                                    min={ 0 }
                                    max={ 100 }
                                    __next40pxDefaultSize
                                />
                            </div>
                        </PanelRow>

                    </VStack>

                </PanelBody>
            </Panel>

            { /* Primary save action */ }
            <div>
                <Button variant="primary" onClick={ saveSettings } __next40pxDefaultSize>
                    { __( 'Save', 'reading-progress-bar' ) }
                </Button>
            </div>
        </VStack>
    );
};

export { SettingsPage };
