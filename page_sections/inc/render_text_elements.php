<?php
/**
 * Render Header
 * Remove any HTML tags from the title and render it with the appropriate heading level
 */
function render_header($text) {
  $title = preg_replace('/^<[^>]+>|<\/[^>]+>$/', '', $text['title']);

  echo "<" . $text['heading_level'] . " class='text-title'>";
  echo $title;
  echo "</" . $text['heading_level'] . ">";
}

/**
 * Render Subtitle
 */
function render_subtitle($text) {
  echo "<p class='text-subtitle'>" . $text['sub_title'] . "</p>";
}

/**
 * Render Prose
 */
function render_prose($text) {
  echo "<div class='text-prose'>" . $text['prose'] . "</div>";
}

/**
 * Render Media Link
 */
function render_media_link($cta) {
  echo "<div class='text-cta'>";
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