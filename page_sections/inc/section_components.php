<?php
  /**
   * Render the opening tag for a section
   * This may be a section, an article, a div or an aside
   * The ID, all classes, and inline styles will be added here.
   * In addition the opening tag for a container div is added
   */
  function render_open_tag($section) {
    // Get the properties for the current section
    $props = get_sub_field($section);

    //echo "<pre>";
    //print_r($props);
    //echo "</pre>";

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

  /**
   * Render the closing tag for a section
   * In addition the closing tag for the container div is added
   */
  function render_close_tag($section) {
    // First close the container div which is opened in render_open_tag
    echo "</div><!-- container -->";

    // Get the properties for the current section
    $props = get_sub_field($section);

    // Get the wrapper type, default to 'section' if not set
    $wrapper_type = $props['common_section_fields'] ? $props['common_section_fields']['wrapper_element'] : 'section';

    echo sprintf("</%s>", $wrapper_type);
  }

  /**
   * Render a text component
   * wp editor adds <p> tags. we use a regex to strip the opening 
   * and the closing tag. Everything in between remains
   * The code must start with an opening tag and end with a closing tag. 
   * No white space or other text must be present before the first 
   * ^<[^>]+>     This removes the first tag
   * <\/[^>]+>$   This removes the last closing tag
   */
  function render_text_component($text) {
    $output = '';

    $title = $text['title'] ?? null;
    if ($title) {
        $title = preg_replace('/^<[^>]+>|<\/[^>]+>$/', '', $title);
        render_title($title, $text['heading_level']);
    }

    $sub_title = $text['sub_title'] ?? null;
    if ($sub_title) {
        $output .= "<p class='text-subtitle'>{$sub_title}</p>";
    }

    $prose = $text['prose'] ?? null;
    if ($prose) {
        $output .= "<div class='text-prose'>{$prose}</div>";
    }

    echo $output;
  }


  /**
   * Render a CTA component. 
   * The link may rendered as a button or text link.
   * External links will be rendered with target="_blank" and rel="noopener noreferrer" 
   */
  function render_cta_component($cta) {
    if (!$cta['link']) {
      return;
    }

    $url = $cta['link']['url'];
    $label = $cta['link']['title'];
    $button_class = !empty($cta['is_button']) ? "button " . $cta['button_type'] . " " : "text-link ";
    $button_class .= $cta['cta_classes'] ?? '';
    $external_attributes = isset($cta['link']['target']) ? "target='_blank' rel='noopener noreferrer'" : null;
    $hint = $cta['link']['target'] === "_blank" ? "<span class='screen-reader-text'>Opens a new tab</span>" : null;

    echo "<a class='cta " . esc_attr($button_class) . "' href='" . esc_url($url) . "' $external_attributes>" . esc_html($label) . $hint . "</a>";
  }

  /**
   * Render an icon link list component
   */
  function render_icon_link_list_component($links) {
    if (empty($links)) {
      return;
    }

    $output = "<ul class='icon-links'>";
    foreach ($links as $link) {
      $icon = file_get_contents(get_template_directory() . '/icons/' . $link['icon'] . '.svg');
      $output .= "<li>
        <a href='" . esc_url($link['target']['url']) . "' target='" . esc_attr($link['target']['target']) . "'>
          {$icon}
          <span>" . esc_html($link['label']) . "</span>
        </a>
      </li>";
    }
    $output .= "</ul>";
    echo $output;
  }
  
  /**
   * Render an audio component with optional thumbnail
   */
  function render_audio_component($audio) {
    if (!isset($audio['source'])) {
      return;
    }

    // get the audio file extension so we can form the proper mime type
    // the url may include a query parameter, so we use parse_url to get the path
    $audio_path = parse_url($audio['source'])['path'];
    $audio_file_extension = trim(pathinfo($audio_path)['extension']);

    echo "<audio controls>
      <source src='" . esc_url($audio['source']) . "' type='audio/" . esc_attr($audio_file_extension) . "'/>
      Your browser does not support the audio element.
    </audio>";
  }

  /**
   * Render an icon component
   */
  function render_icon_component($icon) {
    if (!isset($icon['icons'])) {
      return;
    }

    $icon_path = get_template_directory() . '/icons/' . $icon['icons'] . '.svg';
    echo file_get_contents($icon_path);
  }

  /**
   * Render an image component with alt text and credits
   */
  function render_image_component($image) {
    $image_id = $image['id'];

    if (!$image_id) {
      return;
    }

    echo wp_get_attachment_image($image_id, 'large', false, ['alt' => $image['alt_text']]);
  }

  /**
   * Render an video component with optional thumbnail
   */
  function render_video_component($video) {
      extract($video);

      if ($inline) : ?>
        <div class="inline">
          <div class="inline-video-wrapper js-inline-video-wrapper">
            <div class="js-inline-video" data-videoid="<?php echo esc_attr($id); ?>"></div>
          </div>
      
          <button class="video-trigger">
            <div class="play-button"></div>
            <img src="<?php echo esc_url($thumbnail['url']); ?>" alt="<?php echo esc_attr($thumbnail['alt_text']); ?>" />
          </button>
        </div>
      <?php else : ?>
        <button class="js-modal-video" data-videoid="<?php echo esc_attr($id); ?>" data-videosrc="<?php echo esc_url($source); ?>" >
          <div class="play-button"></div>
          <img src="<?php echo esc_url($thumbnail['url']); ?>" alt="<?php echo esc_attr($thumbnail['alt_text']); ?>" />
        </button>
      <?php endif;  
  }

  /** 
   * Render a resourse card component
   */
  function render_resources_list_component($resources) {
    if (!empty($resources)) {
      $output = "<ul class='resources-cards'>";
      foreach ($resources as $resource) {
        $resourceID = $resource->ID;
        $title = get_the_title($resourceID);
        $logoURL = get_the_post_thumbnail_url($resourceID);
        $thumbnailURL = get_field('image', $resourceID);
        $link = get_field('link', $resourceID)['link'];
        $url = $link['url'];
        $target = $link['target'];
        $label = $link['title'];
        $external_attributes = isset($target) ? "target='_blank' rel='noopener noreferrer'" : null;
        $term_list = get_the_terms($resourceID, 'resource-taxonomy');
        $category = $term_list[0]->slug;

        $output .= "<li class='card'>
            <div class='header'>
                <div class='category'>{$category}</div>
                <p class='title'>{$title}</p>
            </div>
            <div class='image'>
                <img src='{$thumbnailURL}' alt='{$title}'/>
            </div>
            <div class='footer'>
                <a class='cta' href='{$url}' {$external_attributes}>{$label}</a>
            </div>
        </li>";
      }
      $output .= "</ul>";
      echo $output;
    }
  }
