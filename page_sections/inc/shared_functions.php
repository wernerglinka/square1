<?php
  /**
   * Render a title and append a period if it's missing
   */
  function render_title($title, $header_level) {
    $title = preg_replace('/^<[^>]+>|<\/[^>]+>$/', '', $title);

    echo "<" . $header_level . " class='text-title'>";
    echo $title;
    echo "</" . $header_level . ">";
  }
?>

<?php
  function titleCase($string) {
    //source: https://gist.github.com/JonnyNineToes/7161300
    //reference http://grammar.about.com/od/tz/g/Title-Case.htm
    //The below array contains the most commonly non-capitalized words 
    //in title casing - I'm not so sure about the commented ones that follow it...
    $minorWords = array('a','an','and','as','at','but','by','for','in', 'is','nor','of','on','or','per','the','to','with'); // but, is, if, then, else, when, from, off, out, over, into,
    // take the input string, trim whitespace from the ends, single out all repeating whitespace
    $string = preg_replace('/[ ]+/', ' ', trim($string));
    // explode string into array of words
    $pieces = explode(' ', $string);
    // for each element in array...

    for($p = 0; $p <= (count($pieces) - 1); $p++){
      // check if the whole word is capitalized (as in acronyms), if it is not...
      if(strtoupper($pieces[$p]) != $pieces[$p]){
        // reduce all characters to lower case
        $pieces[$p] = strtolower($pieces[$p]);
        // if the value of the element doesn't match any of the elements in the minor words array, and the index is not equal to zero, or the numeric key of the last element...
        if(!in_array($pieces[$p], $minorWords) || ($p === 0 || $p === (count($pieces) - 1))){
          // ...capitalize it.
          $pieces[$p] = ucfirst($pieces[$p]);
        }
      }
    }
    // re-connect all words in array with a space
    $string = implode(' ', $pieces);
    // return title-cased string
    return $string;
  }
?>

<?php
  function trunctate_text($string, $length) { 
    $string = strip_tags($string);
    if (strlen($string) > $length) {

      // truncate string
      $stringCut = substr($string, 0, $length);
      $endPoint = strrpos($stringCut, ' ');

      //if the string doesn't contain any space then it will cut without word basis.
      $string = $endPoint? substr($stringCut, 0, $endPoint) : substr($stringCut, 0);
      $string .= '...';
    }
    return $string;
  } // end trunctate_text
?>

<?php 
  function build_section_class_string($params) {
    // build the body classes string
    $string= "";

    if (isset($params['common_section_fields']['settings']) && in_array("in_container", $params['common_section_fields']['settings'])) {
      $string .= " in-container";
    }
    if (isset($params['common_section_fields']['settings']) && in_array("no_top_margin", $params['common_section_fields']['settings'])) {
      $string .= " no-top-margin";
    }
    if (isset($params['common_section_fields']['settings']) && in_array("no_bottom_margin", $params['common_section_fields']['settings'])) {
      $string .= " no-bottom-margin";
    }
    if (isset($params['common_section_fields']['settings']) && in_array("narrow_width", $params['common_section_fields']['settings'])) {
      $string .= " narrow-width";
    }
    if (isset($params['common_section_fields']['usage']) && ($params['common_section_fields']['usage'] == "banner")) {
      $string .= " is-banner";
    }
    if (!empty($params['common_section_fields']['background_is_dark'])) {
      $string .= " is-dark";
    }
    if (isset($params['is_horizontal']) && $params['is_horizontal']) {
      $string .= " is-horizontal";
    }
    if(isset($params['common_section_fields']['section_classes']) && $params['common_section_fields']['section_classes'] != "") {
      $string .= " " . $params['common_section_fields']['section_classes'];
    }
    // media section has image on the right by default. set is-reverse if image is on the left
    if(isset($params['media_position']) && $params['media_position'] == "left") {
      $string .= " is-reversed";
    }
    // Check if a background color is set and not "none"
    if (isset($params['common_section_fields']['background_color'])
      && !empty($params['common_section_fields']['background_color'])
      && $params['common_section_fields']['background_color'] !== "none") {
      $string .= " has-background-color";
    }
    // Check if a background image is set, then add it to the styles string
    if (isset($params['common_section_fields']['background_image']['id'])
      && !empty($params['common_section_fields']['background_image']['id'])) {
      $string .= " has-background-image";
    }
    // section has a screen in front of the background image
    if (isset($params['common_section_fields']['screen']['has_screen']) && $params['common_section_fields']['screen']['has_screen']) {
      if ($params['common_section_fields']['screen']['dark_screen']) {
        $string .= " has-dark-screen";
      } else {
        $string .= " has-light-screen";
      }
    }

    //echo "<pre>";
    //print_r($string); 
    //echo "</pre>";

    return $string;
  } // end build_section_class_string
?>

<?php
  function build_section_styles_string($params) {
    // Initialize the styles string
    $styles = "";

    // Check if a background color is set and not "none", then add it to the styles string
    if (isset($params['common_section_fields']['background_color']) 
      && !empty($params['common_section_fields']['background_color']) 
      && $params['common_section_fields']['background_color'] !== "none") {
      $styles .= "background-color: " . $params['common_section_fields']['background_color'] . ";";
    }

    // Check if a background image is set, then add it to the styles string
    if (isset($params['common_section_fields']['background_image']['id'])
      && !empty($params['common_section_fields']['background_image']['id'])) {
        $image_id = $params['common_section_fields']['background_image']['id'];
        $styles .= "--bg-image: url(" . wp_get_attachment_image_url($image_id, 'full size') . ");";
    }

    return $styles;
  }
?>