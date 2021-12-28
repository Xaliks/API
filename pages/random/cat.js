const fetch = require("node-fetch");

const links = [
  "https://nekos.life/api/v2/img/meow", // 0 .url
  "https://thatcopy.pw/catapi/rest/", // 1 .url
  "https://cataas.com/cat?json=true", // 2 domain + .url
  "https://api.thecatapi.com/v1/images/search", // 3 [0].url
  "https://aws.random.cat/meow", // 4 .file
  "https://some-random-api.ml/img/cat", // 5 .link
  "https://shibe.online/api/cats", // 6 [0]
];

module.exports = (app) => {
  app.get("/random/cat", async (req, resp) => {
    const rand = random(1, links.length);
    const data = await fetch(links[rand - 1]).then((resp) => resp.json());
    let image;

    if (rand === 0 || rand === 1) image = data.url;
    if (rand === 2) image = "https://cataas.com" + data.url;
    if (rand === 3) image = data[0].url;
    if (rand === 4) image = data.file;
    if (rand === 5) image = data.link;
    if (rand === 6) image = data[0];

    return resp.send({
      image,
    });
  });
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
