<?php
namespace BolPartnerPlugin\AdminPage;

use BolPartnerPlugin\AdminPage\AdminPage;
/**
 * Display, validate and store the plugin configuration
 *
 * This file is part of the Bol-Partner-Plugin for Wordpress.
 *
 * (c) Netvlies Internetdiensten
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
class Config implements AdminPage
{
    protected $params = array();

    protected $message = '';

    public function setParams(array $params)
    {
        $this->params = $params;
        return $this;
    }

    public function init()
    {
        // Callback will be used as soon as we call the update_option() function
        register_setting( 'bol_partner_settings', 'bol_partner_settings', array($this, 'validatePartnerSettings'));
        register_setting( 'bol_partner_settings', 'bol_openapi_settings', array($this, 'validateOpenApiSettings'));

        // Define the Partner programm settings section
        add_settings_section(
            // id                   title                        display callback              page
            'bol_partner_settings', 'Partner program settings', array($this, 'displayTitle'), 'bol_partner_settings'
        );
        // Define the OpenApi settings section
        add_settings_section(
            'bol_openapi_settings', 'Open API settings', array($this, 'displayTitle'), 'bol_partner_settings'
        );

        // Partner programm settings fields (bol_partner_plugin_page::bol_partner_settings)
        add_settings_field(
        // id                  title
            'bol_partner_site_id', 'Partner SiteId',
        // display callback
            array($this, 'inputText'),
        // page                 section
            'bol_partner_settings', 'bol_partner_settings',
        // arguments
            array('name' => 'bol_partner_settings', 'attrib' => 'site_id')
        );

        add_settings_field(
            // id                  title
            'bol_partner_access_key', 'API Access Key',
            array($this, 'inputText'),
            'bol_partner_settings', 'bol_partner_settings',
            array('name' => 'bol_partner_settings', 'attrib' => 'access_key')
        );

        // OpenApi settings fields (bol_partner_plugin_page::bol_openapi_settings)
        add_settings_field(
            'bol_partner_openapi_key', 'API Secret Key',
            array($this, 'inputText'),
            'bol_partner_settings', 'bol_openapi_settings',
            array('name' => 'bol_openapi_settings', 'attrib' => 'access_key', 'id' => 'bol_partner_openapi_key')
        );

    }

    public function process()
    {
        if (isset($_POST['option_page']) && ($_POST['option_page'] == 'bol_partner_settings')) {
            $partnerSettings = isset($_POST['bol_partner_settings']) ? $_POST['bol_partner_settings'] : array();
            $apiSettings = isset($_POST['bol_openapi_settings']) ? $_POST['bol_openapi_settings'] : array();
            $this->storeSettings('bol_partner_settings', $partnerSettings);
            $this->storeSettings('bol_openapi_settings', $apiSettings);
        }
    }

    public function validatePartnerSettings(array $input)
    {
        // @TODO: implement validator / filter
        return $input;
    }

    public function validateOpenApiSettings(array $input)
    {
        // @TODO: implement validator / filter
        return $input;
    }

    public function storeSettings($name, $value)
    {
        update_option($name, $value);
    }

    public function display()
    {
        ?>
        <div class="wrap">
            <h2><img src="<?php echo BOL_PARTNER_PLUGIN_PATH ?>/resources/icon-bol-50x50.png" alt="bol.com"/>Bol
                .com partner
                plugin settings:</h2>
            <form action="<?php echo admin_url('admin.php?page=' . BOL_PARTNER_CONFIG_MENU_SLUG) ?>" method="post">
                <input value="bol_config_edit" type="hidden" name="bol_partner_config_edit" />
                <?php settings_fields( 'bol_partner_settings' ) ?>
                <?php do_settings_sections('bol_partner_settings') ?>
                <input name="Submit" type="submit" value="<?php esc_attr_e('Save Changes'); ?>" />
            </form>
        </div>
        <?php
    }

    public function displayTitle()
    {
    }

    public function inputText($params)
    {
        $name = sprintf('%s[%s]', $params['name'], $params['attrib']);

        $options = get_option($params['name']);
        $value = $options[$params['attrib']];

        $input = '<input id="%s" name="%s" size="40" type="text" value="%s" />';
        echo sprintf($input, $params['id'], $name, $value);
    }
}
