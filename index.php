<?php

/**
 * Reading Progress Bar Plugin
 *
 * Plugin Name:       Reading Progress Bar
 * Plugin URI:        https://github.com/pradeepvegeta/
 * Description:       Display a progress bar indicating reading progress on the frontend.
 * Version:           1.0.0
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Author:            Pradeep Kumar
 * Author URI:        https://github.com/pradeepvegeta/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Update URI:        https://example.com/my-plugin/
 * Text Domain:       reading-progress-bar
 *
 * @package           Reading_Progress_Bar
 * @since             1.0.0
 */

declare(strict_types=1);

namespace Reading_Progress_Bar;

if (! defined('ABSPATH')) {
    exit;
}

if (file_exists(plugin_dir_path(__FILE__) . 'vendor/autoload.php')) {
    require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';
} else {
    wp_trigger_error('Reading Progress Bar Plugin: Composer autoload file not found. Please run `composer install`.', E_USER_ERROR);
    return;
}

/**
 * Main Reading Progress Bar Plugin Class
 *
 * Handles plugin initialization, settings page registration, and script/style enqueuing.
 *
 * @class Reading_Progress_Bar
 * @since 1.0.0
 */
class Reading_Progress_Bar
{
    /**
     * Constructor
     *
     * Initializes plugin hooks and actions.
     *
     * @since 1.0.0
     */
    public function __construct()
    {
        add_action('admin_menu', [$this, 'reading_progress_bar_settings_page']);
        add_action('admin_enqueue_scripts', [$this, 'reading_progress_bar_settings_page_enqueue_style_script']);
        add_action('init', [$this, 'reading_progress_bar_settings']);
    }

    /**
     * Register Settings Page
     *
     * Adds the plugin settings page to the WordPress admin menu.
     *
     * @since 1.0.0
     */
    public function reading_progress_bar_settings_page()
    {
        add_options_page(
            __('Reading Progress Bar', 'reading-progress-bar'),
            __('Reading Progress Bar', 'reading-progress-bar'),
            'manage_options',
            'reading-progress-bar',
            [$this, 'reading_progress_bar_settings_page_html']
        );
    }

    /**
     * Render Settings Page HTML
     *
     * Outputs the container for the React settings interface.
     *
     * @since 1.0.0
     */
    function reading_progress_bar_settings_page_html()
    {
        printf(
            '<div class="wrap" id="reading-progress-bar-settings">%s</div>',
            esc_html__('Loading…', 'reading-progress-bar')
        );
    }

    /**
     * Enqueue Settings Page Scripts and Styles
     *
     * Loads the compiled React bundle and CSS only on the plugin settings page.
     *
     * @since 1.0.0
     * @param string $admin_page The current admin page.
     */
    function reading_progress_bar_settings_page_enqueue_style_script($admin_page)
    {
        if ('settings_page_reading-progress-bar' !== $admin_page) {
            return;
        }

        $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';

        if (! file_exists($asset_file)) {
            return;
        }

        $asset = include $asset_file;

        wp_enqueue_script(
            'reading-progress-bar-script',
            plugins_url('build/index.js', __FILE__),
            $asset['dependencies'],
            $asset['version'],
            array(
                'in_footer' => true,
            )
        );

        wp_enqueue_style(
            'reading-progress-bar-style',
            plugins_url('build/index.css', __FILE__),
            array_filter(
                $asset['dependencies'],
                function ($style) {
                    return wp_style_is($style, 'registered');
                }
            ),
            $asset['version'],
        );
    }

    /**
     * Register Plugin Settings
     *
     * Registers the reading_progress_bar setting with default values and REST API schema.
     * This allows the React frontend to fetch and update settings via REST API.
     *
     * @since 1.0.0
     */
    public function reading_progress_bar_settings()
    {
        $default = array(
            'posttype' => 'post',
            'color'    => '#000',
        );

        $schema  = array(
            'type'       => 'object',
            'properties' => array(
                'posttype' => array(
                    'type' => 'string',
                ),
                'color' => array(
                    'type' => 'string',
                ),
            ),
        );

        register_setting(
            'options',
            'reading_progress_bar',
            array(
                'type'         => 'object',
                'default'      => $default,
                'show_in_rest' => array(
                    'schema' => $schema,
                ),
            )
        );
    }
}

// Initialize the plugin
new Reading_Progress_Bar();
