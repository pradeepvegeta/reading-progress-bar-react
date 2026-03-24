/**
 * Excluded Post Types Configuration
 *
 * List of WordPress post types that should be excluded from the
 * front-end reading progress bar settings. These are typically system
 * or internal post types that don't make sense for reader tracking.
 *
 * @since 1.0.0
 * @type {string[]}
 */
export const excludePosts = [
    'attachment',        // Uploaded files
    'wp_navigation',     // Custom navigation blocks
    'wp_block',          // Reusable blocks
    'wp_template',       // Full-site editing templates
    'wp_template_part',  // Full-site editing template parts
    'wp_global_styles',  // Global theme styles
    'nav_menu_item',     // Menu items
    'wp_font_family',    // Custom font families
    'wp_font_face'       // Custom font faces
];