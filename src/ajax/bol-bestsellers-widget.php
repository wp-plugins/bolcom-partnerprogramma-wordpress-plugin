<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$pluginPath = __DIR__ . '/../..';
$wp_path = $pluginPath . '/../../..';
require_once $wp_path . '/wp-load.php';

use BolPartnerPlugin\ApiClientFactory;
use BolOpenApi\Client;
use BolPartnerPlugin\Widgets\Renderer\ProductLinksRenderer;
use BolPartnerPlugin\Widgets\Bestsellers;

function getProducts(Client $client, array $options, $type = 'toplist_default')
{
    $categoryId = $options['cat_id'];

    $params = array(
        'nrProducts' => intval(isset($options['limit']) && ($options['limit'] > 0) ? $options['limit'] : 5),
        'includeProducts' => true,
        'includeCategories' => false,
        'includeRefinements' => false
    );

    try {
        $response = $client->listResults($type, $categoryId, $params);
        return $response->getProducts();
    } catch (\BolOpenApi\Exception $e) {
        return array();
    }
}

$valid = array_keys(Bestsellers::getDefaultAttributes());

// check the post credentials
$options = array();
foreach ($valid as $id) {
    if (isset($_POST[$id])) {
        $options[$id] = $_POST[$id];
    }
}

$partnerSettings = get_option('bol_partner_settings');
$openApiSettings = get_option('bol_openapi_settings');
$options['partnerId'] = $partnerSettings['site_id'];

// load the products
$accessKey = $partnerSettings['access_key'];
$secretKey = $openApiSettings['access_key'];
$client = ApiClientFactory::getCreateClient($accessKey, $secretKey);

$products = getProducts($client, $options);

// display the products
if (! empty($products)) {
    $renderer = new ProductLinksRenderer($products, $options);
    echo $renderer;
}
