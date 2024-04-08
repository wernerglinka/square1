<?php
  include_once get_template_directory() . '/page_sections/inc/section_components.php';

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

  //echo "<pre>";
  //print_r($props);
  //echo "</pre>";

  // Check if common section fields are set, if not set to false
  $common_fields = isset($props['common_section_fields']) ? $props['common_section_fields'] : false;

  // Check if the section is disabled
  $is_disabled = $common_fields ? in_array("is_disabled", $props['common_section_fields']['settings']) : false;

  // If the section is not disabled, proceed with rendering
  if (!$is_disabled) {

    // render the opening tag for the section.
    // This may be a section, an article, a div or an aside
    render_open_tag($section);

    // Get the template part for the current layout and pass the props to it
    get_template_part( 'page_sections/' . $section, null, array('props' => $props));

    // Close the wrapper element
    render_close_tag($section);
  }