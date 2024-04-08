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
    if (isset($text['title']) && $text['title']) {
        $title = preg_replace( '/^<[^>]+>|<\/[^>]+>$/', '',$text['title']);
        render_title($title, $text['heading_level']); 
    }
    if(isset($text['sub_title']) && $text['sub_title']) {
        echo "<p class='text-subtitle'>" . $text['sub_title'] . "</p>";
    }
    if(isset($text['prose']) && $text['prose']) {
        echo "<div class='text-prose'>" . $text['prose'] . "</div>";
    }
}

  /**
   * Render a CTA component. 
   * The link may rendered as a button or text link.
   * External links will be rendered with target="_blank" and rel="noopener noreferrer" 
   */
  function render_cta_component($cta) {
    if( $cta['target'] ){
      echo "<span class='cta-wrapper'>";
    
      $button_class = !empty($cta['is_button']) ? "button " . $cta['button_type'] . " " : "text-link ";
      $button_class = !empty($cta['cta_classes']) ? $button_class . $cta['cta_classes'] : $button_class;
      $external_attributes = !empty($cta['is_external']) ? "target='_blank' rel='noopener noreferrer'" : null;
      $hint = !empty($cta['is_external']) ? "<span class='screen-reader-text'>Opens a new tab</span>" : null;

      echo "<a class='cta " . $button_class . "' href='" . $cta['target'] . "' $external_attributes>" . $cta['label'] . $hint . "</a>";

      echo "</span>";
    }
  }

  /**
   * Render an audio component with optional thumbnail
   */
  function render_audio_component($audio) {
    if (isset($audio['source'])) {
      // get the audio file extension so we can form the proper mime type
      // the url may include a query parameter, so we use parse_url to get the path
      $audio_path = parse_url($audio['source'])['path'];
      $audio_file_extension = trim(pathinfo($audio_path)['extension']);

      echo "<audio controls>";
      echo "<source src='" . $audio['source'] . "' 'type=audio/" . $audio_file_extension . "'/>";
      echo "Your browser does not support the audio element.";
      echo "</audio>";
    } 
  }

  /**
   * Render an icon component
   */
  function render_icon_component($icon) {
    if (isset($icon['icons'])) {
      echo include(get_template_directory() . '/icons/' . $icon['icons'] . '.svg');
    } 
  }

  /**
   * Render an image component with alt text and credits
   */
  function render_image_component($image) {
    $image_id = $image['id'];

    if ($image_id) {
      $image_src = wp_get_attachment_image_url($image_id, 'large');
      $image_srcset = wp_get_attachment_image_srcset($image_id, 'large');
      $image_sizes = wp_get_attachment_image_sizes($image_id, 'large');

      // Display image with src, srcset, sizes, and alt attributes.
      echo '<img src="' . esc_url($image_src) . '" srcset="' . esc_attr($image_srcset) . '" sizes="' . esc_attr($image_sizes) . '" alt="' . esc_attr($image['alt_text']) . '">';
    }
  }

  /**
   * Render an video component with optional thumbnail
   */
  function render_video_component($video) {
    if ($video['inline']) : ?>
      <div class="inline">
        <div class="inline-video-wrapper js-inline-video-wrapper">
          <div class="js-inline-video" data-videoid="<?php echo $video['id']; ?>"></div>
        </div>
    
        <button class="video-trigger">
          <div class="play-button"></div>
          <img src="<?php echo $video['thumbnail']['url']; ?>" alt="<?php echo $video['thumbnail']['alt_text']; ?>" />
        </button>
      </div>
    <?php else : ?>
      <button class="js-modal-video" data-videoid="<?php echo $video['id']; ?>" data-videosrc="<?php echo $video['source']; ?>" >
        <div class="play-button"></div>
        <img src="<?php echo $video['thumbnail']['url']; ?>" alt="<?php echo $video['thumbnail']['alt_text']; ?>" />
      </button>
    <?php endif;  
  }

  /** 
   * Render a resourse card component
   */
  function render_resource_cards_component($cards) {
    if( !empty($cards) ) {
      echo "<ul class='resource-cards'>";
      foreach($cards as $card) {
        $term_list = get_the_terms( $card->ID, 'resource_taxonomy' );
        $category = $term_list[0]->slug;

        echo "<li class='resource-card'>";
          echo "<div class='resource-card__header'>";
            echo "<div class='resource-card__category'>" . $category . "</div>";
            echo "<p class='resource-card__title'>" . get_field('title', $card->ID) . "</p>";
          echo "</div>";

          echo "<div class='resource-card__image'>";
            echo "<img src='" . get_field('image', $card->ID)['url'] . "' alt='" . get_field('title', $card->ID) . "'/>";
          echo "</div>";
          
          echo "<div class='resource-card__footer'>";
            $external_attributes = !empty(get_field('cta', $card->ID)['is_external']) ? "target='_blank' rel='noopener noreferrer'" : null;
            echo "<a class='resource-card__cta' href='" . get_field('cta', $card->ID)['target'] . "'" . $external_attributes . ">" . get_field('cta', $card->ID)['label'] . "</a>";
        echo "</li>";
      }
      echo "</ul>";
    }
  }