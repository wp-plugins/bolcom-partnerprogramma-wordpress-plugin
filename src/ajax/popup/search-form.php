<?php
/**
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
$subTitle = 'Zoek functionaliteit invoegen';
$popupPage = 'search';
include_once 'includes/header.inc.php';
$bolSearch = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/bol-search.php';
?>
<table width="100%" border="0" cellpadding="3">
    <tr>
        <td width="50%" style="vertical-align: top">
            <label for="ddlBolCategory"><span class="label">Selecteer groep:</span></label><input type="radio" name="rbShowCat" id="rbShowCat1" value="0" checked="checked"/><select name="ddlBolCategory" id="ddlBolCategory" style="width: 40%">
                <option value="0">- Selecteer categorie -</option>
            </select><br/>
            <span class="label">&nbsp;</span><input type="radio" name="rbShowCat" id="rbShowCat2" value="1"/><label for="rbShowCat2"> Selectieveld op site weergeven</label><br/>

            <label for="txtSearch"><span class="label">Default zoeken:</span></label><input type="text" name="txtSearch" id="txtSearch" class="property"><br/>
            <label for="txtLimit"><span class="label">Limiet:</span></label><input type="text" name="txtLimit" id="txtLimit" value="10" style="width: 50px"><br/>
            <br/>
        </td>
        <td style="width: 50%; vertical-align: top" rowspan="2"><?php include 'includes/preview.inc.php' ?></td>
    </tr>
    <tr><td><?php $properties = array('header', 'width', 'cols'); include 'includes/properties.inc.php' ?></td></tr>
</table>

<div class="mceActionPanel">
    <input type="hidden" name="filename" id="filename" value="<?php echo $filename?>" />
    <?php if ($_REQUEST['widget']):?>
        <input type="hidden" name="widget" id="widget" value="<?php echo strip_tags($_REQUEST['widget'])?>" />
        <input type="button" id="save-button" name="save" class="updateButton button-primary" value="Save" onclick="BolSearchDialog.insert(<?php echo !empty($_REQUEST['widget'])?>)" />
        <span id="save-result"></span>
    <?php else: ?>
    <input type="button" id="insert" name="insert" value="Invoegen" onclick="BolSearchDialog.insert();" />
    <input type="button" id="cancel" name="cancel" value=" Annuleren" onclick="tinyMCEPopup.close();" />
    <?php endif;?>
</div>

<iframe class="hideElement" id="iframeForm" name="iframeForm" src="../savecss.php"></iframe>
<form id="saveCss" class="hideElement" target="iframeForm" method="post" action="../savecss.php">
    <textarea name="cssstyle1" id="cssstyle1" style="width:600px;height:70px;"></textarea>
    <input type="hidden" name="filename" id="filename" value="<?php echo $filename?>" />
    <input type="submit" id="save" name="save" value="save" />
</form>

    </body>
</html>
