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

class SearchForm extends Widget
{
    /**
     * @var array
     */
    protected static $defaultAttributes = array(
        'title' => '',
        'limit' => 5,
        'offset' => 0,
        'block_id' => null,
        'cat_id' => 0,
        'cat_select' => false,
        'default_search' => '',
        'name' => '',
        'sub_id' => '',
        'background_color' => 'FFFFFF',
        'text_color' => 'CB0100',
        'link_color' => '0000FF',
        'border_color' => 'D2D2D2',
        'width' => '250',
        'cols' => '1',
        'show_bol_logo' => true,
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
        parent::__construct('bol_partner_search_form', 'Bol.com Search Widget');
        add_shortcode('bol_search_form', array($this, 'handleContentCodes'));
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

        $html = '<a href="#%s" id="%s" onclick="bol_openPopupSearch(); return false;">Widget settings...</a><br/><br/>
            <div id="bol-search-form-widget-popup"></div>';

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

        $html = '<script type="text/javascript">' .
            'BolPartner_SearchForm = %s;' .
            'BolPartner.SearchForm.fillPlaceHolders(BolPartner_SearchForm);' .
            'BolPartner.SearchForm.init(BolPartner_SearchForm);' .
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

        $this->addPlaceHolder($attributes);

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
        $url = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/popup/search-form.php?widget=' . $id;

        if($fileName == 'widgets.php') : ?>
        <script type="text/javascript">
            function bol_openPopupSearch() {

                jQuery("#bol-search-form-widget-popup").html(
                    '<div id="dvPopupDialog" class="bol-popup-dialog">'
                        + '<iframe src="<?php echo $url ?>"></iframe>'
                        + '</div>'
                );
                jQuery("#dvPopupDialog").dialog({
                    title: "Bol.com Search-form widget settings",
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
        <?php endif;
    }
}
