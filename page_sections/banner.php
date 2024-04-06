<?php
/**
 * Page section for displaying a banner
 * 
 * @package square1
 */

  $props = $args['props'];
  $text = $props['text'];
?>

<div class="container">
  <div class="text">
    <?php render_text_component($text); ?>
  </div>
</div><!-- .container -->
