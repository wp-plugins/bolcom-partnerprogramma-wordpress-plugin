<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Bol.com <?php echo $subTitle ?></title>
    <?php if (!isset($_REQUEST['widget'])):?>
    <script type="text/javascript" src="<?php echo get_settings('home') ?>/wp-includes/js/tinymce/tiny_mce_popup.js"></script>
    <?php endif ?>
    <script type="text/javascript">var bol_partner_plugin_base = '<?php echo BOL_PARTNER_PLUGIN_PATH ?>';</script>
    <script type="text/javascript" src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/js/jquery-1.4.2.min.js"></script>
    <script type="text/javascript" src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/js/jquery-ui-1.8.13.custom.min.js"></script>
    <script type="text/javascript" src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/js/jscolor.js"></script>
    <?php if (isset($popupPage)) : ?>
    <script type="text/javascript">
        var i10n = {
            'selectcategory' : '<?php _e('Select category', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'selectsubcategory' : '<?php _e('Select subcategory', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'loadpreview' : '<?php _e('Load preview', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'chooselimit' : '<?php _e('Choose a limit between 1-25', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'requirename' : '<?php _e('Please fill in the required name', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'requiresearchword' : '<?php _e('Please fill a search term', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'productsareloaded' : '<?php _e('Retrieving products', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'productlink' : '<?php _e('Productlink', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'bestellers' : '<?php _e('Bestsellers', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'searchwidget' : '<?php _e('Search widget', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'changessaved' : '<?php _e('Changes saved', 'bolcom-partnerprogramma-wordpress-plugin'); ?>',
            'savingerror' : '<?php _e('Saving error', 'bolcom-partnerprogramma-wordpress-plugin'); ?>'
        };
    </script>
    <script type="text/javascript" src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/js/bol-admin-<?php echo $popupPage ?>.js"></script>
    <?php endif ?>
    <!--<link rel="stylesheet" type="text/css" href="/wp-admin/load-styles.php?c=1&dir=ltr&load=admin-bar,wp-admin,buttons">-->
    <link rel="stylesheet" type="text/css" href="<?php echo get_settings('home') ?>/wp-admin/load-styles.php?c=1&dir=ltr&load=admin-bar,buttons,media-views,wp-admin,wp-auth-check">
    <link rel="stylesheet" type="text/css" href="<?php echo get_settings('home') ?>/wp-admin/css/colors-fresh.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/jquery-ui-1.8.13.custom.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/bol.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/bol-search.css">
</head>
<body id="bolAdminPopup" class="wp-admin wp-core-ui js">
