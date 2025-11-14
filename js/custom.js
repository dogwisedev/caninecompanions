/* -------------------------------------------------
   custom.js – safe for every page (product.html, index.html, etc.)
   ------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. CURRENT YEAR ---------- */
  const displayYear = document.getElementById('displayYear');
  if (displayYear) {
    displayYear.textContent = new Date().getFullYear();
  }

  /* ---------- 2. OWL CAROUSEL (client testimonials) ---------- */
  // Only try to initialise if:
  //   • the carousel container exists
  //   • jQuery and owlCarousel are available
  if (document.querySelector('.client_owl-carousel')) {
    if (typeof $ !== 'undefined' && typeof $.fn.owlCarousel === 'function') {
      $('.client_owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        dots: false,
        nav: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
          '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        responsive: {
          0   : { items: 1 },
          768 : { items: 2 },
          1000: { items: 2 }
        }
      });
    } else {
      console.warn('Owl Carousel not loaded – skipping slider');
    }
  }

  /* ---------- 3. GOOGLE MAP (contact page) ---------- */
  // Only create the map if the container exists
  if (document.getElementById('googleMap')) {
    // The function is still globally available for <body onload="myMap()">
    window.myMap = function () {
      const mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18
      };
      new google.maps.Map(document.getElementById('googleMap'), mapProp);
    };

    // If the page already has onload="myMap()" it will fire automatically.
    // Otherwise call it now (safe if the API script is already loaded).
    if (typeof google !== 'undefined' && google.maps) {
      window.myMap();
    }
  }

  console.log('custom.js loaded – no errors');
});
