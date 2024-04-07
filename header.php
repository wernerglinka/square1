<?php
/**
 * The header for the square1 theme
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @package square1
 */

?>
<!doctype html>
<html <?php language_attributes();?>>
<head>
	<meta charset="<?php bloginfo('charset');?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory(); ?>/favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory(); ?>/favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory(); ?>/favicons/favicon-16x16.png">
	<link rel="manifest" href="<?php echo get_template_directory(); ?>/favicons/site.webmanifest">
	<link rel="mask-icon" href="<?php echo get_template_directory(); ?>/favicons/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="apple-mobile-web-app-title" content="square1">
	<meta name="application-name" content="square1">
	<meta name="msapplication-TileColor" content="#da532c">
	<meta name="theme-color" content="#ffffff">

	<?php wp_head();?>
</head>

<body <?php body_class();?>>

<div class="accessibility-menu">
	<div class="accessibility-icon" id="js-accessibility-options">
		<?php include get_template_directory() . '/icons/accessibility.svg';?>
	</div>
	<ul class="accessibility-list">
		<li class="increase-text">
			<?php include get_template_directory() . '/icons/zoom-in.svg';?>Increase Text Size
		</li>
		<li class="decrease-text">
			<?php include get_template_directory() . '/icons/zoom-out.svg';?>Decrease Text Size
		</li>
		<li class="grayscale">
			<?php include get_template_directory() . '/icons/gray-scale.svg';?>Grayscale
		</li>
		<li class="underline">
			<?php include get_template_directory() . '/icons/underline.svg';?>Underline Links
		</li>
		<li class="reset-options">
			<?php include get_template_directory() . '/icons/reset.svg';?>Reset
		</li>
	</ul>
</div>

<a id="at-top"></a>

<?php wp_body_open();?>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e('Skip to content', 'mhac');?></a>

	<header id="masthead" class="site-header js-header">
		<div class="container">
			<div class="site-branding">
				<?php if (is_front_page()): ?>
					<?php include get_template_directory() . '/images/square1-logo.svg';?>
				<?php else: ?>
					<a href="<?php echo esc_url(home_url('/')); ?>" class="custom-logo-link" rel="home" aria-current="page">
						<?php include get_template_directory() . '/images/square1-logo.svg';?>
						<span class="screen-reader-text"><?php echo _x('Go Home', 'home link') ?></span>
					</a>
				<?php endif;?>
				<span class="screen-reader-text"><?php bloginfo('name');?></span>
			</div><!-- .site-branding -->

			<nav id="site-navigation" class="main-navigation js-main-menu">

				<div class="search-wrapper mobile-search">
					<?php get_search_form();?>
				</div><!-- .search-wrapper -->

				<?php
					wp_nav_menu(
						array(
							'theme_location' => 'menu-1',
							'menu_id' => 'primary-menu',
						)
					);
				?>

				<div class="search-wrapper desktop-search">
					<button class="search-icon js-search-icon" role="button">
						<?php
							//include the search icon as menu item
							include get_template_directory() . '/icons/search.svg';
						?>
						<span class="screen-reader-text"><?php echo _x('Open Search Pane', 'open search') ?></span>
					</button><!-- .search-icon -->
					<?php get_search_form();?>
				</div><!-- .search-wrapper -->

			</nav><!-- #site-navigation -->

			<div class="button-wrapper">
				<button class="hamburger js-hamburger" aria-controls="primary-menu" aria-expanded="false">
					<strong class="screen-reader-text"><?php echo _x('Open menu', 'Menu button') ?></strong>
					<span></span>
				</button>
			</div>
		</div>
	</header><!-- #masthead -->
