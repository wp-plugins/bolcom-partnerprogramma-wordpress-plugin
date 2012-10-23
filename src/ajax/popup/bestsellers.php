<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$subTitle = 'Bestsellers invoegen';
$popupPage = 'bestsellers';
include_once 'includes/header.inc.php';
$bolSearch = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/bol-search.php';
?>
<table width="100%" border="0" cellpadding="3">
    <tr>
        <td width="50%" style="vertical-align: top">
            <label for="ddlBolCategory"><span class="label">Selecteer groep:</span></label>
            <select name="ddlBolCategory" id="ddlBolCategory" style="width: 40%">
                <option value="0">- Selecteer categorie -</option>
            </select><br/>

            <label id="labelBolSubCategory" for="ddlBolSubCategory"><span class="label">Selecteer categorie:</span></label>
            <select class="" name="ddlBolSubCategory" id="ddlBolSubCategory" disabled="disabled" style="width: 40%">
                <option value="0">- Selecteer subcategorie -</option>
            </select><span class="loader hideElement"></span><br/>

            <label id="labelBolSub2Category" for="ddlBolSub2Category"><span class="label">Selecteer subcategorie:</span></label>
            <select class="" name="ddlBolSub2Category" id="ddlBolSub2Category" disabled="disabled" style="width: 40%">
                <option value="0">- Selecteer subcategorie -</option>
            </select><span class="loader hideElement"></span><br/>

            <label id="labelBolSub3Category" for="ddlBolSub3Category"><span class="label">Selecteer tricategorie:</span></label>
            <select class="" name="ddlBolSub3Category" id="ddlBolSub3Category" disabled="disabled" style="width: 40%">
                <option value="0">- Selecteer subcategorie -</option>
            </select><span class="loader hideElement"></span><br/>

            <label for="priceRangeList"><span class="label">Selecteer prijs:</span></label>
            <select id="priceRangeList" name="priceRangeList" style="width: 40%"><option value="0">Selecteer prijs...</option><option value="7143">Tot &euro; 10</option><option value="4854">Tot &euro; 20</option><option value="4855">Tot &euro; 30</option><option value="4856">Tot &euro; 40</option><option value="4857">Tot &euro; 50</option><option value="4858">Tot &euro; 100</option><option value="5014">Tot &euro; 200</option><option value="4860">Tot &euro; 300</option><option value="4861">Tot &euro; 400</option><option value="4862">Tot &euro; 500</option><option value="4863">Tot &euro; 750</option><option value="4864">Tot &euro; 1000</option><option value="4865">Tot &euro; 1500</option><option value="4866">Tot &euro; 2000</option><option value="7346">Tot &euro; 2500</option></select><br/>

            <label for="txtLimit"><span class="label">Limiet:</span></label>
            <input type="text" id="txtLimit" name="txtLimit" value="5" style="width: 50px;">
            <small>max. 25</small>
            <br/>
            <?php $properties = array('header', 'title', 'width', 'cols'); include 'includes/properties.inc.php' ?>
        </td>
        <td style="width: 50%; vertical-align: top"><?php include 'includes/preview.inc.php' ?></td>
    </tr>
</table>

<div class="mceActionPanel">
    <input type="hidden" name="blockId" id="blockId" value="bol_<?= uniqid() ?>_bestsellers" />
    <?php if ($_REQUEST['widget']):?>
        <input type="hidden" name="widget" id="widget" value="<?php echo strip_tags($_REQUEST['widget'])?>" />
        <input type="button" id="save-button" name="save" class="updateButton button-primary" value="Save" onclick="BolBestsellersDialog.insert(<?php echo !empty($_REQUEST['widget'])?>)" />
        <span id="save-result"></span>
    <?php else: ?>
    <input type="button" id="insert" name="insert" value="{#insert}" onclick="BolBestsellersDialog.insert(<?php echo !empty($_REQUEST['widget'])?>);" />
    <input type="button" id="cancel" name="cancel" value="{#cancel}" onclick="tinyMCEPopup.close();" />
    <?php endif;?>
</div>

    </body>
</html>
