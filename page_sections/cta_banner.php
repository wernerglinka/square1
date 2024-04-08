<?php
/**
 * Page section for displaying a cta banner
 * 
 * @package hlwp
 */


  $props = $args['props'];
  $text = $props['text'];
  $cta = $props['cta'];
  //$background_image = $props['common_section_fields']['background_image'];

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";
 
?>


<?php render_text_component($text); ?>
<?php render_cta_component($cta); ?>

