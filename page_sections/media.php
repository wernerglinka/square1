<?php
/**
 * Page section for displaying a section with text and image
 * 
 * @package square1
 */
  include_once get_template_directory() . '/page_sections/inc/section_components.php';

  $props = $args['props'];
  $text = $props['text'];
  $cta = $props['cta'];
  $image = $props['image'];
  $has_image = isset($image['id']) ? true : false;

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";
?>


    <div class="text">
      <?php render_text_component($text); ?>
      <?php render_cta_component($cta); ?>
    </div><!-- .text -->

    <?php if ($has_image) : ?>
      <div class="image">
        <?php render_image_component($image); ?>
      </div><!-- .image -->
    <?php endif; ?>
 