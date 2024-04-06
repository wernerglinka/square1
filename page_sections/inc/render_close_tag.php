<?php
  function render_close_tag($section) {
    // First close the container div which is opened in render_open_tag
    echo "</div><!-- container -->";

    // Get the properties for the current section
    $props = get_sub_field($section);

    // Get the wrapper type, default to 'section' if not set
    $wrapper_type = $props['common_section_fields'] ? $props['common_section_fields']['wrapper_element'] : 'section';

    echo sprintf("</%s>", $wrapper_type);
}
?>