<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
require_once $_SERVER['DOCUMENT_ROOT'] . '/wp-load.php';

use BolPartnerPlugin\ApiClientFactory;
use Buzz\Browser as BuzzBrowser;
use BolOpenApi\Client;
use BolPartnerPlugin\Widgets\Renderer\ProductSearchFormRenderer;
use BolPartnerPlugin\Widgets\SearchForm;

function getCategories(Client $client, $id = 0)
{
    $options = array('includeRefinements' => false);
    $response = $client->listResults('toplist_default', $id, $options);
    return $response->getCategories();
}

/**
 * @param BolOpenApi\Client $client
 * @param array $options
 * @param string $type
 * @return array|BolOpenApi\Response\ListResultsResponse
 */
function getResult(Client $client, array $options, $type = 'toplist_default')
{
    $categoryId = $options['cat_id'];

    $params = array(
        'nrProducts' => intval(isset($options['limit']) && ($options['limit'] > 0) ? $options['limit'] : 5),
        'includeProducts' => true,
        'includeCategories' => true,
        'includeRefinements' => false
    );

    try {
        $response = $client->listResults($type, $categoryId, $params);
        return $response;
    } catch (\BolOpenApi\Exception $e) {
        return array();
    }
}

/**
 * @param BolOpenApi\Client $client
 * @param $text
 * @param int $category
 * @param int $limit
 * @param int $offset
 * @return BolOpenApi\Response\SearchResultsResponse
 */
function getSearch(Client $client, $text, $category = 0, $limit = 10, $offset = 0)
{
    $options = array(
        'offset' => $offset,
        'nrProducts' => $limit,
    );

    if ($category > 0) {
        $options['categoryId'] = $category;
    }

    try {
        $response = $client->searchResults($text, $options);
        return $response;
    } catch (\BolOpenApi\Exception $e) {
        return null;
    }
}

$valid = array_keys(SearchForm::getDefaultAttributes());

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
$partnerSettings = get_option('bol_partner_settings');
$openApiSettings = get_option('bol_openapi_settings');
$accessKey = $partnerSettings['access_key'];
$secretKey = $openApiSettings['access_key'];
$client = ApiClientFactory::getCreateClient($accessKey, $secretKey);
$result = getSearch($client, $options['default_search'], $options['cat_id'], $options['limit'], $options['offset']);

// display the products
$options['totalResults'] = is_null($result) ? 0 : $result->getTotalResultSize();
$renderer = new ProductSearchFormRenderer($result, $options);
$renderer->setCategories(getCategories($client));
echo $renderer;
