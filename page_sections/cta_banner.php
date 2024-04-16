<?php
/**
 * Page section for displaying a cta banner
 * 
 * @package hlwp
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
  <?php render_text_component($text);?>
  <?php if ($hasCTAs): ?>
    <div class="ctas-container">
    <?php foreach ($ctas as $cta): ?>
      <?php render_cta_component($cta);?>
    <?php endforeach;?>
    </div>
  <?php endif;?>
</div>