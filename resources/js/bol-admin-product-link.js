var productPage = 0;
var productFilterObj = [];

var BolProductDialog = {

    Items : null,
    product : null,

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

        // Fill the categories
        jQuery('#ddlBolCategory').after('<span class="loader" id="categories-loader"></span>');
        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-search.php?get=categories',
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
                BolProductDialog.calculateRowsCols();
            },
            stop: BolProductDialog.getProductPreview
        });
        jQuery('#colsSlider').slider({
            min: 1,
            max: 2,
            slide: function(event, ui) {
                jQuery('#colsDisplay').html(ui.value);
                jQuery('#txtCols').val(ui.value);
            },
            stop: BolProductDialog.getProductPreview
        });

        BolProductDialog.calculateRowsCols();
        BolProductDialog.initStyleUpdater();

        // Init the tabs
        jQuery('#tabs-container').tabs().fadeIn(300);

        // Disable the second tab by default
        jQuery('#tabs-container').tabs("disable", 1);

        // Attach event to the 'next-step' button and disable it by default
        jQuery('#next-step').click(function(){
            jQuery('#tabs-container').tabs("select", 1);
        }).attr("disabled", "disabled").addClass("disabled");

        jQuery('.bol_pml_box .pager .pagerLink').live('click', BolProductDialog.page);

        // Attach event handlers to search button and preview button
        jQuery('#apply-search').click(BolProductDialog.getProductSearch);
        jQuery('#apply-preview').click(BolProductDialog.getProductPreview);

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
            BolProductDialog.getProductPreview
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

        var properties = BolProductDialog._getProperties();

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
            var content = '[bol_product_links';
            for (var i in properties) {
                content += ' ' + i + '="' + properties[i] + '"';
            }
            content += ']\n';

            setTimeout(function(){
                tinyMCEPopup.execCommand("mceInsertContent", false, content);
                tinyMCEPopup.close();}, 500);
        }

    },

    /**
     * Collects the products associated with the search params
     * @return {Boolean}
     */
    getProductSearch : function(page) {

        var page = page > 0 ? page : 1;

        if (jQuery('#txtBolSearch').val() == '') {
            alert('Vul een trefwoord in');
            return false;
        }

        jQuery('#dvResults').html('<span class="loader">Producten worden geladen </span>');

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-search.php',
            type: 'post',
            data: {
                'text'      : jQuery("#txtBolSearch").val(),
                'category'  : jQuery("#ddlBolCategory").val(),
                'page'      : page
            },
            success: function(response) {
                jQuery("#dvResults").html(response);
                if (jQuery("#dvResults div.bol_pml_element").size() > 0) {
                    var inputValue = jQuery("#hdnBolProducts").val();
                    var productArray = inputValue.length ? inputValue.split(",") : [];
                    jQuery("#dvResults div.bol_pml_element").each(function() {
                        productId = jQuery(this).attr('rel');

                        var exists = false;
                        for(var i = 0; i < productArray.length; i++) {
                            if (productArray[i] == productId) {
                                exists = true;
                            };
                        }

                        if (exists) {
                            jQuery(this).css('opacity', '0.3');
                        }

                        var toggle = jQuery('<a href="#' + productId + '" title="Select product" class="toggle-product-icon"></a>');
                        toggle.click(BolProductDialog.toggleProduct);
                        jQuery(this).append(toggle);
                    });
                } else {
                    jQuery("#dvResults").html('<div class="productlist">No products found</div>');
                }
            }
        });

        return false;
    },

    page : function(event)
    {
        event.preventDefault();
        var page = (jQuery(event.target).attr('href').substr(1));

        BolProductDialog.getProductSearch(page);
        return false;
    },

    /**
     * Moves the product from result to selection list and back
     * @param event
     */
    toggleProduct : function(event) {
        event.preventDefault();

        id = $(this).attr('href').substr(1);

        var inputValue = jQuery("#hdnBolProducts").val();

        var productArray = inputValue.length ? inputValue.split(",") : [];
        var inSelected = false;

        // Find if it already exists in selected
        for (var i in productArray) {
            if (productArray[i] == id) {
                inSelected = true;
                break;
            }
        }

        var parent = jQuery(this).parents('#dvResults');

        if (inSelected && parent.length > 0) {
            return false;
        }

        var product = jQuery("#dvResults .bol_pml_element[rel="+id+"]");

        if (inSelected) { // in selected -> remove
            productArray.splice(i, 1);
            jQuery("#dvSelectedProducts .bol_pml_element[rel="+id+"]").next('.spacer').remove();
            jQuery("#dvSelectedProducts .bol_pml_element[rel="+id+"]").remove();
            if (product) {
                product.css('opacity', '1');
            }
        } else { // if not in selected array -> add
            productArray.push(id);
            var selectedProduct = product.clone(true);
            selectedProduct.find('a.toggle-product-icon').attr('title', 'Remove product');
            jQuery("#dvSelectedProducts .productlist .bol_pml_box_inner").append(selectedProduct);
            jQuery("#dvSelectedProducts .productlist .bol_pml_box_inner").append('<div class="clearer spacer"></div>');
            product.css('opacity', '0.3');
        }

        var productList = productArray.join(',');

        jQuery("#hdnBolProducts").val(productList);

        // Check if any product is selected
        if (productArray.length > 0) {
            jQuery('#tabs-container').tabs("enable", 1);
            jQuery('#next-step').removeAttr("disabled").removeClass("disabled");
            jQuery('#no-products-label').hide();
            jQuery('#selected-products-label').show();
        } else {
            jQuery('#no-products-label').show();
            jQuery('#selected-products-label').hide();
            jQuery('#tabs-container').tabs("disable", 1);
            jQuery('#next-step').attr("disabled", "disabled").addClass("disabled");
        }
    },

    getProductPreview : function() {

        var properties = BolProductDialog._getProperties();

        if (properties.limit > 25 || properties.limit < 1)
        {
            alert('Kies een limiet van 1-25');
            return false;
        }

        jQuery('#bol_previewParent').html('<span class="loader">Loading preview</span><div id="' + properties.block_id + '"></div>');

//        BolProductDialog.createStyle(properties, txtWidth, 230, 65);

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-products-widget.php',
            type: 'post',
            data: properties,
            success: function(response) {
                $('#bol_previewParent').html(response);
            }
        })

    },

    _getProperties : function()
    {
        var properties = {
            limit       : jQuery('#txtLimit').val(),
            block_id    : jQuery('#filename').val().replace('.css',''),
            products    : jQuery('#hdnBolProducts').val()
        };

        for (var i in BolProductDialog.properties) {

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

            properties[BolProductDialog.properties[i]] = val;
        }

        return properties;
    }
};

var bol_Pager = {
    productPage : 0,
    perPage : 5,

    //setup arrow and paginations
    setupPager : function(qvan, perPage) {

        bol_Pager.perPage = perPage;

        if (qvan <= QVAN) {
            jQuery(".pager ul").html("<li class='current'>1</li>");
            jQuery(".pager .amount").html(qvan);
            return;
        }

        bol_Pager.productPage = 0;

        var list = "";
        var pager = '<li><span title="vorige" class="previous">vorige</span></li>'+
            '<li><span title=" volgende" class="next"> volgende</span></li>';

        for (var i = 0; i < Math.ceil(qvan / perPage); i++) {
            list += "<li><span>" + (i + 1) + "</span></li>";
        }
        list += pager;

        jQuery(".pager ul").html(list);
        jQuery(".pager .amount").html(qvan);

        jQuery(".pager li").each(function() {
            jQuery(this).click(function() {
                bol_Pager.showProducts(jQuery("span", this).html());
            });
        });
    },

    showProducts : function(str) {

        //switch in paginations
        var pager = bol_Pager.productPage;
        switch (str) {
            case "next":
                pager++;
                break;

            case "prev":
                pager--;
                break;

            default:
                bol_Pager.productPage = Number(str) - 1;

        }

        bol_Pager.productPage = pager;

        //if first start add items to productFilterObj
        if (productFilterObj.length == 0) {
            jQuery("#dvResults .productlist li").each(function(index) {
                productFilterObj.push(jQuery(this));
            });
        }


        var pages = Math.ceil(productFilterObj.length / bol_Pager.perPage);
        var next = jQuery(".pager .next");
        var prev = jQuery(".pager .previous");

        //disable arrow button
        if (bol_Pager.productPage < 0) {
            bol_Pager.productPage = 0;
            return;
        }
        if (bol_Pager.productPage > pages - 1) {
            bol_Pager.productPage = pages - 1;
            return;
        }

        //hide all items and remove bottom line
        jQuery("#dvResults .productlist li").hide();
        jQuery("#dvResults .productlist li").removeClass("line");

        //show items by current page
        for (var i = 0; i<productFilterObj.length; i++) {
            if (i >= bol_Pager.productPage * bol_Pager.perPage && i < (bol_Pager.productPage + 1) * bol_Pager.perPage) {
                jQuery(productFilterObj[i]).show();
            }
        }


        //add line on bottom for evrey 3 items in visible elements
        var visible = jQuery("#dvResults .productlist li:visible");
        var stratIndex = 0;
        var currentIndex = 2;

        while (currentIndex < visible.length) {
            if (currentIndex != visible.length - 1) {
                for (var i = stratIndex; i <= currentIndex; i++) {
                    jQuery(visible[i]).addClass("line");
                }
            }
            stratIndex = currentIndex + 1;
            currentIndex = currentIndex + 3;
        }


        //show/hide arrow buttons
        next.each(function() {
            jQuery(this).addClass("disable");
        });
        prev.each(function() {
            jQuery(this).addClass("disable");
        });

        if (bol_Pager.productPage < pages - 1) {
            next.removeClass("disable");
        }
        if (bol_Pager.productPage > 0) {
            prev.removeClass("disable");
        }

        //select current page
        jQuery(".pages").each(function() {
            jQuery("li", this).each(function(index) {
                jQuery(this).removeClass("current");
                if (index == bol_Pager.productPage) {
                    jQuery(this).addClass("current");
                }
            });
        });
    }
}

if (typeof(tinyMCEPopup) !== 'undefined') {
    tinyMCEPopup.requireLangPack();
    tinyMCEPopup.onInit.add(BolProductDialog.init, BolProductDialog);
} else {
    jQuery(document).ready(BolProductDialog.init);
}
