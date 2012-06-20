<?php
/*
Plugin Name: Bol.com partner plugin for Wordpress
Plugin URI: http://wordpress.org/extend/plugins/bol.com-partner/
Description: This plugin is for bol.com affiliate partners. It enables the placement of Bol.com products from the Bol.com openAPI. Content can be added through the text editor and by widgets.
Author: Netvlies Internetdiensten
Version: 1.0
Author URI: http://www.netvlies.nl
License: MIT
*/
if (file_exists(__DIR__ . '/vendor/.composer')) {
    require_once 'vendor/.composer/autoload.php';
}

include_once 'src/BolPartnerPlugin/Plugin.php';
include_once 'src/BolPartnerPlugin/PluginInstaller.php';

if (! defined('BOL_PARTNER_BASEDIR')) {
    define('BOL_PARTNER_BASEDIR', __DIR__);
    define('BOL_PARTNER_PLUGIN_PATH', WP_CONTENT_URL . '/plugins/' . plugin_basename(dirname(__FILE__)));
    $include = array(ini_get('include_path'));
    $include[] = BOL_PARTNER_BASEDIR . '/src';
    $include[] = BOL_PARTNER_BASEDIR . '/vendor';
    ini_set('include_path', implode(PATH_SEPARATOR, $include));
}

if (! defined('BOL_PARTNER_CONFIG_MENU_SLUG')) {
    define('BOL_PARTNER_CONFIG_MENU_SLUG', 'boldotcom_partnerplugin');
}

// Registering the activate, deactivate and uninstall action hooks with the installer class
//register_activation_hook( __FILE__, array( 'BolPartnerPlugin\Installer', 'activate' ) );
//register_deactivation_hook( __FILE__, array( 'BolPartnerPlugin\Installer', 'deactivate' ) );
//register_uninstall_hook( __FILE__, array( 'BolPartnerPlugin\Installer', 'uninstall' ) );

// Loading the plugin class and widgets

$config = parse_ini_file('config.ini', true);
$bolPartnerPlugin = new BolPartnerPlugin\Plugin($config['plugin']);
$bolPartnerPlugin->init();
