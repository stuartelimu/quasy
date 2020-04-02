(function() {
  var jquery_version = '3.3.1';
  var site_url = 'https://b2c08473.ngrok.io/';
  var static_url = site_url + 'static/';
  var min_width = 100;
  var min_height = 100;

  function bookmarklet(msg) {
    // bookmarklet code
    // load css
    var css = jQuery('<link>');
    css.attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.random()*9999999999999)
    });
    jQuery('head').append(css);

    // load HTML
    box_html = `<div id="bookmarklet"><a href="#" id="close">&times;</a>
    <h1>Select an image to bookmark:</h1><div class="images"></div></div>`;

    jQuery('body').append(box_html);

    // close event
    jQuery('#bookmarklet #close').click(function(){
      jQuery('#bookmarklet').remove();
    });

    // find images and display them
    jQuery.each(jQuery('img[src$="jpg"]'), function(index, image) {
      if (jQuery(image).width() >= min_width && jQuery(image).height() >= min_height) {
        image_url = jQuery(image).attr('src');
        jQuery("#bookmarklet .images").append('<a href="#"><img src="'+image_url+'" /></a>');
      }
    })

    // when image is selected open url with it
    jQuery('#bookmarklet .images a').click(function(e) {
      selected_image = jQuery(this).children('img').attr('src')                 
      // hide bookmarklet
      jQuery('#bookmarklet').hide();
      // open new window to submit the image
      window.open(site_url + 'images/create/?url='
        + encodeURIComponent(selected_image)
        + '&title='
        + encodeURIComponent(jQuery('title').text()),
        '_blank');
    })

  };

  // check if jquery is loaded
  if (typeof window.jQuery !== 'undefined') {
    bookmarklet();
    
  } else {
    // check for conflicts
    var conflict = typeof window.$ != 'undefined';
    // create the script and point to google api
    var script = document.createElement('script');
    script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js';
    // add the script to the 'head' for processing
    document.head.appendChild(script);
    // create a way to load until script finished to load
    var attempts = 15;
    (function() {
      // check again if jquery is undefined
      if (typeof window.jQuery == 'undefined') {
        if (--attempts > 0) {
          // calls himself in a few milliseconds
          window.setTimeout(arguments.callee, 250)
        } else {
          // too much attempts to load, send an error
          alert('an error occured while loading jQuery');
        }
      } else {
        bookmarklet();
      }
    })();
  }
})();