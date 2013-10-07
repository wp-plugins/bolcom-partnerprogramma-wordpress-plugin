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
        'txtTitleColor'         : 'link_color',
        'txtSubtitleColor'      : 'subtitle_color',
        'txtPriceTypeColor'     : 'pricetype_color',
        'txtPriceColor'         : 'price_color',
        'txtDeliveryTimeColor'  : 'deliverytime_color',
        'txtBackgroundColor'    : 'background_color',
        'txtBorderColor'        : 'border_color',
        'txtWidth'              : 'width',
        'txtCols'               : 'cols',
        'chkBolheader'          : 'show_bol_logo',
        'chkPrice'              : 'show_price',
        'chkRating'             : 'show_rating',
        'chkDeliveryTime'       : 'show_deliverytime',
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

                // Check the result of the response
                if (response.indexOf('option') != -1) {
                    jQuery("#ddlBolCategory").append(response);
                } else {
                    // Error in the response, add the error
                    alert(response);
                }

            }
        });

        jQuery('#widthSlider').slider({
            min: 180,
            max: 800,
            value: jQuery('#txtWidth').val(),
            slide: function(event, ui) {
                jQuery('#txtWidth').val(ui.value);
                BolSearchDialog.calculateRowsCols();
            },
            stop: BolSearchDialog.getProductPreview
        });
        jQuery('#txtWidth').blur(function (event) {
            jQuery('#widthSlider').slider("value", jQuery('#txtWidth').val());
            BolSearchDialog.calculateRowsCols();
        });

        jQuery('#colsSlider').slider({
            min: 1,
            max: 2,
            value: jQuery('#txtCols').val(),
            slide: function(event, ui) {
                jQuery('#txtCols').val(ui.value);
            },
            stop: BolSearchDialog.getProductPreview
        });
        jQuery('#txtCols').blur(function (event) {
            jQuery('#colsSlider').slider("value", jQuery('#txtCols').val());
            BolSearchDialog.calculateRowsCols();
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

        jQuery('.triggerPreview').change(BolSearchDialog.getProductPreview);
    },

    initStyleUpdater : function() {
        jQuery('#ddlBolCategory').change(function() {

            // Link the dropdown values to the correct category
            // This link determines which add array shown
            var categories = {
                'audio_navigatie' : [4005, 10714],
                'baby' : [11271],
                'boeken_int' : [8292, 8296, 8294, 8298, 8297, 8299],
                'boeken_nl' : [8293, 8299],
                'camera' : [4781],
                'computer' : [4770, 10455, 10460, 7142, 7000, 7068, 3134],
                //'crosscategorie' : [],
                'dier_tuin_klussen' : [12748, 13155, 12974],
                'dvd' : [3133],
                'ebooks' : [8299],
                'elektronica' : [4006, 10715, 4663, 7291, 7894, 3136],
                'games' : [3135],
                'home_entertainment' : [3136],
                'huishoudelijk' : [10759, 11057],
                'koken_tafelen_huishouden' : [10768, 11764],
                'mooi_en_gezond' : [10823, 12382],
                'muziek' : [3132],
                'speelgoed' : [7934],
                'telefoon_tablet' : [8349, 10656, 3137],
                'wonen' : [14035]
            };

            var addCategory = new Array();
            var selectedValue = jQuery('#ddlBolCategory').val();
            for (var key in categories) {

                categoryGroup = categories[key];

                for (var categoryKey in categoryGroup) {
                    categoryId = categoryGroup[categoryKey];
                    if (selectedValue == categoryId) {
                        addCategory[key] = key;
                    }
                }
            }

            // Hide all adds
            jQuery('.add').addClass('hide');

            // Remove the hide from the adds that should be shown
            for (var key in addCategory) {
                var key = '.add.' + addCategory[key];
                jQuery(key).removeClass('hide');
            }

            jQuery('.promotions').removeClass('hide');
        });

        jQuery('.hndle').click(function() {
           jQuery('.adds').toggleClass('hide');
        })

        jQuery('#chkBolheader').click(function() { jQuery('.BolWidgetLogo').toggleClass('hide'); });
        jQuery('#chkRating').click(function() { jQuery('span.rating').toggleClass('hide'); });
        jQuery('#chkPrice').click(function() { jQuery('.bol_pml_price').toggleClass('hide'); });
        jQuery('#chkDeliveryTime').click(function() { jQuery('.bol_available').toggleClass('hide'); });

        jQuery('#txtTitleColor').change(function() {
            jQuery('.bol_pml_box .bol_pml_box_inner .product_details_mini .title').css('color', '#' + jQuery(this).val());
            jQuery('.bol_pml_box .pager a').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtSubtitleColor').change(function() {
            jQuery('.bol_pml_box .bol_pml_box_inner .product_details_mini .subTitle').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtPriceTypeColor').change(function() {
            jQuery('.bol_pml_box .bol_pml_box_inner .product_details_mini .bol_pml_price .bol_pml_price_type').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtPriceColor').change(function() {
            jQuery('.bol_pml_box .bol_pml_box_inner .product_details_mini .bol_pml_price').css('color', '#' + jQuery(this).val());
        });

        jQuery('#txtDeliveryTimeColor').change(function() {
            jQuery('.bol_pml_box .bol_pml_box_inner .product_details_mini .bol_available').css('color', '#' + jQuery(this).val());
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
            alert(i10n.requirename);
            return false;
        }

        if (widget) {
            var url = bol_partner_plugin_base + '/src/ajax/save-widget-data.php';
            properties.widget = jQuery('#widget').val();

            jQuery.post(url, properties, function(response){
                if (response == 'success') {
                    jQuery("#save-result").html(i10n.changessaved);
                } else {
                    alert(i10n.savingerror);
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
            alert(i10n.chooselimit)
            return false;
        }

        jQuery('#bol_previewParent').html('<span class="loader">' + i10n.loadpreview + '</span><div id="' + properties.block_id + '"></div>');

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-search-form-widget.php',
            type: 'post',
            data: properties,
            success: function(response) {
                $('#bol_previewParent').html(response);

                // Make sure the correct fields are hidden
                for(var key in properties) {
                    var value = properties[key];
                    if (key == 'show_bol_logo' && properties[key] == 0) {
                        jQuery('.BolWidgetLogo').toggleClass('hide');
                    }
                    if (key == 'show_rating' && properties[key] == 0) {
                        jQuery('span.rating').toggleClass('hide');
                    }
                    if (key == 'show_price' && properties[key] == 0) {
                        jQuery('.bol_pml_price').toggleClass('hide');
                    }
                    if (key == 'show_deliverytime' && properties[key] == 0) {
                        jQuery('.bol_available').toggleClass('hide');
                    }
                }
            }
        })
    },

    _getProperties : function()
    {
        var properties = {
            limit           : jQuery('#txtLimit').val(),
            block_id        : jQuery('#blockId').val(),
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

        // Add extra property so on the server side we can identify this was a preview call
        properties['admin_preview'] = 1;

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
