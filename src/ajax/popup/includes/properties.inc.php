<?php
/**
 * Renders the most common properties in the widget configuration
 * Currently the following properties can be optionally selected:
 * 'width'  = The width of the box
 * 'header' = Wether to include the bol.com logo
 * 'cols'   = The number of columns to show the results in
 *
 *
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
?>
<?php $properties = isset($properties) ? $properties : array() ?>
<p>
    <label for="txtName"><span class="label">Naam:</span></label><input class="property" type="text" id="txtName" name="txtName" value=""><br/>
    <label for="txtSubid"><span class="label">SubId<span class="subLabel"> (Optioneel)</span>:</span></label><input class="property" type="text" id="txtSubid" name="txtSubid" value="">
</p>
<p>
    <?php if (in_array('title', $properties)) : ?>
    <label for="txtTitle"><span class="label">Titel:</span></label><input type="text" class="property" name="txtTitle" id="txtTitle" /><br/>
    <?php endif ?>
    <label for="txtBackgroundColor"><span class="label">Achtergrond:</span></label><input type="text" class="color property" name="txtBackgroundColor" id="txtBackgroundColor" value="FFFFFF"/><br/>
    <label for="txtTextColor"><span class="label">Tekst:</span></label><input type="text" class="color property" name="txtTextColor" id="txtTextColor" value="CB0100"/><br/>
    <label for="txtLinkColor"><span class="label">Link:</span></label><input type="text" class="color property" name="txtLinkColor" id="txtLinkColor" value="0000FF"/><br/>
    <label for="txtBorderColor"><span class="label">Rand:</span></label><input type="text" class="color property" name="txtBorderColor" id="txtBorderColor" value="D2D2D2"/><br/>
<?php if (in_array('width', $properties) || in_array('cols', $properties)) : ?>
<p>
    <?php if (in_array('width', $properties)) : ?>
    <span class="label">Breedte:</span><span id="widthDisplay">250</span>
    <input class="property hide" type="hidden" id="txtWidth" name="txtWidth" value="250" />
    <div class="slider" id="widthSlider"></div>
    <?php endif ?>
    <?php if (in_array('cols', $properties)) : ?>
    <span class="label">Kolommen:</span><span id="colsDisplay">1</span>
    <input class="property hide" type="hidden" id="txtCols" name="txtCols" value="1" />
    <div class="slider" id="colsSlider"></div>
    <?php endif ?>
</p>
<?php endif ?>
<!--    <label for="txtCols"><span class="label">Kolom:</span></label><input class="property" type="text" id="txtCols" name="txtCols" value="1" style="width: 50px">-->
</p>
<p>
    <?php if (in_array('header', $properties)) : ?>
    <input class="property" type="checkbox" name="chkBolheader" id="chkBolheader" checked/><label for="chkBolheader"><span class="label">Toon bol.com logo</span></label>
    <?php endif ?>
    <input class="property" type="checkbox" name="chkRating" id="chkRating" checked/><label for="chkRating"><span class="label">Toon sterren</span></label><br/>
    <input class="property" type="checkbox" name="chkPrice" id="chkPrice" checked/><label for="chkPrice"><span class="label">Toon prijs</span></label><br/>
    <br/>
    <span class="label labelOption">Link opent in:</span>
    <input class="property" type="radio" name="rbLinkTarget" id="rbLinkTarget1" value="1" checked/><label for="rbLinkTarget1" style="display: inline-block; width:100px;">Nieuw venster</label><input class="property" type="radio" name="rbLinkTarget" id="rbLinkTarget2" value="0"/><label for="rbLinkTarget2">Zelfde venster</label><br/>
    <span class="label labelOption">Formaat plaatje:</span>
    <input class="property" type="radio" name="rbImageSize" id="rbImageSize1" value="1" checked/><label for="rbImageSize1" style="display: inline-block; width:100px;">Groot</label><input class="property" type="radio" name="rbImageSize" id="rbImageSize2" value="0"/><label for="rbImageSize2">Klein</label>
</p>
<p>
<!--    <input class="property" type="checkbox" name="chkCustomCss" id="chkCustomCss"/><label for="chkCustomCss" ><span class="label" for="chkCustomCss">Toevoegen css</span></label><br />-->
<!--    <textarea name="txtCustomCss" id="txtCustomCss" cols="60" rows="5" class="hideElement property"></textarea>-->
</p>
