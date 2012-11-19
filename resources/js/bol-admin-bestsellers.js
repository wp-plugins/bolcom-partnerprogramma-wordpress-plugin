var productPage = 0;
var productFilterObj = [];

var BolBestsellersDialog = {

    Items : null,
    product : null,
    bolSearchLink : '',

    // the display property options
    properties : {
        'txtName'               : 'name',
        'txtSubid'              : 'sub_id',
        'txtTitle'              : 'title',
        'txtBackgroundColor'    : 'background_color',
        'txtTextColor'          : 'text_color',
        'txtLinkColor'          : 'link_color',
        'txtBorderColor'        : 'border_color',
        'txtWidth'              : 'width',
        'txtCols'               : 'cols',
        'chkBolheader'          : 'show_bol_logo',
        'chkPrice'              : 'show_price',
        'chkRating'             : 'show_rating',
        'rbLinkTarget'          : 'link_target',
        'rbImageSize'           : 'image_size'
    },

    init : function() {

        // search.php link
        BolBestsellersDialog.bolSearchLink = bol_partner_plugin_base + '/src/ajax/bol-search.php';

        // Fill the categories and set the change handlers
        jQuery('#ddlBolCategory').after('<span class="loader" id="categories-loader"></span>');
        jQuery.ajax({
            url: BolBestsellersDialog.bolSearchLink + '?get=selected-categories',
            type: 'post',
            data: {},
            success: function(response) {
                jQuery("#categories-loader").remove();
                jQuery("#ddlBolCategory").append(response);
            }
        });

        jQuery('#widthSlider').slider({
            min: 180,
            max: 800,
            value: jQuery('#txtWidth').val(),
            slide: function(event, ui) {
                jQuery('#txtWidth').val(ui.value);
                BolBestsellersDialog.calculateRowsCols();
            },
            stop: BolBestsellersDialog.getProductPreview
        });
        jQuery('#txtWidth').blur(function (event) {
            jQuery('#widthSlider').slider("value", jQuery('#txtWidth').val());
            BolBestsellersDialog.calculateRowsCols();
        });

        jQuery('#colsSlider').slider({
            min: 1,
            max: 2,
            value: jQuery('#txtCols').val(),
            slide: function(event, ui) {
                jQuery('#txtCols').val(ui.value);
            },
            stop: BolBestsellersDialog.getProductPreview
        });
        jQuery('#txtCols').blur(function (event) {
            jQuery('#colsSlider').slider("value", jQuery('#txtCols').val());
            BolBestsellersDialog.calculateRowsCols();
        });

        BolBestsellersDialog.calculateRowsCols();
        BolBestsellersDialog.initStyleUpdater();

        $("#ddlBolCategory").change(function() {
            BolBestsellersDialog.loadSubCategories('ddlBolCategory', 'BolSubCategory');
        });
        $("#ddlBolSubCategory").change(function() {
            BolBestsellersDialog.loadSubCategories('ddlBolSubCategory', 'BolSub2Category');
        });
        $("#ddlBolSub2Category").change(function() {
            BolBestsellersDialog.loadSubCategories('ddlBolSub2Category', 'BolSub3Category');
        });

        // Attach event handlers to preview button
        jQuery('#apply-preview').click(BolBestsellersDialog.getProductPreview);

        jQuery('#chkCustomCss').click(function() {
            if ($(this).attr('checked')) {
                jQuery('#txtCustomCss').removeClass('hideElement');
            } else {
                jQuery('#txtCustomCss').addClass('hideElement');
                jQuery('#txtCustomCss').val('');
            }
        });

        jQuery('.triggerPreview').change(BolBestsellersDialog.getProductPreview);
    },

    initStyleUpdater : function() {
        jQuery('#chkRating').click(function() { jQuery('span.rating').toggleClass('hide'); });
        jQuery('#chkPrice').click(function() { jQuery('.bol_pml_price').toggleClass('hide'); });

        jQuery('#txtTextColor').change(function() {
            jQuery('.bol_pml_box').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtLinkColor').change(function() {
            jQuery('.bol_pml_box a.title').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtBackgroundColor').change(function() {
            jQuery('.bol_pml_box').css('background-color', '#' + jQuery(this).val());
        });

        jQuery('#txtBorderColor').change(function() {
            jQuery('.bol_pml_box').css('border-color', '#' + jQuery(this).val());
        });

        jQuery('input[name="rbImageSize"]').click(
            BolBestsellersDialog.getProductPreview
        );
    },

    calculateRowsCols: function(){

        nrOfItems = jQuery('#txtLimit').val();

        // get max available columns
        cols = Math.floor(jQuery('#txtWidth').val() / 180);
        if(cols == 0){
            cols = 1;
        } else if(cols > nrOfItems){
            cols = nrOfItems;
        }

        // enable or disable the columns slider
        if(cols <= 1){
            jQuery('#colsSlider').slider('disable');
            jQuery('#colsSlider').slider('value', 1);
            jQuery('#colsSlider').slider('max', 1);
            jQuery('#colsDisplay').html(1);
            jQuery('#txtCols').val(1);
            return;
        }

        jQuery('#colsSlider').slider('enable');
        jQuery('#colsSlider').slider('option', 'max', cols);

        var currentColValue = jQuery('#txtCols').val();
        if (currentColValue > cols) {
            jQuery('#colsDisplay').html(cols);
            jQuery('#txtCols').val(cols);
        } else {
            jQuery('#colsSlider').slider('value', currentColValue);
        }
    },

    insert : function(widget) {

        var properties = BolBestsellersDialog._getProperties();

        if (properties.name.length < 1) {
            alert('Het invullen van een "naam" is verplicht');
            return false;
        }

        if (widget) {
            var url = bol_partner_plugin_base + '/src/ajax/save-widget-data.php';
            properties.widget = jQuery('#widget').val();

            jQuery.post(url, properties, function(response){
                if (response == 'success') {
                    jQuery("#save-result").html('Changes saved.');
                } else {
                    alert('Saving error');
                }
            })
        } else {
            var content = '[bol_bestsellers';
            for (var i in properties) {
                content += ' ' + i + '="' + properties[i] + '"';
            }
            content += ']\n';

            setTimeout(function(){
                tinyMCEPopup.execCommand("mceInsertContent", false, content);
                tinyMCEPopup.close();}, 500);
        }
    },

    updateProduct : function( id ) {
    },

    getProductPreview : function() {

        var properties = BolBestsellersDialog._getProperties();

        if (properties.limit > 25 || properties.limit < 1)
        {
            alert('Kies een limiet van 1-25');
            return false;
        }

        jQuery('#bol_previewParent').html('<span class="loader">Loading preview</span><div id="' + properties.block_id + '"></div>');

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-bestsellers-widget.php',
            type: 'post',
            data: properties,
            success: function(response) {
                $('#bol_previewParent').html(response);
            }
        })
    },

    loadSubCategories : function(main, sub)
    {
        var val = jQuery('#'+main+' option:selected').val();

        jQuery("#ddl"+sub).next('span.loader').removeClass('hideElement');

        jQuery.ajax({
            url: BolBestsellersDialog.bolSearchLink + "?get=selected-categories"+"&parentId="+val,
            type: 'post',
            data: {},
            success: function(response) {
                jQuery("#ddl" + sub).removeAttr('disabled');
                if (sub.search('SubCategory') >= 0) {
                    jQuery("#ddl"+sub).html("<option value='0'>- Selecteer categorie -</option>"+response);
                } else {
                    jQuery("#ddl"+sub).html("<option value='0'>- Selecteer subcategorie -</option>"+response);
                }
                jQuery("#ddl"+sub).next('span.loader').addClass('hideElement');
            }
        });
    },

    _getProperties : function()
    {
        var properties = {
            limit       : jQuery('#txtLimit').val(),
            block_id    : jQuery('#blockId').val(),
            cat_id      : BolBestsellersDialog._getSelectedCategory()
        };

        for (var i in BolBestsellersDialog.properties) {
            var id = '.property[name="' + i + '"]';
            var type = jQuery(id).attr('type');
            var val;
            if (type == 'checkbox') {
                val = jQuery(id).attr('checked') ? 1 : 0;
            } else if (type == 'radio') {
                val = jQuery(id + ':checked').val();
            } else {
                val = jQuery(id).val();
            }

            properties[BolBestsellersDialog.properties[i]] = val;
        }

        return properties;
    },

    _getSelectedCategory : function()
    {
        var selects = ['#ddlBolCategory', '#ddlBolSubCategory', '#ddlBolSub2Category', '#ddlBolSub3Category'];

        var catId = 0;
        for (var i in selects) {
            var val = jQuery(selects[i]).val();

            if (val > 0) {
                catId = val;
            } else {
                break;
            }
        }

        var priceRange = jQuery('#priceRangeList').val();
        if ((catId > 0) && parseInt(priceRange)) {
            catId += '+' + priceRange;
        }

        return catId;
    }
};

if (typeof(tinyMCEPopup) !== 'undefined') {
    tinyMCEPopup.requireLangPack();
    tinyMCEPopup.onInit.add(BolBestsellersDialog.init, BolBestsellersDialog);
} else {
    jQuery(document).ready(BolBestsellersDialog.init);
}
