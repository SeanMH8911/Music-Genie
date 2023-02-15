const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "56a481a6c9msh38b8bbd5b875a97p1d018fjsn1f4b7a74da4a",
    "X-RapidAPI-Host": "spotify81.p.rapidapi.com",
  },
};
const storedName = JSON.parse(localStorage.getItem("name"));
const storedFavs = JSON.parse(localStorage.getItem("favs")) || [];
const modal = document.getElementById("modal-content-welcome");
const nameInput = document.getElementById("nameInput");
const nameSubmit = document.getElementById("nameSubmit");
const welcome = document.getElementById("welcome");
const myFavourites = document.getElementById("myFavourites");
if (storedName === null) {
  $("#modal-content-welcome").modal("show");
  storeName();
}
function storeName() {
  nameSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    let newName = {
      name: nameInput.value,
    };
    localStorage.setItem("name", JSON.stringify(newName));
    $("#modal-content-welcome").modal("hide");
    setName();
  });
}
if (storedName) {
  setName();
}

function setName() {
  welcome.innerHTML = `Welcome, <span style="color:#B91372">${storedName.name}</span>`;
}

if (storedFavs) {
  for (let i = 0; i < storedFavs.length; i++) {
    artistInfo(storedFavs[i].id);
  }
}
async function artistInfo(id) {
  let res = await fetch(
    `https://spotify81.p.rapidapi.com/artist_overview?id=${id}`,
    options
  );
  let data = await res.json();
  displayArtist(data);
}

function displayArtist(data) {
  myFavourites.innerHTML += `
  <div class="artistDetail">
    <img class="artistImg" src="${data.data.artist.visuals.avatarImage.sources[1].url}"></img>
    <h3>${data.data.artist.profile.name}</h3>
  </div>
  `;
}

if (!storedFavs) {
  myFavourites.innerHTML = `<p class="noItemMsg"> You do not have any favourites stored yet</p>`;
}
