<?php
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
        echo "<p class='sub-title'>" . $text['sub_title'] . "</p>";
    }
    if(isset($text['prose']) && $text['prose']) {
        echo "<div class='prose'>" . $text['prose'] . "</div>";
    }
}

  /**
   * Render a CTA component. 
   * The link may rendered as a button or text link.
   * External links will be rendered with target="_blank" and rel="noopener noreferrer" 
   */
  function render_cta_component($cta) {
    echo "<span class='cta-wrapper'>";
    if( $cta['target'] ){
      $button_class = !empty($cta['is_button']) ? "button " . $cta['button_type'] . " " : "text-link ";
      $button_class = !empty($cta['cta_classes']) ? $button_class . $cta['cta_classes'] : $button_class;
      $external_attributes = !empty($cta['is_external']) ? "target='_blank' rel='noopener noreferrer'" : null;
      $hint = !empty($cta['is_external']) ? "<span class='screen-reader-text'>Opens a new tab</span>" : null;

      echo "<a class='cta " . $button_class . "' href='" . $cta['target'] . "' $external_attributes>" . $cta['label'] . $hint . "</a>";
    }
    echo "</span>";
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
    if (isset($image['url'])) {
      echo "<img src='" . $image['url'] . "' alt='" . $image['alt_text'] . "'/>";
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

  /** 
   * Render a research article card component
   */
  function render_research_articles_cards_component($articles) {
    if( !empty($articles) ) {
      echo "<ul class='resource-cards'>";
      foreach($articles as $card) {

        echo "<li class='resource-card'>";

        echo "<div class='resource-card__image'>";

          if(get_the_post_thumbnail_url($card->ID)) {
            // limit the height of the logo if max_logo_height is set
            // to maintain a visual balance with all other logos we may need to limit the height
            // of the logo. This is especially important if the logo is not square
            $style = '';
            $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
            if ($limit_height_to < 80) {
              $style = "style='max-height:{$limit_height_to}px'";
            }
            
            echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          } else {
            //display the org name
            echo get_field('author_organization', $card->ID);
          }
          echo "</div>";

          echo "<div class='resource-card__header'>";
            echo "<p class='resource-card__title'>" . get_the_title($card->ID) . "</p>";
          echo "</div>";

          

          // add link if url is set
          if( get_field('url', $card->ID)['url']) {
            echo "<div class='resource-card__footer'>";
            $external_attributes = get_field('url', $card->ID)['target'] == "_blank" ? "target='_blank' rel='noopener noreferrer'" : null;
            echo "<a class='resource-card__cta text-link' href='" . get_field('url', $card->ID)['url'] . "'" . $external_attributes . "> Read Article</a>";
            echo "</div>";
          }
         
           
        echo "</li>";
      }
      echo "</ul>";
    }
  }
  
  /** 
   * Render a cc members card component
   */
  function render_cc_members_cards_component($members) {
    if( !empty($members) ) {
      echo "<ul class='member-cards'>";
      foreach($members as $card) {

        echo "<li class='member-card'>";

          // add link if url is set
          if( get_field('url', $card->ID)['url']) {
            $external_attributes = get_field('url', $card->ID)['target'] == "_blank" ? "target='_blank' rel='noopener noreferrer'" : null;
            echo "<a href='" . get_field('url', $card->ID)['url'] . "'" . $external_attributes . ">";
          }

            if(get_the_post_thumbnail_url($card->ID)) {
              // limit the height of the logo if max_logo_height is set
              // to maintain a visual balance with all other logos we may need to limit the height
              // of the logo. This is especially important if the logo is not square
              $style = '';
              $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
              if ($limit_height_to < 80) {
                $style = "style='max-height:{$limit_height_to}px'";
              }
              
              echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
            } else {
              //display the org name
              echo get_field('author_organization', $card->ID);
            }
          
            if( get_field('url', $card->ID)['url']) {
              echo "</a>";
            }
 
        echo "</li>";
      }
      echo "</ul>";
    }
  }

  /** 
   * Render a cc members card component
   */
  function render_corporate_advisors_component($members) {
    if( !empty($members) ) {
      echo "<ul class='corporate-advisors'>";
      foreach($members as $card) {
        echo "<li class='advisor'>";
          // add link if url is set
          if(get_the_post_thumbnail_url($card->ID)) {
              // limit the height of the logo if max_logo_height is set
              // to maintain a visual balance with all other logos we may need to limit the height
              // of the logo. This is especially important if the logo is not square
              $style = '';
              $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
              if ($limit_height_to < 80) {
                $style = "style='max-height:{$limit_height_to}px'";
              }
              
              echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          }
        echo "</li>";
      }
      echo "</ul>";
    }
  }
  
  /** 
   * Render a sponsors card component
   */
  function render_sponsors_list_component($sponsors) {
    if( !empty($sponsors) ) {
      echo "<ul class='sponsors-list'>";
      foreach($sponsors as $card) {
        echo "<li class='sponsor'>";

          $sponsor_link = $card->link;

          // wrap logo with link if url is set
          if(isset($sponsor_link) && isset($sponsor_link['url'])) {
            echo "<a href='" . $sponsor_link['url'] . "' target='_blank' rel='noopener noreferrer'>";
          }

          if(get_the_post_thumbnail_url($card->ID)) {
            // limit the height of the logo if max_logo_height is set
            // to maintain a visual balance with all other logos we may need to limit the height
            // of the logo. This is especially important if the logo is not square
            $style = '';
            $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
            if ($limit_height_to < 80) {
              $style = "style='max-height:{$limit_height_to}px'";
            }
            
            echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          }

          if(isset($sponsor_link) && isset($sponsor_link['url'])) {
            echo "</a>";
          }

        echo "</li>";
      }
      echo "</ul>";
    }
  }
  
  /** 
   * Render a resourse card component
   */
  function render_support_orgs_component($articles) {
    if( !empty($articles) ) {
      echo "<ul class='resource-cards'>";
      foreach($articles as $card) {

        echo "<li class='resource-card'>";

        echo "<div class='resource-card__image'>";

          if(get_the_post_thumbnail_url($card->ID)) {
            // limit the height of the logo if max_logo_height is set
            // to maintain a visual balance with all other logos we may need to limit the height
            // of the logo. This is especially important if the logo is not square
            $style = '';
            $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
            if ($limit_height_to < 80) {
              $style = "style='max-height:{$limit_height_to}px'";
            }
            
            echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          } else {
            //display the org name
            echo get_field('author_organization', $card->ID);
          }
          echo "</div>";

          echo "<div class='resource-card__header'>";
            echo "<p class='resource-card__title'>" . get_the_title($card->ID) . "</p>";
          echo "</div>";

          echo "<div class='resource-card__intro'>";
            echo $card->post_content;
          echo "</div>";
          
           
        echo "</li>";
      }
      echo "</ul>";
    }
  }
    
  /** 
   * Render a get help component
   */
  function render_get_help_component($orgs) {
    if( !empty($orgs) ) {
      echo "<ul class='get-help-widgets'>";
      foreach($orgs as $card) {

        echo "<li class='get-help-widget'>";

        echo "<div class='get-help-widget__image'>";

          if(get_the_post_thumbnail_url($card->ID)) {
            // limit the height of the logo if max_logo_height is set
            // to maintain a visual balance with all other logos we may need to limit the height
            // of the logo. This is especially important if the logo is not square
            $style = '';
            $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
            if ($limit_height_to < 80) {
              $style = "style='max-height:{$limit_height_to}px'";
            }
            
            echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          } else {
            //display the org name
            echo get_the_title($card->ID);
          }
          echo "</div>";

          $widget_fields = get_field('get_help_widget', $card->ID);

          if (!empty($widget_fields['by_line'])) {
            echo "<div class='get-help-widget__byline'>";
            echo $widget_fields['by_line'];
            echo "</div>";
          }

          if (!empty($widget_fields['action_number'])) {
            echo "<div class='get-help-widget__action'>";
            echo $widget_fields['action_number'];
            echo "</div>";
          }
          
           
        echo "</li>";
      }
      echo "</ul>";
    }
  }

  /** 
   * Render a news article card component
   */
  function render_news_articles_cards_component($articles) {
    if( !empty($articles) ) {
      echo "<ul class='resource-cards'>";
      foreach($articles as $card) {

        echo "<li class='resource-card'>";

        echo "<div class='resource-card__image'>";

          if(get_the_post_thumbnail_url($card->ID)) {
            // limit the height of the logo if max_logo_height is set
            // to maintain a visual balance with all other logos we may need to limit the height
            // of the logo. This is especially important if the logo is not square
            $style = '';
            $limit_height_to = get_field('max_logo_height', $card->ID) ? get_field('max_logo_height', $card->ID) : 80;
            if ($limit_height_to < 80) {
              $style = "style='max-height:{$limit_height_to}px'";
            }
            
            echo "<img src='" . get_the_post_thumbnail_url($card->ID) . "' alt='" . get_the_title($card->ID) . "' " . $style . " />";
          } else {
            //display the org name
            echo get_field('author_organization', $card->ID);
          }
          echo "</div>";

          echo "<div class='resource-card__header'>";
            echo "<time>" . get_the_date('F j, Y', $card->ID) . "</time>";
            echo "<p class='resource-card__title'>" . get_the_title($card->ID) . "</p>";
          echo "</div>";

          $hint = get_field('hint', $card->ID);
          $has_hint = !empty($hint) ? true : false;
          
          if ($has_hint) {
            echo "<div class='resource-card__hint'>";
              echo "<p>" . get_field('hint', $card->ID) . "</p>";
            echo "</div>";
          }

          $footer = "<div class='resource-card__footer'>";
          $cta = "<a class='resource-card__cta text-link' href='";
          $is_video = get_field('is_video', $card->ID);
          $read_article = $is_video ? "'> View Video</a>" : "'> Read Article</a>";
          $end_div = "</div>";

          if ($card->post_type == 'news' && get_field('link', $card->ID)['url']) {
              $external_attributes = get_field('link', $card->ID)['target'] == "_blank" ? "target='_blank' rel='noopener noreferrer'" : null;
              echo $footer . $cta . get_field('link', $card->ID)['url'] . "'" . $external_attributes . $read_article . $end_div;
          } else {
              $post_url = get_permalink($card->ID);
              echo $footer . $cta . $post_url . $read_article . $end_div;
          }
 
        echo "</li>";
      }
      echo "</ul>";
    }
  }