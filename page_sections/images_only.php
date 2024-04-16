<?php
/**
 * Page section for displaying a section with one or more images
 * 
 * @package square1
 */
  include_once get_template_directory() . '/page_sections/inc/section_components.php';

  $props = $args['props'];
  $images = $props['images'];

  //echo "<pre>";
  //print_r($ctas);
  //echo "</pre>";
?>

  <div class="images">
    <?php foreach ($images as $image): ?>
      <?php render_image_component($image); ?>
    <?php endforeach;?>
  </div>