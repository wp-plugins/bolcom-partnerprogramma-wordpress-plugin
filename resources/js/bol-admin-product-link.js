var productPage = 0;
var productFilterObj = [];

var BolProductDialog = {

    Items : null,
    product : null,

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

        // Fill the categories
        jQuery('#ddlBolCategory').after('<span class="loader" id="categories-loader"></span>');
        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-search.php?get=categories',
            type: 'post',
            data: {},
            success: function(response) {
                jQuery("#categories-loader").remove();

                // Check the result of the response
                if (response.indexOf('option') != -1) {
                    jQuery("#ddlBolCategory").append(response);
                } else {
                    // Error in the response, add the error
                    jQuery('h4').after(response);
                }
            }
        });

        jQuery('#widthSlider').slider({
            min: 180,
            max: 800,
            value: jQuery('#txtWidth').val(),
            slide: function(event, ui) {
                jQuery('#txtWidth').val(ui.value);
                BolProductDialog.calculateRowsCols();
            },
            stop: BolProductDialog.getProductPreview
        });
        jQuery('#txtWidth').blur(function (event) {
            jQuery('#widthSlider').slider("value", jQuery('#txtWidth').val());
            BolProductDialog.calculateRowsCols();
        });

        jQuery('#colsSlider').slider({
            min: 1,
            max: 2,
            value: jQuery('#txtCols').val(),
            slide: function(event, ui) {
                jQuery('#txtCols').val(ui.value);
            },
            stop: BolProductDialog.getProductPreview
        });
        jQuery('#txtCols').blur(function (event) {
            jQuery('#colsSlider').slider("value", jQuery('#txtCols').val());
            BolProductDialog.calculateRowsCols();
        });

        BolProductDialog.calculateRowsCols();
        BolProductDialog.initStyleUpdater();

        $( "#tabs-container" ).bind( "tabsselect", function(event, ui) {
            if (ui.tab.hash == '#tab-widget') {
                BolProductDialog.getProductPreview();
            }
        });

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
        jQuery('#txtBolSearch').keypress(function(event) {
            if ( event.which == 13 ) {
                event.preventDefault();
                BolProductDialog.getProductSearch(event);
            }
        });
        jQuery('#apply-preview').click(BolProductDialog.getProductPreview);

        jQuery('.triggerPreview').change(BolProductDialog.getProductPreview);

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
            alert(i10n.requiresearchword);
            return false;
        }

        jQuery('#dvResults').html('<span class="loader">' + i10n.productsareloaded + '</span>');

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
                    jQuery("#dvResults").html('<div class="productlist">' + response + '</div>');
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

        jQuery('#bol_previewParent').html('<span class="loader">' + i10n.loadpreview + '</span><div id="' + properties.block_id + '"></div>');

        jQuery.ajax({
            url: bol_partner_plugin_base + '/src/ajax/bol-products-widget.php',
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
            block_id    : jQuery('#blockId').val(),
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

        // Add extra property so on the server side we can identify this was a preview call
        properties['admin_preview'] = 1;

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
