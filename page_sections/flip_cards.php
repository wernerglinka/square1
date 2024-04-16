<?php
/**
 * Page section for displaying a set of flip cards
 *
 * @package square1
 */

  $props = $args['props'];

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";

  $text = $props['text'];
  $flip_cards = $props['cards'];
  $ctas = isset($props['ctas']) && is_array($props['ctas']) ? $props['ctas'] : [];
  $hasCTAs = count($ctas) > 0;


?>

<?php render_text_component($text); ?>

<?php $length = count($flip_cards);?>
<ul class="flip-cards-list items<?php echo $length ?>">
  <?php foreach ($flip_cards as $card): ?>
    <?php render_flip_card_component($card); ?>
  <?php endforeach; ?>
</ul>

<?php if ($hasCTAs): ?>
  <div class="ctas-container">
  <?php foreach ($ctas as $cta): ?>
    <?php render_cta_component($cta);?>
  <?php endforeach;?>
  </div>
<?php endif;?>