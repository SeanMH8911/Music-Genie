const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "56a481a6c9msh38b8bbd5b875a97p1d018fjsn1f4b7a74da4a",
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
const errorMsg = document.getElementById("errorMsg");
const searchResultsDiv = document.createElement("div");
const loading = document.querySelector(".loading");
const loadingTwo = document.querySelector(".loading-2");
const returnTop = document.querySelector(".returnTop");
const favourites = localStorage.getItem("favs");
let favData = favourites ? JSON.parse(favourites) : [];
searchResultsDiv.setAttribute("class", "resultsContainer");
searchResultPage.append(searchResultsDiv);

searchBtn.addEventListener("click", (e) => {
  artistContainer.classList.add("hide");
  e.preventDefault();
  searchResultsDiv.innerHTML = "";
  loadingTwo.classList.remove("none");
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
    hideError();
    showResults();
    const artistInfo = data.artists.items;
    for (let i = 0; i < artistInfo.length; i++) {
      displaySearchResults(artistInfo[i]);
      searchContainer.scrollIntoView({
        behavior: "smooth",
      });
      loading.classList.add("none");
    }
  } else {
    showError();
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

// Displays artist information
function artistInfoDisplay(data) {
  let followers = data.stats.followers.toLocaleString("en-US");
  let bio = data.profile.biography.text;
  artistInfo.innerHTML = `
      <div class="artist-image">
          <img src="${data.visuals.avatarImage.sources[0].url}" alt="robbie">
      </div>
      <div class="ml-4 text-white">
          <div>
             <div class="d-flex">
               <h2>${data.profile.name}</h2>
              <button id="favouriteBtn" data-id="${data.id}" class="favBtn ml-2">
              <i id="heartFav" class="fa-regular fa-heart"></i>
              </button>
             </div>
              <p>Followers: ${followers}</p>
              <a data-id="${data.id}"  target="_blank" href="https://seanmh8911.github.io/Music-Genie/concerts.html?${data.id}">Upcoming Concerts</a>
              
          </div>
      </div>
  `;
  modalContent.innerHTML = bio;
  biography.innerHTML = `<p class ="bio-text">
  ${truncate(bio)}
  </p>
   
  `;
  if (favouriteBtn) {
    document.getElementById("favouriteBtn").addEventListener("click", (e) => {
      let favItem = e.target;
      let itemId = e.target.parentElement.dataset.id;
      storeItem(itemId);
      favItem.classList.add("favBtnStored");
    });
  }
  if (favourites) {
    let itemId = favouriteBtn.dataset.id;
    let storedItems = JSON.parse(favourites);
    for (let j = 0; j < storedItems.length; j++) {
      if (itemId === storedItems[j].id) {
        document.getElementById("heartFav").classList.add("favBtnStored");
      }
    }
  }
}

// Truncates the biography to fit in its container
// with a read more button to expand into a modal
function truncate(bio) {
  let ellipsis = "...";
  let limit = 500;
  if (bio.length >= limit) {
    let newBio = bio.slice(0, limit);
    return (
      newBio +
      ellipsis +
      `<a type="button" class="bio-link pl-1" data-toggle="modal"
  data-target=".bd-example-modal-lg">Read more</a>`
    );
  } else {
    return bio;
  }
}

// Display all ablums for artist ID
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
          
          <div class="ml-auto d-inline-block text-nowrap">
            <a target="_blank" href="${album.releases.items[0].sharingInfo.shareUrl}">
              <i class="fa-solid fa-play"></i>
            </a>
          </div>
      </div>
      `
    )
    .join("");
}

// Display all singles for artist ID
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
         <div class="ml-auto d-inline-block text-nowrap">
            <a class="" target="_blank" href="${item.releases.items[0].sharingInfo.shareUrl}">
              <i class="fa-solid fa-play"></i>
            </a>
          </div>
      </div>
      `
    )
    .join("");
}

// Return to top of page function
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    returnTop.style.display = "block";
  } else {
    returnTop.style.display = "none";
  }
}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function showError() {
  errorMsg.classList.remove("hide");
}

function hideError() {
  errorMsg.classList.add("hide");
}

// Stores in local storage

function checkStored() {}

function storeItem(item) {
  let newItem = {
    id: item,
  };
  favData.push(newItem);
  localStorage.setItem("favs", JSON.stringify(favData));
}

console.log(favData);
