<?php
/**
 * Inner part of a banner page section
 * 
 * @package square1
 */

  $props = $args['props'];
  $text = $props['text'];
  $ctas = isset($props['ctas']) && is_array($props['ctas']) ? $props['ctas'] : [];
  $hasCTAs = count($ctas) > 0;

  //echo "<pre>";
  //print_r($ctas);
  //echo "</pre>";
?>

<div class="text">
  <?php render_text_component($text); ?>
  <?php if ($hasCTAs) : ?>
    <?php foreach ($ctas as $cta) : ?>
      <?php render_cta_component($cta); ?>
    <?php endforeach; ?>
  <?php endif; ?>
</div>

