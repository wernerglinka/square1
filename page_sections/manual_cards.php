<?php
/**
 * Page section for displaying a set of manual cards
 *
 * @package square1
 */

  $props = $args['props'];

  $text = $props['text'];
  $cards = $props['cards'];
  $ctas = isset($props['ctas']) && is_array($props['ctas']) ? $props['ctas'] : [];
  $hasCTAs = count($ctas) > 0;
  $is_horizontal = isset($props['is_horizontal']) && $props['is_horizontal'] ? true : false;

  //echo "<pre>";
  //print_r($cards);
  //echo "</pre>";


?>

<?php if ($is_horizontal): ?>
  
  <div class="section-text">
    <div class="section-header">
      <?php render_text_component($text); ?>
    </div>

    <?php if ($hasCTAs): ?>
      <div class="ctas-container">
      <?php foreach ($ctas as $cta): ?>
        <?php render_cta_component($cta);?>
      <?php endforeach;?>
      </div>
    <?php endif;?>
  </div>

  <?php $length = count($cards);?>
  <ul class="manual-cards-list items<?php echo $length ?>">
    <?php foreach ($cards as $card): ?>
      <?php render_manual_card_component($card);?>
    <?php endforeach;?>
  </ul>
  

<?php else: ?>
  
  <div class="section-header">
    <?php render_text_component($text); ?>
  </div>

  <?php $length = count($cards);?>
  <ul class="manual-cards-list items<?php echo $length ?>">
    <?php foreach ($cards as $card): ?>
      <?php render_manual_card_component($card); ?>
    <?php endforeach; ?>
  </ul>

  <?php if ($hasCTAs): ?>
    <div class="ctas-container">
    <?php foreach ($ctas as $cta): ?>
      <?php render_cta_component($cta);?>
    <?php endforeach;?>
    </div>
  <?php endif;?>
<?php endif; ?>