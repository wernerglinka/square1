<?php
  function render_close_tag($section) {
    // Get the properties for the current section
    $props = get_sub_field($section);

    // common section fields are set, was check before function call
    $common_fields = $props['common_section_fields'];

    // Get the wrapper type, default to 'section' if not set
    $wrapper_type = $common_fields ? $props['common_section_fields']['wrapper_element'] : 'section';

    echo sprintf("</%s>", $wrapper_type);
}
?>