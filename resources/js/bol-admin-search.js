var productPage = 0;
var productFilterObj = [];

var BolSearchDialog = {

    Items : null,
    product : null,
    bolSearchLink : '',

    // the display property options
    properties : {
        'txtName'               : 'name',
        'txtSubid'              : 'sub_id',
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
        BolSearchDialog.bolSearchLink = bol_partner_plugin_base + '/src/ajax/bol-search.php';

        // Fill the categories and set the change handlers
        jQuery('#ddlBolCategory').after('<span class="loader" id="categories-loader"></span>');
        jQuery.ajax({
            url: BolSearchDialog.bolSearchLink + '?get=selected-categories',
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
            slide: function(event, ui) {
                jQuery('#widthDisplay').html(ui.value);
                jQuery('#txtWidth').val(ui.value);
                BolSearchDialog.calculateRowsCols();
            },
            stop: BolSearchDialog.getProductPreview
        });
        jQuery('#colsSlider').slider({
            min: 1,
            max: 2,
            slide: function(event, ui) {
                jQuery('#colsDisplay').html(ui.value);
                jQuery('#txtCols').val(ui.value);
            },
            stop: BolSearchDialog.getProductPreview
        });

        BolSearchDialog.calculateRowsCols();
        BolSearchDialog.initStyleUpdater();

        // Attach event handlers to preview button
        jQuery('#apply-preview').click(BolSearchDialog.getProductPreview);

        jQuery('#chkCustomCss').click(function() {
            if ($(this).attr('checked')) {
                jQuery('#txtCustomCss').removeClass('hideElement');
            } else {
                jQuery('#txtCustomCss').addClass('hideElement');
                jQuery('#txtCustomCss').val('');
            }
        });

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
            BolSearchDialog.getProductPreview
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

        var properties = BolSearchDialog._getProperties();

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
            var content = '[bol_search_form';
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

        var properties = BolSearchDialog._getProperties();

        if (properties.limit > 25 || properties.limit < 1)
        {
            alert('Please, enter a limit from 1-25');
            return false;
        }

//        BolSearchDialog.createStyle(properties, txtWidth, 230, 65);

        jQuery('#bol_previewParent').html('<span class="loader">Loading preview</span><div id="' + properties.block_id + '"></div>');

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-search-form-widget.php',
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
            url: BolSearchDialog.bolSearchLink + "?get=categories"+"&parentId="+val,
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
            limit           : jQuery('#txtLimit').val(),
            block_id        : jQuery('#filename').val().replace('.css',''),
            cat_id          : BolSearchDialog._getSelectedCategory(),
            cat_select      : jQuery('input[name="rbShowCat"]:checked').val(),
            default_search  : jQuery('#txtSearch').val()
        };

        for (var i in BolSearchDialog.properties) {
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

            properties[BolSearchDialog.properties[i]] = val;
        }

        return properties;
    },

    _getSelectedCategory : function()
    {
        return jQuery('#ddlBolCategory').val();
    }
};

if (typeof(tinyMCEPopup) !== 'undefined') {
    tinyMCEPopup.requireLangPack();
    tinyMCEPopup.onInit.add(BolSearchDialog.init, BolSearchDialog);
} else {
    jQuery(document).ready(BolSearchDialog.init);
}
