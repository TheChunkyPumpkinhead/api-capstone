'use strict';



function generateArtistsListItem(item) {
  console.log("generateArtistsListItem() ran");

  return `
    <li>
      <h3>${item.name}</h3>
      <a> ${item.url}</a>
      <p>${item.dates.start.localDate}
      ${item.dates.start.localTime}
      </p>
      <img src="${item.seatmap.staticUrl}"/>

    </li>`;
}



function generateArtistsListString(responseJSON) {
  const events = responseJSON._embedded.events;
  if (!responseJSON._embedded) {
    return;
  }
  const artistsListString = events.map(event => generateArtistsListItem(event));

  return artistsListString.join('');
}



function displayArtists(artistsJSON) {
  console.log(artistsJSON);
  artistsJSON = JSON.parse(artistsJSON.contents);
  $('#results-list').empty();

  const statesSelected = $('#js-search-state').val();
  $('#js-state-names').text(statesSelected.toUpperCase());
  
  const citySelected = $('#js-search-city').val();
  $('#js-city-names').text(citySelected.toUpperCase());

  const artistsList = generateArtistsListString(artistsJSON);
  $('#results-list').html(artistsList);


  $('#results').removeClass('hidden');

}



function formatQueryParameters(params) {
  ;
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURI(params[key])}`);
  return queryItems.join('&');
}

const apiKey = 'tgNA06Gb6i1GSqAlRbVafAZqytcLhKBV';

function getArtists(searchState, searchCity, searchRadius) {
  // mentor issues to check do i  need heroku
  const endpointURL = ' https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2';
  const params = {
    apiKey: apiKey,
    stateCode: searchState,
    city: `[${searchCity}]`,
    radius: searchRadius
  };

  const queryString = formatQueryParameters(params);
  const url = `${endpointURL}?${queryString}`;

  console.log(queryString);

  fetchEvents(url).then(
    events => console.log(events)
  );

  fetch(url)
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
    .then(
      responseJSON => displayArtists(responseJSON)
    )
    .catch(
      error => {
        alert("fetch response failed");
        console.log(error);
        $('#results').addClass('hidden');
        $('#js-error-message').text(`${error.message}`);
      }
    );
}

async function fetchEvents(url) {
  let response =  fetch(url).then(res => res.json())
  .then(data => console.log(data));

  if (!response._embedded) {
    return;
  }
  const events = response._embedded.events;

  const details =  Promise.all(
    events.map(
      e => fetch(`https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2${e.id}?apikey=${apiKey}`)
        .then(res => res.json()
        )
    )
  );

  return events.map((e, i) => ({ ...e, details: details[i] }));
}




function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchState = $('#js-search-state').val();
    const searchCity= $('#js-search-city').val();
    const searchRadius = $('#js-search-radius').val();
    getArtists(searchState, `[${searchCity}]`, searchRadius);
  });
  console.log($('#js-search-radius').val())
  console.log($('#js-search-city').val())
  console.log($('#js-search-state').val())

}


$(watchForm);