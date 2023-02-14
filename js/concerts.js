const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "0c0c5c0c13msh67880f8a661c91fp1595d2jsned8e886d0cd7",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};
const loading = document.querySelector(".loading");
const artistInfoTwo = document.getElementById("artist-info");
const concertResults = document.getElementById("concertResults");
// const modalContent = document.getElementById("modalContent")
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
  loading.classList.add("none");
  artistDisplay(artist);
  displayConcertResults(data);
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
  let lat =
    data.data.artist.goods.events.concerts.items[0].venue.coordinates.latitude;
  console.log(lat);
  let lng =
    data.data.artist.goods.events.concerts.items[0].venue.coordinates.longitude;
  console.log(lng);
  console.log(concerts);
  concertResults.innerHTML = concerts
    .map(
      (concert) => `
    <div class="cardDetail">
        <h4>${concert.title}</h4>
        <p>${dayjs(concert.date.isoString).format("dddd D MMM YYYY")}</p>
            <div class="venue pt-2" >
                <h6>Venue</h6>
                <p>${concert.venue.name}</p>
                <p>Country: ${concert.venue.location.name}</p>
                <a type="button" id="showMap" class="map-link pt-2" data-toggle="modal"
                    data-target=".bd-example-modal-lg">Map</a>
            </div>
    </div>
    `
    )
    .join("");
  console.log(lat, lng);
  if (showMap) {
    const showMap = document.getElementById("showMap");
    showMap.addEventListener("click", () => {
      initMap(lat, lng);
    });
  }
}

// / Initialize and add the map
function initMap(lat, lng) {
  // The location of Uluru
  const venue = { lat: parseFloat(lat), lng: parseFloat(lng) };
  // The map, centered at Uluru
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: {
      lat,
      lng,
    },
  });
  //   The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: venue,
    map: map,
  });
}
