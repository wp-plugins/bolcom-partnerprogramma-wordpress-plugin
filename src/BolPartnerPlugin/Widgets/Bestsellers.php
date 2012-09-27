<?php
/**
 * Bestsellers Widget
 * Handles the widget display and wp shortcodes
 * @todo: refactor generic parts and move javascript creation to unobtrusive
 *
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace BolPartnerPlugin\Widgets;

class Bestsellers extends Widget
{
    /**
     * @var array
     */
    protected static $defaultAttributes = array(
        'title'             => '',
        'limit'             => 5,
        'block_id'          => null,
        'cat_id'            => null,
        'name'              => '',
        'sub_id'            => null,
        'background_color'  => 'FFFFFF',
        'text_color'        => 'CB0100',
        'link_color'        => '0000FF',
        'border_color'      => 'D2D2D2',
        'width'             => '250',
        'cols'              => '1',
        'show_bol_logo'     => true,
        'show_price'        => true,
        'show_rating'       => true,
        'link_target'       => '1',
        'image_size'        => '1',
        'custom_css'        => false,
        'custom_css_style'  => '',
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
        parent::__construct('bol_partner_bestsellers', 'Bol.com Bestsellers Widget');
        add_shortcode('bol_bestsellers', array($this, 'handleContentCodes'));
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

        $html = '<a href="#%s" id="%s" onclick="bol_openPopupBestsellers(); return false;">Widget settings...</a><br/><br/>
            <div id="bol-bestsellers-widget-popup"></div>';

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
            'BolPartner_Bestsellers = %s;' .
            'BolPartner.Bestsellers.fillPlaceHolders(BolPartner_Bestsellers);' .
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
            '<div class="BolPartner_Bestsellers_PlaceHolder" id="%s"></div>',
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
        $url = BOL_PARTNER_PLUGIN_PATH . '/src/ajax/popup/bestsellers.php?widget=' . $id;

        if($fileName == 'widgets.php') : ?>
        <script type="text/javascript">
            function bol_openPopupBestsellers() {
                jQuery("#bol-bestsellers-widget-popup").html(
                    '<div id="dvPopupDialog" class="bol-popup-dialog">'
                        + '<iframe src="<?php echo $url ?>"></iframe>'
                        + '</div>'
                );
                jQuery("#dvPopupDialog").dialog({
                    title: "Bol.com Bestsellers widget settings",
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
