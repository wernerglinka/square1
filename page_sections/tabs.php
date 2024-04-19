<?php
/**
 * Page section for displaying a tabs section
 *
 * @package hlwp
 */

  $props = $args['props'];
  $tabs = $props['tabs'];
  $text = $props['header'];
  $is_vertical = $props['is_vertical'] ?? false;

?>

<?php render_text_component($text);?>

<?php if ($is_vertical): ?>

  <div class="is-vertical js-tabs">
    <ul class="tabs-list">
      <?php foreach ($tabs as $key=>$tab) : ?>
        <li class="tab-label<?php if($key === 0) echo ' active'; ?>">
          <h4>
            <?php echo $tab['label']; ?>
            <span class="status">+</span>
          </h4>

          <div>
            <div class="media">
              <?php render_image_component($tab['tab_content']['image']);?>
            </div>    <!-- .media -->
            <div class="text">
              <?php render_text_component($tab['tab_content']['text']);?>

              <?php $ctas = isset($tab['tab_content']['ctas']) && is_array($tab['tab_content']['ctas']) ? $tab['tab_content']['ctas'] : [];?>
              <?php $hasCTAs = count($ctas) > 0;?>
              <?php if ($hasCTAs): ?>
                <div class="ctas-container">
                  <?php foreach ($ctas as $cta): ?>
                  <?php render_cta_component($cta);?>
                  <?php endforeach;?>
                </div>
              <?php endif;?>
            </div>  <!-- .text -->
          </div>
        </li>
      <?php endforeach;?>
    </ul><!-- .content-wrapper -->
  </div><!-- .tabs-vertical -->

<?php else: ?>

  <div class="is-horizontal js-tabs">
    <ul class="tabs">
      <?php foreach ($tabs as $index => $tab): ?>
        <li class="tab-label <?php if ($index == 0) { echo 'active'; } ?>">
          <?php echo $tab['label']; ?>
        </li>
      <?php endforeach;?>
    </ul>

    <div class="tabs-content">
      <?php foreach ($tabs as $index => $tab): ?>
        <div class="tab-content <?php if ($index == 0) { echo 'active'; } ?>">
          <div class="text">
            <?php render_text_component($tab['tab_content']['text']);?>

            <?php $ctas = isset($tab['tab_content']['ctas']) && is_array($tab['tab_content']['ctas']) ? $tab['tab_content']['ctas'] : [];?>
            <?php $hasCTAs = count($ctas) > 0;?>
            <?php if ($hasCTAs): ?>
              <?php
                //echo "<pre>";
                //print_r($ctas);
                //echo "</pre>";
              ?>
              <div class="ctas-container">
                <?php foreach ($ctas as $cta): ?>
                <?php render_cta_component($cta);?>
                <?php endforeach;?>
              </div>
            <?php endif;?>
          </div><!-- .text -->

          <div class="media">
            <?php render_image_component($tab['tab_content']['image']);?>
          </div><!-- .media -->

        </div><!-- .tab-content -->
      <?php endforeach;?>
    </div><!-- .tabs-content -->
  </div>

<?php endif;?>