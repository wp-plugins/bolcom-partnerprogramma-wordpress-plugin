<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
define('WP_USE_THEMES', false);

$pluginPath = __DIR__ . '/../../../..';
$wp_path = $pluginPath . '/../../..';
require_once $wp_path . '/wp-load.php';

if (! is_user_logged_in()) {
    die;
}

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
    <script type="text/javascript" src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/js/bol-admin-<?php echo $popupPage ?>.js"></script>
    <?php endif ?>
    <link rel="stylesheet" type="text/css" href="/wp-admin/load-styles.php?c=1&dir=ltr&load=admin-bar,wp-admin">
    <link rel="stylesheet" type="text/css" href="/wp-admin/css/colors-fresh.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/jquery-ui-1.8.13.custom.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/bol.css">
    <link rel="stylesheet" type="text/css" href="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/css/bol-search.css">
</head>
<body id="bolAdminPopup">
