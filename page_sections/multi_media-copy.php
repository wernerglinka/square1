<?php
/**
 * Page section for displaying a page banner
 * 
 * @package hlwp
 */

  $props = $args['props'];
  /*
  $audio = $props['audio'];
  $background_image = $props['common_section_fields']['background_image'];
  $cta = $props['cta'];
  $icon = $props['icon'];
  $image = $props['image'];
  $lottie = !isset($props['lottie_animation']) ? [] : $props['lottie_animation'];
  $text = $props['text'];
  $video = $props['video'];

  $media_type = $props['media_type'];
  */

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";

?>


  <div class="text">
    <?php render_text_component($text); ?>
    <?php render_cta_component($cta); ?>
  </div>

  <?php if ($media_type == "audio") : ?>
    <div class="media audio">
      <?php if ($audio['thumbnail']) : ?>
        <?php render_image_component($audio['thumbnail']); ?>
      <?php endif; ?>
        
      <?php render_audio_component($audio); ?>
    </div>
  <?php endif; ?>

  <?php if ($media_type == "lottie") : ?>
    <div class="media lottie">

    <?php
      echo "<pre>";
      print_r($lottie);
      echo "</pre>";

    ?>
      <?php render_lottie_component($lottie); ?>
    </div>
  <?php endif; ?>

  <?php if ($media_type == "image") : ?>
    <div class="media image">
      <?php render_image_component($image); ?>
    </div>
  <?php endif; ?>

  <?php if ($media_type == "icon") : ?>
    <div class="media icon">
      <div class="icon-wrapper <?php echo $icon['icon_classes']; ?>">
        <?php render_icon_component($icon); ?>
      </div> 
    </div>
  <?php endif; ?>

  <?php if ($media_type == "video") : ?>
    <div class="media video">
      <?php render_video_component($video); ?>
    </div>
  <?php endif; ?>

