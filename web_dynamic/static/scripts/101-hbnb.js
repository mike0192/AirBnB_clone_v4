
$(document).ready(function () {
    console.log('document loaded');
  
    // Show API Status
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      }
    }).fail(function (d, textStatus, err) {
      $('DIV#api_status').removeClass('available');
    });
  
    // GET All Places and Show on DOM on initial load
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify({})
    }).done((res) => {
      console.log(res);
      const places = $('section.places');
  
      for (let place of res) {
        let article = $('<article></article>');
  
        article.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
        article.append('<h2>' + place.name + '</h2>');
        let subdiv = $('<div class="informations"></div>')
        subdiv.append('<div class="max_guest">' + place.max_guest + ' Guests</div>');
        subdiv.append('<div class="number_rooms">' + place.number_rooms + ' Rooms</div>');
        subdiv.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
        article.append(subdiv);
        article.append('<div class="description">' + place.description + '</div>');
  
        places.append(article);
      }
    });
  
    // Display all checked Amenities
    const amenityStorage = {};
  
    $('li :checkbox').change(function () {
      let id = $(this).attr('data-id');
      let name = $(this).attr('data-name');
  
      if (this.checked) {
        amenityStorage[id] = name;
      } else {
        delete amenityStorage[id];
      }
  
      $('div.amenities h4').empty();
  
      let amenitiesText = $.map(amenityStorage, function (v) {
        return v;
      }).join(', ');
  
      $('div.amenities h4').text(amenitiesText);
    });
  
    // Store checked State or City IDs
    const locationsChecked = {};
  
    $('section.filters :checkbox').change(function () {
      let id = $(this).attr('data-id');
      let name = $(this).attr('data-name');
  
      if (this.checked) {
        locationsChecked[id] = name;
      } else {
        delete locationsChecked[id];
      }
  
      $('div.locations h4').empty();
  
      let locationsText = $.map(locationsChecked, function (v) {
        return v;
      }).join(', ');
  
      $('div.locations h4').text(locationsText);
    });
  
    // Filter Places based on Amenities, Cities, and States Checked
    $('section.filters button').on('click', function () {
      let amenitiesChecked = Object.keys(amenityStorage);
      let citiesStatesChecked = Object.keys(locationsChecked);
  
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
          amenities: amenitiesChecked,
          cities: citiesStatesChecked
        })
      }).done((res) => {
        console.log(res);
        const places = $('section.places');
        places.empty();
  
        for (let place of res) {
          let article = $('<article></article>');
  
          article.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
          article.append('<h2>' + place.name + '</h2>');
          let subdiv = $('<div class="informations"></div>')
          subdiv.append('<div class="max_guest">' + place.max_guest + ' Guests</div>');
          subdiv.append('<div class="number_rooms">' + place.number_rooms + ' Rooms</div>');
          subdiv.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathrooms</div>');
          article.append(subdiv);
          article.append('<div class="description">' + place.description + '</div>');
  
          places.append(article);
        };
      });
    });
  
    // Toggle Reviews
    $('#toggleReviews').on('click', function () {
      if ($(this).text() === 'show') {
        // Fetch and display reviews
        // For now, let's just change the text to "hide"
        $(this).text('hide');
      } else {
        // Hide reviews
        $('.reviews').remove();
        // Change the text back to "show"
        $(this).text('show');
      }
    });
  });
  