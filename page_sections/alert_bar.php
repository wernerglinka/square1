<?php
/**
 * Page section for displaying an alert bar at the top of the page
 * 
 * @package square1
 */

  $props = $args['props'];

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";

  $message = $props['message'];
  $button_text = $props['button_text'];
  $link = $props['link'];
  $is_external = $props['is_external'];
?>

<a href="<?php  echo $link; ?>" <?php if($is_external) echo "target='_blank' rel='noopener noreferrer'"; ?>>
  <div class="message"><?php echo $message; ?> <?php echo $button_text; ?></div>
</a>


