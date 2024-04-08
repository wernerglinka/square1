<?php
/**
 * Page section for displaying a page footer
 * 
 * The footer uses "free" form content from a embed content type.
 *
 * @package square1
 */

$props = $args['props'];
$embed = $props['embed'][0]->post_content;

?>

<div class="footer-content">
  <?php echo wp_kses_post($embed); ?>
</div> <!-- /.footer-content -->
<p class="copyright-notice">&copy; <?php echo date('Y'); ?> Square1. All rights reserved.</p>