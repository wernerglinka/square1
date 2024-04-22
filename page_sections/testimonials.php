<?php
/**
 * Page section for displaying a testimonial or a list of testimonials
 * 
 * @package square1
 */

  $props = $args['props'];
  $testimonials = $props['testimonials']['testimonial'];
  $is_single = count($testimonials) === 1;

  $ctas = isset($props['ctas']) && is_array($props['ctas']) ? $props['ctas'] : [];
  $hasCTAs = count($ctas) > 0;

  //echo "<pre>";
  //print_r($testimonials);
  //echo "</pre>";
?>

<?php if($is_single): ?>
  <?php $testimonial = $testimonials[0]; ?>
  
  <div class="testimonial-single">
    <?php render_testimonials_component($testimonial); ?>
  </div>   

  <?php else: ?>

  <ul class="testimonials-list">
    <?php foreach ($testimonials as $testimonial): ?>
      <li class="testimonial">
        <?php render_testimonials_component($testimonial); ?>
      </li>
    <?php endforeach;?>
  </ul> 

  <?php if ($hasCTAs): ?>
    <div class="ctas-container">
    <?php foreach ($ctas as $cta): ?>
      <?php render_cta_component($cta);?>
    <?php endforeach;?>
    </div>
  <?php endif;?>

<?php endif;?>
