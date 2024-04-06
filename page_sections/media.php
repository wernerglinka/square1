<?php
/**
 * Page section for displaying a section with text and image
 * 
 * @package square1
 */

  $props = $args['props'];
  $text = $props['text'];
  $cta = $props['cta'];
  $image = $props['image'];
  $has_image = isset($image['url']) ? true : false;
  $with_background_image = !isset($props['with_background_image']) ? false : $props['with_background_image'];
?>




<div class="container media-wrapper">
  <div class="media">
    
    <?php if($has_image && !$with_background_image) : ?>
      <div class="media__image">
        <div class='image-wrapper'>
          <?php $image['alt_text'] = "";  // This is a decorative image, force alt text to be empty so screen readers ignore it ?>
          <?php render_image_component($image); ?>
        </div>
      </div>
    <?php endif; ?>

    <?php
      if ($text['title']) {
        $title = preg_replace( '/^<[^>]+>|<\/[^>]+>$/', '',$text['title']);
      }
    ?>
    <<?php echo $text['heading_level']; ?> class="media__title">
      <?php echo $title; ?>
    </<?php echo $text['heading_level']; ?>>

    <?php // render subtitle if it exists
      if( $text['sub_title'] ) {
        echo "<p class='media__sub-title'>" . $text['sub_title'] . "</p>";
      }
    ?>

    <?php // render prose if it exists
      if( $text['prose'] ) {
      echo "<div class='media__prose'>" . $text['prose'] . "</div>";
    }
    ?>

    <?php // render cta if it exists
      if( $cta ) {
      echo "<div class='media__cta'>";
      if( $cta['target'] ){
        $button_class = !empty($cta['is_button']) ? "button " . $cta['button_type'] . " " : "text-link ";
        $button_class = !empty($cta['cta_classes']) ? $button_class . $cta['cta_classes'] : $button_class;
        $external_attributes = !empty($cta['is_external']) ? "target='_blank' rel='noopener noreferrer'" : null;
        $hint = !empty($cta['is_external']) ? "<span class='screen-reader-text'>Opens a new tab</span>" : null;

        echo "<a class='cta " . $button_class . "' href='" . $cta['target'] . "' $external_attributes>" . $cta['label'] . $hint . "</a>";
      }
      echo "</div>";
    }
    ?>
  </div>
</div>