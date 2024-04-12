<?php
/**
 * Page section for displaying alink list with icons
 * 
 * @package square1
 */

  $props = $args['props'];
  $allLinks = $props['link'];

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";
?>

<?php render_icon_link_list_component($allLinks); ?>

