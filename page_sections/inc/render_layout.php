<?php
  include_once get_template_directory() . '/page_sections/inc/render_open_tag.php';
  include_once get_template_directory() . '/page_sections/inc/render_close_tag.php';

  /**
   * Render Section
   * This code is part of a WordPress theme and is responsible for rendering a 
   * section of a page. It first checks if the section is disabled, and if it's 
   * not, it gets the necessary data and builds the HTML for the section. It 
   * also checks if a background image is set for the section, and if it is, 
   * it renders the image. Finally, it gets the appropriate template part for 
   * the current layout and includes it in the <section class=""></section>
   */
  // Get the current section
  $section = get_row_layout();

  // Get the properties for the current section
  $props = get_sub_field($section);

  // Check if common section fields are set, if not set to false
  $common_fields = isset($props['common_section_fields']) ? $props['common_section_fields'] : false;

  // Check if the section is disabled
  $is_disabled = $common_fields ? in_array("is_disabled", $props['common_section_fields']['settings']) : false;

  // If the section is not disabled, proceed with rendering
  if (!$is_disabled) {

    /*
    // Get the background image, if any
    $background_image = $common_fields ? $props['common_section_fields']['background_image'] : [];

    // Get the wrapper type, default to 'section' if not set
    $wrapper_type = $common_fields ? $props['common_section_fields']['wrapper_element'] : 'section';
    
    // Build the class string for the body
    $body_classes = build_section_class_string($props);

    // Check if the section should have a background image
    $with_background_image = isset($props['with_background_image']) ? $props['with_background_image'] : false;  

    // If the section should have a background image, add the class
    if ($with_background_image) {
      $body_classes .= " with-background-image";
    }

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
    if($body_styles) {
      echo sprintf("style='%s'", $body_styles);
    }
    // Close the the wrapper element tag
    echo ">";

    */

    // render the opening tag for the section.
    // This may be a section, an article, a div or an aside
    render_open_tag($section);

    // Check if a background image is set
    $has_background_image = isset($background_image['url']) && !empty($background_image['url']);

    // TODO: can we add the image url to a custom variable on the wapper element?
    // If a background image is set, add the URL to the wrapper element
    // something like 'style="--background-image: url(' . $background_image['url'] . ')"'
    // This would allow us to use the image as a background image in CSS
    
    // If a background image is set, render it
    if ($has_background_image) {
      echo "<div class='background-image'>";
      $background_image['alt_text'] = "";  // This is a background image, force alt text to be empty so screen readers ignore it
      render_image_component($background_image);
      echo "</div>";
    }
   
    // Get the template part for the current layout and pass the props to it
    get_template_part( 'page_sections/' . $section, null, array('props' => $props));

    // Close the wrapper element
    render_close_tag($section);
  }