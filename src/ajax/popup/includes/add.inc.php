<?php

/*
* This file is part of the Bol-Partner-Plugin for Wordpress.
*
* (c) Netvlies Internetdiensten
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

// Read the XML file
$xmlLocation = 'https://www.bol.com/nl/cms/images/xml/201105%20-%20Couponcode%20XML.xml';

if ($adds = @simplexml_load_file($xmlLocation)) {

    $properties = array(
        'Audio/navigatie'               => 'audio_navigatie',
        'Baby'                          => 'baby',
        'Boeken INT'                    => 'boeken_int',
        'Boeken NL'                     => 'boeken_nl',
        'Camera'                        => 'camera',
        'Computer'                      => 'computer',
        'Crosscategorie'                => 'crosscategorie',
        'Dier, Tuin en Klussen'         => 'dier_tuin_klussen',
        'DVD'                           => 'dvd',
        'Ebooks'                        => 'ebooks',
        'Elektronica'                   => 'elektronica',
        'Games'                         => 'games',
        'Home Entertainment'            => 'home_entertainment',
        'Huishoudelijk'                 => 'huishoudelijk',
        'Koken, Tafelen en Huishouden'  => 'koken_tafelen_huishouden',
        'Mooi en Gezond'                => 'mooi_en_gezond',
        'Muziek'                        => 'muziek',
        'Speelgoed'                     => 'speelgoed',
        'Telefoon/Tablet'               => 'telefoon_tablet',
        'Wonen'                         => 'wonen'
    );

    $currentDate = new DateTime();
    $currentDate->setTime(0, 0, 0);

    $sortedAdds = array();
    foreach ($adds as $add) {
        // Check or the advertisement group exists
        if (!empty($add->Product__groep) && array_key_exists( (string) $add->Product__groep, $properties) && !empty($add->Omschrijving)) {

            // Check or the add is valid for the currentDate
            if (!empty($add->Startdatum) && !empty($add->Einddatum)) {
                $startDate = new DateTime($add->Startdatum);
                $endDate = new DateTime($add->Einddatum);
            }

            if ($startDate && $endDate && $currentDate >= $startDate && $currentDate <= $endDate) {
                $key = (string) $add->Product__groep;
                $sortedAdds[$properties[$key]][] = $add;
            }
        }
    }
} else {
    die(__('Error: Bol.com promotions could not be loaded', 'bolcom-partnerprogramma-wordpress-plugin'));
}

?>
<div class="promotions postbox">
    <div title="Click to toggle" class="handlediv"><br></div>
    <h3 class="hndle"><span><?php _e('Show the Bol.com promotions of a selected category', 'bolcom-partnerprogramma-wordpress-plugin'); ?></span></h3>
    <div class="inside">
<div class="adds hide">
    <p><?php _e('These promotions are currently active at Bol.com.', 'bolcom-partnerprogramma-wordpress-plugin'); ?>
        <?php _e('These promotion links are ready to use. Copy them and use them directly.', 'bolcom-partnerprogramma-wordpress-plugin'); ?></p>

    <?php foreach ($sortedAdds as $key => $addGroup) {
        $count = 0;
        ?>
        <div class="add <?php echo $key; ?> hide">
            <?php foreach($addGroup as $add) { ?>
                <?php if ($count == 0) { ?>
                    <h4><?php echo $add->Product__groep; ?></h4>
                <?php } ?>

                <?php $count++; ?>
                <?php
                    // Build the url for promotions
                    $link = '';
                    if (!empty($add->Landingspagina)) {
                        $partnerSettings = get_option('bol_partner_settings');
                        $siteId = $partnerSettings['site_id'];

                        $link = "http://partnerprogramma.bol.com/click/click?p=1&t=url&s=" . $siteId . "&f=WP_Bolcomacties&name=bolcomacties&url=" . $add->Landingspagina;
                    }

                ?>
                <p><a href="<?php echo $link; ?>" target="_blank"><?php echo $add->Omschrijving; ?></a><br />
                    <?php _e('From', 'bolcom-partnerprogramma-wordpress-plugin'); ?>
                    <?php echo $add->Startdatum; ?> <?php _e('till', 'bolcom-partnerprogramma-wordpress-plugin'); ?> <?php echo $add->Einddatum; ?>

                    <?php if (!empty($add->Coupon_code) && $add->Coupon_code != 'automatisch geactiveerd') { ?>
                    <br />Coupon code: <?php echo $add->Coupon_code; ?>
                <?php } ?>
                </p>
            <?php } ?>
        </div>
    <?php } ?>

</div>
</div>
</div>
