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
  $has_image = isset($image['url']) ? true : false;
  $with_background_image = !isset($props['with_background_image']) ? false : $props['with_background_image'];
?>

<div class="media-wrapper">
  <div class="media">
    <div class="text">
      <?php render_text_component($text); ?>
      <?php render_cta_component($cta); ?>
    </div><!-- .text -->

    <div class="image">
      <?php
        $image['alt_text'] = ""; // This is a decorative image, force alt text to be empty so screen readers ignore it
        render_image_component($image);
      ?>
    </div><!-- .image -->
  </div>
</div>