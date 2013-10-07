(function(){

    tinymce.create('tinymce.plugins.bolpartnerplugin',{

        _pluginFunctions : {
            'product-link'  : 'BolCom.product-link',
            'bestsellers'   : 'BolCom.bestsellers',
            'search-form'   : 'BolCom.search-form'
        },

        _pluginHeight: {
            'product-link'  : '800',
            'bestsellers'   : '800',
            'search-form'   : '840'
        },

        _pluginWidth: {
            'product-link'  : '960',
            'bestsellers'   : '960',
            'search-form'   : '960'
        },

        _cache : {
            menu: {}
        },

        init : function(ed, url)
        {
            var t = this;

            t.pluginRoot = url + '/../../../';

            ed.addCommand(
                'bolpartnerplugin',
                function(ui, val)
                {
                    var script = t.pluginRoot + 'src/ajax/popup/' + val + '.php';
                    ed.windowManager.open(
                        {
                            file        : script,
                            width       : t._pluginWidth[val],
                            height      : t._pluginHeight[val],
                            inline      : 1,
                            auto_focus  : 0
                        },
                        {
                            plugin_url  : url
                        }
                    );
                }
            );

            ed.addButton(
                'bolpartnerplugin',
                {
                    title   : 'BolCom.button-description',
                    cmd     : 'bolpartnerplugin',
                    image   : t.pluginRoot + 'resources/images/bol.gif'
                }
            );

            ed.onInit.add(
                function()
                {
                    if (ed.settings.content_css !== false) {
                        var cssUrl = t.pluginRoot + 'resources/css/tinymce/button.css';
                        dom = ed.windowManager.createInstance('tinymce.dom.DOMUtils', document);
                        dom.loadCSS(cssUrl);
                        ed.dom.loadCSS(cssUrl);
                    }
                }
            );
        },

        getInfo : function()
        {
            return {
                longname    : 'Bol.com Product Links',
                author      : 'Netvlies Internet',
                authorurl   : 'http://www.netvlies.nl',
                infourl     : 'http://www.netvlies.nl'
            };
        },

        createControl : function(n, cm)
        {
            var t = this,
                menu = t._cache.menu,
                c,ed = tinyMCE.activeEditor,
                each = tinymce.each;

            if (n != 'bolpartnerplugin') {
                return null;
            }

            c = cm.createSplitButton(
                n,
                {
                    cmd     : '',
                    scope   : t,
                    title   : 'BolCom.button-description',
                    image   : t.pluginRoot + 'resources/images/bol.gif'
                }
            );

            c.onRenderMenu.add(
                function(c, m)
                {
                    m.add({'class' : 'mceMenuItemTitle', title : 'BolCom.functions'}).setDisabled(1);
                    each(t._pluginFunctions, function(value, key) {
                        var o = {icon : 0},
                            mi;

                        o.onclick = function() {
                            ed.execCommand('bolpartnerplugin', true, key);
                        };

                        o.title = value;
                        mi = m.add(o);
                        menu[key] = mi;
                    });

                    t._selectMenu(ed);
                });

                return c;
        },

        _selectMenu:function(ed)
        {
            var fe = ed.selection.getNode(),
                each = tinymce.each,
                menu = this._cache.menu;

            each(this.shortcodes, function(value,key) {
                if (typeof menu[key] == 'undefined' || !menu[key]) {
                    return;
                }
                menu[key].setSelected(ed.dom.hasClass(fe, key));
            });
        }
    });

    tinymce.PluginManager.add('bolpartnerplugin', tinymce.plugins.bolpartnerplugin);
})();
