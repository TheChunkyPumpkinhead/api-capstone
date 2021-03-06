const WEATHER_SEARCH_URL = 'https://api.weatherbit.io/v2.0/current?key=fee3ae2602624a9d9b6a079c9fd71a1e&city=';
const FOURSQUARE_SEARCH_URL = 'https://api.foursquare.com/v2/venues/explore?&client_id=4YC5WWSFAGURCS15AFPKE5PFYPWUNUD2ZN5SS0JY30KVEGNC&client_secret=ZVDCWQC1VRTSZUH2N1GOEUKGGI4NNLAHS3KH4ZFFID2QJ15F&v=20170915';


function scrollPageTo(myTarget, topPadding) {
  if (topPadding === undefined) {
    topPadding = 0;
  }
  var moveTo = $(myTarget).offset().top - topPadding;
  $('html, body').stop().animate({
    scrollTop: moveTo
  }, 200);
}



function getWeatherData() {
  let city = $('.search-query').val();



  fetch(
   WEATHER_SEARCH_URL + `${city}&`,
  )
    .then(res => res.json())
    .then(function (data) {
    
      let widget = displayWeather(data);
      $('#weather-display').html(widget);
      scrollPageTo('#weather-display', 15);

    });
}

function displayWeather(response) {

  data = response.data[0];

  return `
  <div class="weather-results">
      <h1><strong>Current Weather for ${data.city_name}</strong></h1>
    
      
      <p style="color:black" ">Description:</p><p"> ${data.weather.description}</p>
      <p style="color:black;">Temperature:</p><p> ${data.temp} &#8457; / ${(((data.temp) - 32) * (5 / 9)).toFixed(2)} &#8451;</p>
      <p style="color:black;">Min. Temperature:</p><p> ${data.min_temp} &#8457; / ${((data.min_temp - 32) * (5 / 9)).toFixed(2)}&#8451</p>
      <p style="color:black;">Max. Temperature:</p><p> ${data.max_temp} &#8457; / ${((data.max_temp - 32) * (5 / 9)).toFixed(2)} &#8451</p>
   
  </div>
`;
}


function getFourSquareData() {
  $('.category-button').click(function () {
    let city = $('.search-query').val();
    let category = $(this).text();
    let url = new URL (FOURSQUARE_SEARCH_URL);
    const params = {
      near: city,
      venuePhotos: 1,
      limit: 9,
      query: 'recommended',
      section: category,
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    fetch(url)
      .then(res => res.json())
      .then(function (data) {
      
        try {
          let results = data.response.groups[0].items.map(function (item, index) {
            return displayResults(item);
          });
          $('#foursquare-results').html(results);
          scrollPageTo('#foursquare-results', 15);
        } catch (e) {
       
          $('#foursquare-results').html("<div class='result'><p>No Results Found.</p></div>");
        }
      })
      .catch(function () {
        $('#foursquare-results').html("<div class='result'><p>No Results Found.</p></div>");
      });
  });
}

function displayResults(result) {
  let image;
 


  if (result.venue.photos.groups[0]) {
    image = result.venue.photos[0].groups[0].items[0].suffix;
   


  }
  return `
      <div class="result col-3">
        
          <div class="result-description">
              <h2 class="result-name"><a href="https://foursquare.com/v/link/${result.venue.id}" target="_blank">${result.venue.name}</a></h2>
              <span class="icon">
                  <img src="${result.venue.categories[0].icon.prefix}bg_32${result.venue.categories[0].icon.suffix}" alt="category-icon ${result.venue.id}">
              </span>
              <span class="icon-text">
                  ${result.venue.categories[0].name}
              </span>
              <p class="result-address">${result.venue.location.formattedAddress[0]}</p>
              <p class="result-address">${result.venue.location.formattedAddress[1]}</p>
              <p class="result-address">${result.venue.location.formattedAddress[2]}</p>
          </div>
      </div>
`;
}


function enterLocation() {
  $('.category-button').click(function () {
    $('button').removeClass("selected");
    $(this).addClass("selected");
  });

  $('.search-form').submit(function (event) {
    event.preventDefault();
    $('.navigation').removeClass("hide");
    $('#weather-display').html("");
    $('#foursquare-results').html("");
    getWeatherData();
    getFourSquareData();
    $('button').removeClass('selected');
  });
}

//autocomplete location name in form
function activatePlacesSearch() {
  let options = {
    types: ['(regions)']
  };
  let input = document.getElementById('search-term');
  let autocomplete = new google.maps.places.Autocomplete(input, options);
}


$(enterLocation);
