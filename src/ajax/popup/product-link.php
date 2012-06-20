<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$subTitle = 'Product Link invoegen';
$popupPage = 'product-link';
include_once 'includes/header.inc.php';
$bolSearch = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/bol-search.php';
?>
<div id="tabs-container">

    <ul id="tabs">
        <li><a href="#tab-search">1. Selecteer Product</a></li>
        <li><a href="#tab-widget">2. Configureer Widget</a></li>
    </ul>

    <div id="tab-search">
        <table width="100%" border="0" cellpadding="3">
            <tr>
                <td valign="top">
                    <input type="text" id="txtBolSearch" name="txtBolSearch" value="" style="width: 160px;"/><span class="infix"> in </span><select name="ddlBolCategory" id="ddlBolCategory" style="width: 160px;" ><option value="0">- Selecteer categorie -</option></select><br/>
                </td>

                <td style="vertical-align: middle; width: 50%; text-align: center; line-height: 30px">
                    <input type="button" class="updateButton button-primary" value="Zoeken" id="apply-search">
                    <input type="button" class="updateButton hiddenType button" value="Naar stap 2" id="next-step">
                </td>
            </tr>
        </table>
        <h4>Selecteer producten om in te voegen</h4>
        <table width="100%" border="0" cellpadding="3">
            <tr>
                <td style="vertical-align: top; width: 50%">
                    <div id="dvResults" class="searchResults"></div>
                </td>
                <td style="vertical-align: top">
                    <div class="selectedProducts" id="dvSelectedProducts">
                        <input type="hidden" name="hdnBolProducts" id="hdnBolProducts" value=""/>
                        <div class="productlist bol_pml_box">
                            <div class="bol_pml_box_inner"></div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <div id="tab-widget">
        <table width="100%" border="0" cellpadding="3">
            <tr><td style="vertical-align: top; width: 50%">
            <?php $properties = array('width', 'cols'); include 'includes/properties.inc.php' ?>
            </td>
            <td style="width: 50%; vertical-align: top" rowspan="2"><?php include 'includes/preview.inc.php' ?></td>
            </td></tr>
        </table>
        <p>
        <div class="mceActionPanel">
            <input type="hidden" name="filename" id="filename-field" value="<?php echo $filename?>" />
            <?php if ($_REQUEST['widget']):?>
            <input type="hidden" name="widget" id="widget" value="<?php echo strip_tags($_REQUEST['widget'])?>" />
            <input type="button" id="save-button" name="save" class="updateButton button-primary" value="Save" onclick="BolProductDialog.insert(<?php echo !empty($_REQUEST['widget'])?>)" />
            <span id="save-result"></span>
            <?php else: ?>
            <input type="button" id="insert" name="insert" value="Invoegen" onclick="BolProductDialog.insert(<?php echo !empty($_REQUEST['widget'])?>);" />
            <input type="button" id="cancel" name="cancel" value=" Annuleren" onclick="tinyMCEPopup.close();" />
            <?php endif;?>
        </div>
        <!--/form-->
        </p>

    </div>

</div>

<iframe class="hideElement" id="iframeForm" name="iframeForm" src="../savecss.php"></iframe>
<form id="saveCss" class="hideElement" target="iframeForm" method="post" action="../savecss.php">
    <textarea name="cssstyle1" id="cssstyle1" style="width:600px;height:70px;"></textarea>
    <input type="hidden" name="filename" id="filename" value="<?php echo $filename ?>" />
    <input type="submit" id="save" name="save" value="save" />
</form>

    </body>
</html>
