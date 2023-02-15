const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "56a481a6c9msh38b8bbd5b875a97p1d018fjsn1f4b7a74da4a",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const artistInfoTwo = document.getElementById("artist-info");
const concertResults = document.getElementById("concertResults");
async function getId() {
  let searchParam = await window.location.search;
  let itemId = searchParam.slice(1);
  artistInfo(itemId);
}

async function artistInfo(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_overview?id=${id}`,
    options
  );
  let data = await res.json();
  let artist = data.data.artist;
  artistDisplay(artist);
  if (data.data.artist.goods.events.concerts.totalCount > 0) {
    displayConcertResults(data);
  } else {
    concertResults.innerHTML = `<h4 class="noData">There are no upcoming concerts for this artist.</h4>`;
  }
}
// data.artist.goods.events.concerts.items;

function artistDisplay(data) {
  let followers = data.stats.followers.toLocaleString("en-US");
  artistInfoTwo.innerHTML = `
      <div class="">
          <img src="${data.visuals.avatarImage.sources[0].url}" alt="robbie">
      </div>
      <div class="mt-2 text-center text-white">
          <div>
              <h2>${data.profile.name}</h2>
              <p>Followers: ${followers}</p>
              <h4>Upcoming Concerts</h4>
          </div>
      </div>
  `;
}

function displayConcertResults(data) {
  let concerts = data.data.artist.goods.events.concerts.items;
  concertResults.innerHTML = concerts
    .map(
      (concert) => `
    <div class="cardDetail">
        <h4>${concert.title}</h4>
        <p>${dayjs(concert.date.isoString).format("dddd D MMM YYYY")}</p>
            <div class="venue pt-2" >
                <h6>Venue</h6>
                <p>${concert.venue.name}</p>
                <p>Location: ${concert.venue.location.name}</p>
                <a lat="${concert.venue.coordinates.longitude}" lng="${
        concert.venue.coordinates.latitude
      }" type="button" id="showMap" class="map-link pt-2" data-toggle="modal"
                    data-target=".bd-example-modal-lg">Map</a>
            </div>
    </div>
    `
    )
    .join("");

  mapView();
}

function mapView() {
  if (showMap) {
    for (let i = 0; i < showMap.length; i++) {
      let mapView = showMap[i];
      mapView.addEventListener("click", (e) => {
        let lat = e.target.attributes.lat.nodeValue;
        let lng = e.target.attributes.lng.nodeValue;
        displayMap(lat, lng);
      });
    }
  }
}

function displayMap(x, y) {
  let lat = parseFloat(y);
  let lng = parseFloat(x);
  const venue = { lat, lng };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: venue,
  });
  const marker = new google.maps.Marker({
    position: venue,
    map: map,
  });
}
function initmap() {}
