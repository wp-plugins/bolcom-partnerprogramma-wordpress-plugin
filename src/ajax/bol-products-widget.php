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
use BolPartnerPlugin\Widgets\SelectedProducts;

function getProducts($client, array $productIds)
{
    $products = array();

    foreach ($productIds as $product) {
        $response = $client->products($product);

        if ($response->getProduct()) {
            $products[] = $response->getProduct();
        }
    }
    return $products;
}

$valid = array_keys(SelectedProducts::getDefaultAttributes());

// check the post credentials
$options = array();
foreach ($valid as $id) {
    if (isset($_POST[$id])) {
        $options[$id] = $_POST[$id];
    }
}

$options = $_POST;
$products = explode(',', trim($_POST['products'], ','));
if (empty($products)) {
    die;
}

$partnerSettings = get_option('bol_partner_settings');
$openApiSettings = get_option('bol_openapi_settings');
$options['partnerId'] = $partnerSettings['site_id'];

// load the products
$accessKey = $partnerSettings['access_key'];
$secretKey = $openApiSettings['access_key'];
$client = ApiClientFactory::getCreateClient($accessKey, $secretKey);

$products = getProducts($client, $products);

// display the products
$renderer = new ProductLinksRenderer($products, $options);
echo $renderer;
