var geocoder = new google.maps.Geocoder();
var map;
var infoWindow = new google.maps.InfoWindow({map: map});

function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(33.7489,-84.388);
  var mapOptions = {
    zoom: 12,
    center: latlng
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  var infoWindow = new google.maps.InfoWindow({map: map});
  // HTML5 geolocation. Get current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You Are Here');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function geocodeAddress(address) {
    geocoder.geocode({address: address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {

        infoWindow.setPosition(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          title: "Our Location"
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

// fetch & Geocode Address from profile page
function fetchAddress() {
      var street = document.getElementById('addressStreet').innerHTML;
      var city = document.getElementById('addressCity').innerHTML;
      var address = street + city;
      console.log('This is the address to geocode: ' + address);
      geocodeAddress(address);
    }
    fetchAddress();
}

// function codeAddress(address) {
//   geocoder.geocode({'address': address }, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       map.setCenter(results.geometry.location);
//       var marker = new google.maps.Marker({
//           map: map,
//           position: results.geometry.location
//       });
//     } else {
//       alert("Geocode was not successful for the following reason: " + status);
//     }
//   });
// }


// function geocodeAddress(address) {
//   // var address = document.getElementById('farmAddress').innerHTML;
//   geocoder.geocode({address: address}, function(results, status) {
//     if (status === google.maps.GeocoderStatus.OK) {
//       map.setPosition(results[0].geometry.location);
//       var marker = new google.maps.Marker({
//         map: map,
//         position: results[0].geometry.location,
//         title: "OMG!!"
//       });
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }

// // fetch & Geocode Address from profile page
// function fetchAddress() {
//       var address = document.getElementById('farmAddress').innerHTML;
//       console.log('This is the address to geocode: ' + address);
//       geocodeAddress(address);
//     }

google.maps.event.addDomListener(window, 'load', initialize);

// Grid styling for search results
$('.grid').masonry({
  // options
  itemSelector: '.grid-item',
  columnWidth: 2
});

// Autoscroll forms into view
function scrollPage() {
  $('html, body').animate({
    scrollTop: $('#sign_up').offset().top
    }, 600);
}

