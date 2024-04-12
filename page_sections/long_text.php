<?php
/**
 * Page section for displaying a long text section
 * 
 * @package square1
 */

  $props = $args['props'];
  $text = $props['text'];
  $background_image = $props['common_section_fields']['background_image'];
  
  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";
?>

<div class="text">
  <?php render_text_component($text); ?>
</div>

