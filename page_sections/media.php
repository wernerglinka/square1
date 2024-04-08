<?php
/**
 * Page section for displaying a section with text and image
 * 
 * @package square1
 */
  include_once get_template_directory() . '/page_sections/inc/render_text_elements.php';

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
      <?php
        if ($text['title']) {
          render_header($text);
        }
      ?>
      
      <?php // render subtitle if it exists
        if( $text['sub_title'] ) {
          render_subtitle($text);
        }
      ?>

      <?php // render prose if it exists
        if( $text['prose'] ) {
          render_prose($text);
        }
      ?>

      <?php // render cta if it exists
        if( $cta ) {
          render_media_link($cta);
        }
      ?>
    </div><!-- .text -->

    <?php if ($has_image && !$with_background_image): ?>
      <div class="image">
        <?php
          $image['alt_text'] = ""; // This is a decorative image, force alt text to be empty so screen readers ignore it
          render_image_component($image);
        ?>
      </div><!-- .image -->
    <?php endif;?>

  </div>
</div>