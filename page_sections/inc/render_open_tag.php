<?php

function render_open_tag($section) {

  //echo "<pre>";
  //print_r(get_sub_field($section));
  //echo "</pre>";

  // Get the properties for the current section
  $props = get_sub_field($section);

  // common section fields are set, was check before function call
  $common_fields = $props['common_section_fields'];

  // Get the wrapper type, default to 'section' if not set
  $wrapper_type = $common_fields ? $props['common_section_fields']['wrapper_element'] : 'section';

  // Build the class string for the body
  $body_classes = build_section_class_string($props);

  // Build the styles string for the body
  $body_styles = build_section_styles_string($props);

  // Get the section ID, if any
  $section_id = $common_fields ? $props['common_section_fields']['section_id'] : '';

  // Start the wrapper element tag
  echo sprintf("<%s", $wrapper_type);
  // If a section ID is set, add it to the wrapper element
  if (!empty($section_id)) {
      echo sprintf(" id='%s'", $section_id);
  }
  // Add the classes to the wrapper element
  echo sprintf(" class='page-section %s %s' ", str_replace('_', '-', $section), $body_classes);
  // If styles are set, add them to the wrapper element
  if ($body_styles) {
      echo sprintf("style='%s'", $body_styles);
  }
  // Close the the opening wrapper element tag
  echo ">";

  echo "<div class='container'>";
}

?>