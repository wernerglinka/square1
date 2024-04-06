<?php
/**
 * Inner part of a banner page section
 * 
 * @package square1
 */

  $props = $args['props'];
  $text = $props['text'];
?>

<div class="text">
  <?php render_text_component($text); ?>
</div>

