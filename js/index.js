const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "0c0c5c0c13msh67880f8a661c91fp1595d2jsned8e886d0cd7",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const searchResultPage = document.getElementById("search-results");
const searchContainer = document.getElementById("search-container");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");
const artistPage = document.getElementById("artist-results");
const artistInfo = document.getElementById("artistInfo");
const modalContent = document.getElementById("modal-content");
const artistContainer = document.getElementById("artist-container");
const biography = document.getElementById("biography");
const singlesDisplay = document.getElementById("singles-display");
const albumsDisplay = document.getElementById("albums-display");
const searchResultsDiv = document.createElement("div");
const loading = document.querySelector(".loading");
const loadingTwo = document.querySelector(".loading-2");

searchResultsDiv.setAttribute("class", "resultsContainer");
searchResultPage.append(searchResultsDiv);

searchBtn.addEventListener("click", (e) => {
  artistContainer.classList.add("hide");
  e.preventDefault();
  searchResultsDiv.innerHTML = "";
  let search = searchInput.value.trim();
  let searchValue = encodeURI(search);
  getSearchData(searchValue);
});

// Fetches artists information from user input field
async function getSearchData(search) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/search?q=${search}&type=artists&offset=0&limit=8&numberOfTopResults=5`,
    options
  );
  if (res.status === 200) {
    let data = await res.json();
    loading.classList.add("none");
    showResults();
    const artistInfo = data.artists.items;
    for (let i = 0; i < artistInfo.length; i++) {
      displaySearchResults(artistInfo[i]);
    }
  } else {
    console.log("Place error function here");
  }
}
// Fetches artist data once artist ID has been retrieved from getSearchData function
async function getArtistData(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_overview?id=${id}`,
    options
  );
  let data = await res.json();
  let artist = data.data.artist;
  loadingTwo.classList.add("none");
  return artist;
}
// Fetch artist singles using artist id retrieved from getSearchData function
async function getArtistSingles(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_singles?id=${id}`,
    options
  );
  let data = await res.json();
  let singles = data.data.artist.discography.singles;
  return singles;
}

// Fetch artist albums using artist id retrieved from getSearchData function
async function getArtistAlbums(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_albums?id=${id}&offset=0&limit=100`,
    options
  );
  let data = await res.json();
  let albums = data.data.artist.discography.albums;
  return albums;
}

function searchResultsLoop(results) {
  for (let i = 0; i < results.length; i++) {}
}
// Displays the search results on a search results page
function displaySearchResults(artistInfo) {
  // Create elements to display search results data
  const resultCard = document.createElement("div");
  resultCard.setAttribute("class", "card");
  // Search results required data
  const artistName = artistInfo.data.profile.name;
  const artistImage = artistInfo.data.visuals.avatarImage.sources[0].url;
  const artistID = artistInfo.data.uri.split(":").pop();
  resultCard.setAttribute("data-id", artistID);
  resultCard.innerHTML = `
      <h1>${artistName}</h1>
      <img src="${artistImage}"></img>
  `;
  searchResultsDiv.append(resultCard);
  resultCard.addEventListener("click", () => {
    let spotifyId = resultCard.dataset.id;
    ArtistDetail(spotifyId);
    showDetailedResults();
  });
}

// Function to show and hide results section
function showDetailedResults() {
  artistContainer.classList.remove("hide");
  artistContainer.scrollIntoView({
    behavior: "smooth",
  });
}
// Function to show and hide results section
function showResults() {
  searchContainer.classList.remove("hide");
}

function ArtistDetail(id) {
  getArtistSingles(id).then(artistSinglesDisplay);
  getArtistAlbums(id).then(artistAlbumsDisplay);
  getArtistData(id).then(artistInfoDisplay);
}

function artistInfoDisplay(data) {
  // artist.profile.biography we need to add the biography!!
  let followers = data.stats.followers.toLocaleString("en-US");
  artistInfo.innerHTML = `
                    <div class="artist-image">
                        <img src="${data.visuals.avatarImage.sources[0].url}" alt="robbie">
                    </div>
                    <div class="ml-4 text-white">
                        <div>
                            <h2>${data.profile.name}</h2>
                            <p>Followers: ${followers}</p>
                            <a type="button" class="bio-link" data-toggle="modal"
                            data-target=".bd-example-modal-lg">Biography</a>
                        </div>
                    </div>
  `;
  modalContent.innerHTML = data.profile.biography.text;
}
function artistAlbumsDisplay(data) {
  let albums = data.items;
  albumsDisplay.innerHTML = albums
    .map(
      (album) =>
        `
      <div class="single-item" id="${album.releases.items[0].id}">
        <div class="mr-2">
          <img src="${album.releases.items[0].coverArt.sources[1].url}"></img>
        </div>
          <h4 class="mr-2">${album.releases.items[0].name}</h4>
          <a target="_blank" href="${album.releases.items[0].sharingInfo.shareUrl}">
            <i class="fa-solid fa-play"></i>
          </a>
      </div>
      `
    )
    .join("");
}
function artistSinglesDisplay(data) {
  let singles = data.items;
  singlesDisplay.innerHTML = singles
    .map(
      (item) =>
        `
      <div class="single-item" id="${item.releases.items[0].id}">
        <div class="mr-2">
          <img src="${item.releases.items[0].coverArt.sources[1].url}"></img>
        </div>
          <h4 class="mr-2">${item.releases.items[0].name}</h4>
          <a target="_blank" href="${item.releases.items[0].sharingInfo.shareUrl}">
            <i class="fa-solid fa-play"></i>
          </a>
      </div>
      `
    )
    .join("");
}
