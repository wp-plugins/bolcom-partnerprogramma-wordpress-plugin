<?php
/**
 * SelectedProducts Widget
 * Handles the widget display and wp shortcodes
 *
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace BolPartnerPlugin\Widgets;

class SelectedProducts extends Widget
{
    /**
     * @var array
     */
    protected static $defaultAttributes = array(
        'title' => '',
        'block_id' => null,
        'products' => '',
        'name' => '',
        'sub_id' => '',
        'background_color' => 'FFFFFF',
        'text_color' => 'CB0100',
        'link_color' => '0000FF',
        'border_color' => 'D2D2D2',
        'width' => '250',
        'cols' => '1',
        'show_bol_logo' => false,
        'show_price' => true,
        'show_rating' => true,
        'link_target' => '1',
        'image_size' => '1',
        'custom_css' => false,
        'custom_css_style' => '',
    );

    /**
     * @var array
     */
    protected $placeHolders = array();

    /**
     * @return array
     */
    public static function getDefaultAttributes()
    {
        return self::$defaultAttributes;
    }

    /**
     * Constructor
     */
    public function __construct() {
        parent::__construct('bol_partner_selected_products', 'Bol.com Products Widget');
        add_shortcode('bol_product_links', array($this, 'handleContentCodes'));
        add_action('admin_head', array($this, 'getAdminHead'));
        add_action('wp_footer', array($this, 'outputContentCodesJson'));
    }

    /**
     * @see WP_Widget::widget\
     */
    public function widget($args, $instance) {
        echo $this->handleContentCodes($instance);
    }

    /**
     * @see WP_Widget::form
     */
    public function form($instance) {
        parent::form($instance);

        $id = $this->option_name . '-' . $this->number;

        $html = '<a href="#%s" id="%s" onclick="bol_openPopupSelected(); return false;">Widget settings...</a><br/><br/>
            <div id="bol-selected-products-widget-popup"></div>';

        echo sprintf($html, $id, $id);
    }

    /**
     * Creates the javascript for forming the placeholders to real Bol.com
     * product lists
     *
     * @return string
     */
    public function outputContentCodesJson()
    {
        if (empty($this->placeHolders)) {
            return '';
        }

        $jsonStrings = json_encode($this->placeHolders);

        $src = BOL_PARTNER_PLUGIN_PATH . '/resources/js/bol-partner-frontend.js';
        $html = '<script type="text/javascript" src="' . $src . '"></script>';
        $html .= '<script type="text/javascript">' .
            'BolPartner_SelectedProducts = %s;' .
            'BolPartner.SelectedProducts.fillPlaceHolders(BolPartner_SelectedProducts);' .
            '</script>' . PHP_EOL;
        echo sprintf($html, $jsonStrings);
    }

    /**
     * @param $attributes
     * @param null $content
     * @param string $code
     * @return bool|string
     */
    public function handleContentCodes($attributes, $content=null, $code="")
    {
        $attributes = $this->filterShortCodes($attributes);

        if (! isset($attributes['block_id'])) {
            return false;
        }

        $attributes['show_bol_logo'] = '0'; // explicit

        $this->addPlaceHolder($attributes);

        require($_SERVER['DOCUMENT_ROOT'].'/wp-load.php');
        $upload_dir = wp_upload_dir();

        $dir = $upload_dir['baseurl'] . '/bol-css/';
        $attributes['css_file'] = $dir . $attributes['css_file'];

        // @todo: format the placeholders more to accomodate look and feel before ajax call!

        return sprintf(
            '<div class="BolPartner_SelectedProducts_PlaceHolder" id="%s"></div>',
            $attributes['block_id']
        );
    }

    /**
     * @param array $attributes
     * @return array
     */
    protected function filterShortCodes(array $attributes)
    {
        return shortcode_atts(self::$defaultAttributes, $attributes);
    }

    /**
     * @param array $attributes
     * @return SelectedProducts
     */
    protected function addPlaceHolder(array $attributes)
    {
        $this->placeHolders[$attributes['block_id']] = $attributes;
        return $this;
    }

    /**
     * Creates the javascript for the admin head to display
     * the config dialog on the Widgets page.
     */
    public function getAdminHead()
    {
        $fileUrl = explode('/', $_SERVER["PHP_SELF"]);
        $fileName = end($fileUrl);

        $id = $this->option_name . '-' . $this->number;
        $url = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/popup/product-link.php?widget=' . $id;

        if($fileName == 'widgets.php'){ ?>
        <script type="text/javascript">
            function bol_openPopupSelected() {

                jQuery("#bol-selected-products-widget-popup").html(
                    '<div id="dvPopupDialog" class="bol-popup-dialog">'
                        + '<iframe src="<?php echo $url ?>"></iframe>'
                        + '</div>'
                );
                jQuery("#dvPopupDialog").dialog({
                    title: "bol.com Products widget settings",
                    autoOpen: true,
                    modal: true,
                    resizable: false,
                    width: "auto",
                    close: function() {
                        jQuery("#dvPopupDialog").dialog('destroy').remove();
                    }
                });

            }
        </script>
        <?}
    }

}
