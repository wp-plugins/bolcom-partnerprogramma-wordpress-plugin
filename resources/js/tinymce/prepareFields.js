function showcssFunc(el) {
    if (el.attr('checked')) {
        jQuery('#labelCssstyle').removeClass('hideElement');
    } else {
        jQuery('#labelCssstyle').addClass('hideElement');
        jQuery('#cssstyle').val('');
    }
}

function hideSub(name) {
    jQuery("#label"+name).addClass('hideElement');
    jQuery("#ddl"+name).html("<option value='0'></option>");
}

function loadSubctg(main, sub) {
    if (sub.indexOf('BolSubCategory') >= 0) {
        hideSub(sub.replace('BolSubCategory', 'BolSub2Category'));
        hideSub(sub.replace('BolSubCategory', 'BolSub3Category'));
    } else if (sub.indexOf('BolSub2Category') >= 0) {
        hideSub(sub.replace('BolSub2Category', 'BolSub3Category'));
    }

    var val = jQuery('#'+main+' option:selected').val();
    if (val == 0 && !jQuery("#label"+sub).hasClass('hideElement')) {
        hideSub(sub);
    } else {
        jQuery("#ddl"+sub).addClass('hideElement');
        jQuery("#label"+sub).removeClass('hideElement');
        jQuery("#label"+sub+' .loader').removeClass('hideElement');

        jQuery.ajax({
            url: "/wp-content/plugins/bol/bol-search.php?get=categories"+"&parentId="+val,
            type: 'post',
            data: {},
            success: function(response) {
                if (sub.search('SubCategory') >= 0) {
                    jQuery("#ddl"+sub).html("<option value='0'>- Selecteer categorie -</option>"+response);
                } else {
                    jQuery("#ddl"+sub).html("<option value='0'>- Selecteer subcategorie -</option>"+response);
                }
                jQuery("#label"+sub+' .loader').addClass('hideElement');
                jQuery("#ddl"+sub).removeClass('hideElement');
            }
        });
    }
}

jQuery("iframe", top.document).load(function () {
    jQuery('.colorpickerfield').ColorPicker({
        onSubmit: function(hsb, hex, rgb, el) {
            jQuery(el).val(hex).change();
            jQuery(el).ColorPickerHide();
        },
        onBeforeShow: function () {
            jQuery(this).ColorPickerSetColor(this.value);
        }
    }).bind('keyup', function(){
            jQuery(this).ColorPickerSetColor(this.value);
    });
});

jQuery(document).ready(function(){
    jQuery('input[name=bolSearchField]').live('focus', function(){
        if (!jQuery(this).is('[old-value]')) {
            jQuery(this).attr('old-value', jQuery(this).val());
            jQuery(this).val('');
        }
    });
    jQuery('input[name=bolSearchField]').live('blur', function(){
        if ('' == jQuery(this).val()) {
            jQuery(this).val(jQuery(this).attr('old-value'));
            jQuery(this).removeAttr('old-value');
        }
    });
});
