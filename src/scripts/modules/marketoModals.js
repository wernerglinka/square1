/* jsLint es6, this: true */
/* global YT, jQuery, window */

const marketoModal = (function ($) {
  const init = function () {
    const marketoTriggers = $('.marketo-modal-trigger');
    const marketoFormContainer = $('.marketo-form-container');

    // load the Marketo Forms2 library
    $.getScript('//app-sj13.marketo.com/js/forms2/js/forms2.min.js');

    // on touchclick we open on overlay and load the form
    marketoTriggers.on('touchclick', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const thisMarketoTrigger = $(this);
      const marketoFormTitle = thisMarketoTrigger.data('marketo-title');
      const marketoFormID = thisMarketoTrigger.data('marketo-id');
      const marketoTarget = `<div class="inner"><h2>${marketoFormTitle}</h2><form id='mktoForm_${marketoFormID}' class='clearfix'></form></div>`;

      marketoFormContainer.append(marketoTarget);

      MktoForms2.loadForm('//app-sjst.marketo.com', '785-UHP-775', marketoFormID, (form) => {
        // >>>>> NEED TO ADD A THANK YOU MESSAGE

        // add onSuccess callback
        form.onSuccess(() => {
          // hide overlay after successful submission
          marketoFormContainer.find('.inner').remove();
          marketoFormContainer.fadeOut();

          // return false to prevent redirection to thank you page
          return false;
        });

        // add class so we can position the GDPR consent checkbox
        $('[for^="GDPR_Consent"]').parents('.mktoFormRow').addClass('gdpr-consent');

        // remove the external stylesheets
        const links = window.document.getElementsByTagName('link');
        $(links).each(function () {
          const thisLinkElement = $(this);
          const thisLinkURL = thisLinkElement.attr('href');
          if (thisLinkURL.indexOf('marketo.com') > 1) {
            thisLinkElement.remove();
          }
        });
        // and the inline styles
        const marketoForms = $("[id*='mktoForm']");
        marketoForms.each(function () {
          $(this).find('style').remove();
        });
        // and the style attributes
        marketoForms.each(function () {
          $(this).removeAttr('style');
          $(this).find('[style]').removeAttr('style');
        });

        marketoForms.each(function () {
          const thisMarketoForm = $(this);
          // thisMarketoForm.find('select').niceSelect();
          thisMarketoForm.find(':checkbox').after("<i class='icon icon-checkmark'></i>");
        });

        marketoFormContainer.fadeIn();
      });
    });

    marketoFormContainer.find('.icon-x').on('touchclick', function () {
      const thisMarketoContainer = $(this).parent();
      thisMarketoContainer.find('.inner').remove();
      thisMarketoContainer.fadeOut();
    });
  };

  return {
    init
  };
}(jQuery));
