<?php
/**
 * Page section for displaying a list of resources
 *
 * @package square1
 */

$props = $args['props'];
$text = $props['text'];
$resources = $props['resources'];
$all = !isset($props['show_selection']) || !$props['show_selection'];
$cta = isset($props['cta']) && is_array($props['cta']) ? $props['cta'] : [];

//echo "<pre>";
//print_r($cta);
//echo "</pre>";

// Get all resources if show_selection is false
if ($all) {
    $args = array(
        'post_type' => 'resource',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
    );
    $resources = get_posts($args);
}
?>

<?php render_text_component($text);?>
<?php render_resources_list_component($resources);?>
<?php if ($cta): ?>
  <div class="ctas-container">
  <?php render_cta_component($cta);?>
  </div>
<?php endif;?>

