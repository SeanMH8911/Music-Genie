// extract HTML elements

const favouriteBtn = document.getElementById("favouriteBtn");
const favouriteContainer = document.getElementById("favouriteContainer");
const favouriteResults = document.getElementById("favouriteResults");
const favouriteContainer = document.getElementById("favouriteContainer");
const favouriteArtistResults = document.getElementById("favouriteArtistResults");
const artistInfo = document.getElementById("artistInfo");
const singlesDisplay = document.getElementById("singlesDisplay");
const albumsDisplay = document.getElementById("albumsDisplay");



// Add event listener to favouriteBtn
// Add favourite artist object to event listener

favouriteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let favouriteArtist = {
    artist: "artistInfo";
    singles: "singlesDisplay";
    albums: "albumsDisplay";

});

// Local Storage

let favouriteArtist = localStorage.getItem("favouriteArtist")

localStorage.setItem("Favourite Artist", JSON.stringify(favouriteArtist));

Let favouriteArtist = JSON.parse(localStorage.getItem("Favourite Artist"));

