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
use BolPartnerPlugin\Widgets\Renderer\ProductLinksRenderer;

$partnerSettings = get_option('bol_partner_settings');
$openApiSettings = get_option('bol_openapi_settings');
$accessKey = $partnerSettings['access_key'];
$secretKey = $openApiSettings['access_key'];
$client = ApiClientFactory::getCreateClient($accessKey, $secretKey);

function getRefinements($id = 0, $refine)
{
    global $client;

    $options = array_merge(array('includeRefinements' => true), $refine);
    $response = $client->listResults('toplist_default', $id, $options);

    $groups = $response->getRefinementGroups();
    $refineId = reset($refine);

    foreach ($groups as $refinement) {
        if ($refinement->getId() == $refineId) {
            return $refinement->getRefinements();
        }
    }

    return null;
}

function getCategoriesList($id = 0, array $refine = array())
{
    global $client;

    $options = array_merge(array('includeRefinements' => true), $refine);
    $response = $client->listResults('toplist_default', $id, $options);

    $replace = array(3136, 3134);
    $refines = array(8299 => array('taal' => 1312));

    $categories = $response->getCategories();

    foreach ($categories as $id => $category) {
        if (isset($refines[$category->getId()])) {
            $refine = $refines[$category->getId()];
            $subs = getRefinements($category->getId(), $refine);
            if (! empty($subs)) {
                array_splice($categories, $id, 1, $subs);
            }
        } else if (in_array($category->getId(), $replace)) {
            $subs = getCategories($category->getId());
            array_splice($categories, $id, 1, $subs);
        }
    }
    return $categories;
}

function getCategories($id = 0)
{
    global $client;

    $options = array('includeRefinements' => false);
    $response = $client->listResults('toplist_default', $id, $options);

    $categories = $response->getCategories();
    return $categories;
}

function getSearch($text, $category = 0, $limit = 5, $offset = 0)
{
    global $client;

    $options = array(
        'offset' => $offset,
        'nrProducts' => $limit,
    );

    if ($category > 0) {
        $options['categoryId'] = $category;
    }

    $response = $client->searchResults($text, $options);
    return getProductsHtml($response->getProducts(), $response->getTotalResultSize(), $offset);
}

$limit = isset($_POST['limit']) ? $_POST['limit'] : 5;

$get = (isset($_GET['get'])) ? $_GET['get'] : '';
switch ($get) {
    case "categories":
        $categories = getCategoriesList();
        echo getCategoriesHtml($categories);
        break;
    case "selected":
        $category = (int) isset($_POST['category']) ? $_POST['category'] : 0;
        echo getProducts($_POST['id'], $category);
        break;
    case "selected-categories":
        $parentId = (isset($_GET['parentId'])) ? $_GET['parentId'] : 0;
        echo getCategoriesHtml(getCategories($parentId));
        break;
    default:
        $offset = $limit * (((int) isset($_POST['page']) && $_POST['page'] > 0 ? $_POST['page'] : 1) - 1);
        echo getSearch($_POST['text'], $_POST['category'], $limit, $offset);
}

function getProductsHtml($products, $totalResults, $offset = 0) {
    $options = array(
        'limit' => 5,
        'offset' => $offset,
        'totalResults' => $totalResults,
        'show_price' => true,
        'show_rating' => true,
        'show_sub_title' => true,
        'cols' => 1,
        'image_size' => 1,
        'width' => 250,
    );
    $renderer = new ProductLinksRenderer($products, $options);
    return $renderer->render();
}

function getCategoriesHtml($categories)
{
    $html = '';
    foreach ($categories as $id => $category) {
        if ($category->getProductCount() > 0) {
            $html .= sprintf('<option value="%s">%s</option>', $category->getId(), $category->getName());
        }
    }
    return $html;
}
