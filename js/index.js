const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "3012a5789amshb1eff803550883fp1f5e41jsn50a3411ce678",
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
  },
};

fetch(
  "https://spotify23.p.rapidapi.com/artists/?ids=2w9zwq3AktTeYYMuhMjju8",
  options
)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
