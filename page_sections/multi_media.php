<?php
/**
 * Page section for displaying a page banner
 * 
 * @package hlwp
 */

  $props = $args['props'];

  $audio = $props['audio'];
  $background_image = $props['common_section_fields']['background_image'];
  $ctas = isset($props['ctas']) && is_array($props['ctas']) ? $props['ctas'] : [];
  $hasCTAs = count($ctas) > 0;
  $icon = $props['icon'];
  $image = $props['image'];
  $lottie = !isset($props['lottie']) ? [] : $props['lottie'];
  $text = $props['text'];
  $video = $props['video'];

  $media_type = $props['media_type'];


  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";

?>

  <div class="text">
    <?php render_text_component($text); ?>
    <?php if ($hasCTAs): ?>
      <div class="ctas-container">
      <?php foreach ($ctas as $cta): ?>
        <?php render_cta_component($cta);?>
      <?php endforeach;?>
      </div>
    <?php endif;?>
  </div>

  <?php if ($media_type == "audio") : ?>
    <div class="media audio">
      <?php if ($audio['thumbnail']) : ?>
        <?php render_image_component($audio['thumbnail']); ?>
      <?php endif; ?>
        
      <?php render_audio_component($audio); ?>
    </div>
  <?php endif; ?>

  <?php if ($media_type == "image"): ?>
    <div class="media image">
      <?php render_image_component($image);?>
    </div>
  <?php endif;?>

  <?php if ($media_type == "icon"): ?>
    <div class="media icon">
      <div class="icon-wrapper">
        <?php render_icon_component($icon);?>
      </div>
    </div>
  <?php endif;?>

  <?php if ($media_type == "lottie"): ?>
    <div class="media image">
      <?php render_lottie_component($lottie);?>
    </div>
  <?php endif;?>