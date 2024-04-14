<?php
/**
 * Page section for displaying a cta banner
 * 
 * @package hlwp
 */

  $props = $args['props'];
  $text = $props['text'];
  $cta = $props['cta'];
  $hasCTA = $cta['link']; 
?>

<div class="text">
  <?php render_text_component($text); ?>
  <?php if ($hasCTA) : ?>
      <?php render_cta_component($cta); ?>
  <?php endif; ?>
</div>  
