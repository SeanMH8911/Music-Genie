const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3ab7fa8a4fmshdf8195db21d0557p1ca9ecjsn23f05237fe27",
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
const newArr = [];
if (storedName === null) {
  $("#modal-content-welcome").modal("show");
  storeName();
}
function storeName() {
  nameSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(nameInput.value);
    let newName = {
      name: nameInput.value,
    };
    localStorage.setItem("name", JSON.stringify(newName));
    $("#modal-content-welcome").modal("hide");
  });
}
if (storedName) {
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
  console.log(data);
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
