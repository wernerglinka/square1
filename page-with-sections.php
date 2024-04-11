<?php
/**
 * Sectioned Page Blank Template
 * Template for a sectioned page
 * 
 * Template Name: Sectioned Page
 * Template Post Type: page, component
 *
 * @package square1
 */

 
 include_once(get_template_directory() . '/page_sections/inc/shared_functions.php');
 include_once(get_template_directory() . '/page_sections/inc/section_components.php');

  get_header();
?>
		<main id="primary" class="site-main">
    
		<?php	
      // ID of the current item in the WordPress Loop
      $id = get_the_ID();

			// check if the flexible content field has rows of data
      if ( have_rows( 'sections', $id ) ) :
        
        // loop through the selected ACF layouts and display the matching section
        while ( have_rows( 'sections', $id ) ) : the_row();
          include(get_template_directory() . '/page_sections/inc/render_layout.php');
        endwhile;
      elseif ( get_the_content() ) :
        echo "No sections found.";
      endif;
		?>
		
		</main><!-- #main -->
    
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>