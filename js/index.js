const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3012a5789amshb1eff803550883fp1f5e41jsn50a3411ce678",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};

const searchResultPage = document.getElementById("search-results");
const artistPage = document.getElementById("artist-results");
const artistInfo = document.getElementById("artistInfo");
const singlesDisplay = document.getElementById("singles-display");
const albumsDisplay = document.getElementById("albums-display");
const searchResultsDiv = document.createElement("div");
searchResultsDiv.setAttribute("class", "resultsContainer");
searchResultPage.append(searchResultsDiv);

// Fetches artists information from user input field
// NOTE: We need to use encodeURI with the input value
async function getSearchData() {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/search?q=robbie%20williams&type=artists&offset=0&limit=8&numberOfTopResults=5`,
    options
  );
  let data = await res.json();
  // console.log(data);
  const artistInfo = data.artists.items;
  for (let i = 0; i < artistInfo.length; i++) {
    displaySearchResults(artistInfo[i]);
  }
}
getSearchData();
// Fetches artist data once artist ID has been retrieved from getSearchData function
async function getArtistData(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_albums?id=${id}&offset=0&limit=100`,
    options
  );
  let data = await res.json();
  console.log(data);
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
  for (let i = 0; i < results.length; i++) {
    console.log(results[i].data);
  }
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
  });
}

function ArtistDetail(id) {
  getArtistSingles(id).then(artistSinglesDisplay);
  // getArtistAlbums(id).then(artistAlbumsDisplay);
}

// function artistAlbumsDisplay(data) {
//   console.log(data.items);
// }
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
