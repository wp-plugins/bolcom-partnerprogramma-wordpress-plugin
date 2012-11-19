=== Bol.com Partner Program Plugin ===
Contributors: Netvlies Internetdiensten
Tags: bol.com, affiliate, partner program, Netherlands stores
Requires at least: 3.1.1
Tested up to: 3.4.0
Stable tag: 1.0
Licence: MIT
Bol.com Affiliate Partner program to sell goods on your own website.

== Description ==
Bol.com Affiliate Partner Program Plugin allows you to sell goods on your own website.
Bol.com crowded stores has the largest collection of shops in the Netherlands. In these shops we offer you the same service as in physical stores, but at internet prices. Among the millions of articles always contain an article that suits you. Thanks to our partners and 2ehandsaanbieders bol.com plaza you'll find more and you can easily compare prices.

== Installation ==

1. Upload plugin directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. A new entry in the left menu will appear ('Bol.com')
4. Click on the 'Bol.com' menu entry and insert your Partner SiteId, API Access Key and API Secret Key

== Changelog ==

= 1.1.0 =
* Added filled placeholder rendering. Placeholders now have dummy content
* Small style changes to have default product link dimensions
* Maded column and width input available for manual input
* Added default for widget width and widget columns (for searchForm)
* Added preview triggers on several fields for bestsellers and search-form
* Updated the admin css, better displaying of plugin
* Added auto search on enter keypress in the searchbox for the products widget
* Altered the price collection to bol api v3
* Added auto preview to tab switch in product widget
* Fixed path issue for loading the tinymce popup js. Did not work in a subdir install

= 1.0.5 =
* Removing old code concerning css files broke the build. The block_id could not be generated anymore. Fixed with new block_id generation.

= 1.0.4 =
* Changed wp-load include reference from absolute (from document-root) to relative to support subdir wp-installs

= 1.0.3 =
* Removed short open tags from the code
* Added php version check
* Removed obsolete old code which created css files on disk

= 1.0.2 =
* Textual changes in the plugin
* Improved the installation instructions
* Upgraded the class autoloader which caused error messages
* Fixed the path for the icon for the wordpress menu

= 1.0.1 =
* Fixed jQuery loading issues
* Disabled redirects in the OpenAPI curl client

= 1.0 =
* This is first version
